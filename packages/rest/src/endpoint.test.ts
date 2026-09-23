import { describe, test, expect } from "vitest";
import { type } from "arktype";
import { type EndpointRequest, Endpoint } from "./endpoint.js";

describe("Endpoint", () => {
	describe("toRequest", () => {
		test("simple endpoint with no parameters", () => {
			const e = new Endpoint({
				method: "GET",
				endpoint: "/test",
				response: { ok: "boolean" },
			});

			const req = e.toRequest({});

			expect(req).toEqual<EndpointRequest>({
				method: "GET",
				path: "/test",
			});
		});

		test("properly assigns request body, path, and query parameters", () => {
			const e = new Endpoint({
				method: "POST",

				endpoint: "/test/{path1}/{path2}",
				path: {
					path1: "string",
					path2: "string",
				},

				query: {
					query1: "string",
					query2: "boolean",
				},

				request: {
					body1: "string",
					body2: "number",
				},

				response: { ok: "boolean" },
			});

			const req = e.toRequest({
				path1: "path1",
				path2: "path2",
				query1: "query1",
				query2: true,
				body1: "body1",
				body2: 42,
			});

			expect(req).toEqual<EndpointRequest>({
				method: "POST",
				path: "/test/path1/path2?query1=query1&query2=true",
				body: {
					body1: "body1",
					body2: 42,
				},
			});
		});
	});
});
