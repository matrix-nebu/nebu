import { vi, describe, expect, test, beforeEach, afterEach } from "vitest";
import { origin, useHomeserver } from "@matrix-nebu/tests";
import { MatrixError, type EndpointRequest, routes } from "../index.js";
import { REST } from "./index.js";

const hs = useHomeserver();
const rest = new REST(origin, { fetch: hs.fetch });

describe("REST", () => {
	describe(".execute()", () => {
		test("sends a simple unauthenticated GET request", async () => {
			const request: EndpointRequest = {
				method: "GET",
				path: "/test",
			};

			hs.intercept({
				method: "GET",
				path: "/test",
				headers: {},
			}).reply(200, { success: true });

			await expect(rest.execute(request)).resolves.toEqual({ success: true });
		});

		test("sends a simple authenticated GET request", async () => {
			const rest = new REST(origin, { fetch: hs.fetch });
			rest.setAccessToken("test-token");

			const request: EndpointRequest = {
				method: "GET",
				path: "/test",
			};

			hs.intercept({
				method: "GET",
				path: "/test",
				headers: {
					Authorization: "Bearer test-token",
				},
			}).reply(200, { success: true });

			await expect(rest.execute(request)).resolves.toEqual({ success: true });
		});

		test("sends a POST request with a JSON body", async () => {
			const request: EndpointRequest = {
				method: "POST",
				path: "/test",
				body: { key: "value" },
			};

			hs.intercept({
				method: "POST",
				path: "/test",
				headers: {
					"Content-Type": "application/json",
				},
				body: '{"key":"value"}',
			}).reply(200, { success: true });

			await expect(rest.execute(request)).resolves.toEqual({ success: true });
		});

		test("throws MatrixError for server error responses", async () => {
			const request: EndpointRequest = {
				method: "GET",
				path: "/test",
			};

			hs.intercept({
				method: "GET",
				path: "/test",
			}).reply(400, {
				errcode: "M_UNKNOWN",
				error: "An unknown error has occurred.",
			});

			await expect(rest.execute(request)).rejects.toThrow(
				expect.objectContaining({
					constructor: MatrixError,
					errcode: "M_UNKNOWN",
					error: "An unknown error has occurred.",
				}),
			);
		});

		test("throws on non-JSON responses", async () => {
			const request: EndpointRequest = {
				method: "GET",
				path: "/test",
			};

			hs.intercept({
				method: "GET",
				path: "/test",
			}).reply(200, "not json");

			await expect(rest.execute(request)).rejects.toThrow();
		});

		describe("timeouts", () => {
			beforeEach(() => {
				vi.useFakeTimers();

				// useFakeTimers doesn't mock AbortSignal.timeout, so we override it with our own
				// setTimeout-backed implementation (obeying vitest timers)
				vi.spyOn(AbortSignal, "timeout").mockImplementation((ms: number): AbortSignal => {
					const controller = new AbortController();
					setTimeout(() => {
						// matches the native AbortSignal error, per mdn:
						// https://developer.mozilla.org/en-US/docs/Web/API/DOMException#timeouterror
						controller.abort(new DOMException("The operation timed out.", "TimeoutError"));
					}, ms);
					return controller.signal;
				});
			});

			afterEach(() => {
				vi.useRealTimers();
			});

			test("times out based on the instance global timeout", async () => {
				const rest = new REST(origin, { fetch: hs.fetch, timeout: 1000 });

				const request: EndpointRequest = {
					method: "GET",
					path: "/test",
				};

				hs.intercept({
					method: "GET",
					path: "/test",
				})
					.reply(200, {})
					.delay(2000);

				const promise = rest.execute(request);

				vi.advanceTimersByTime(1000);

				await expect(promise).rejects.toThrow();
			});

			test("times out based on the per-request timeout", async () => {
				const rest = new REST(origin, { fetch: hs.fetch });

				const request: EndpointRequest = {
					method: "GET",
					path: "/test",
				};

				hs.intercept({
					method: "GET",
					path: "/test",
				})
					.reply(200, {})
					.delay(2000);

				const promise = rest.execute(request, { timeout: 1000 });

				vi.advanceTimersByTime(1000);

				await expect(promise).rejects.toThrow();
			});
		});

		test("aborts based on the provided AbortSignal", async () => {
			const controller = new AbortController();

			const request: EndpointRequest = {
				method: "GET",
				path: "/test",
			};

			hs.intercept({
				method: "GET",
				path: "/test",
			})
				.reply(200, {})
				.delay(2000);

			const promise = rest.execute(request, { signal: controller.signal });

			controller.abort();

			await expect(promise).rejects.toThrow();
		});
	});

	describe(".request()", () => {
		test("properly serializes a Route and its inputs", async () => {
			hs.intercept({
				method: "GET",
				path: "/_matrix/client/versions",
			}).reply(200, { versions: ["v1.19"] });

			await expect(rest.request(routes.GetVersions, {})).resolves.toEqual({
				versions: ["v1.19"],
			});
		});
	});
});
