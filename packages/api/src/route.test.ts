import { route } from "./route.js";
import { describe, test, expect } from "vitest";

describe("RouteBuilder", () => {
	test("serializes a simple route with no parameters", () => {
		const E = route("GET", "/test").response<{ bool: boolean }>();

		const req = E.serialize({});

		expect(req).toEqual({
			method: "GET",
			path: "/test",
		});
	});

	test("serializes a route with path and query parameters", () => {
		const E = route("GET", "/test/{id}")
			.path<{ id: string }>()
			.query<{ filter: string }>()
			.response<{ bool: boolean }>();

		const req = E.serialize({
			path: { id: "123" },
			query: { filter: "active" },
		});

		expect(req).toEqual({
			method: "GET",
			path: "/test/123?filter=active",
		});
	});

	test("properly URL-escapes path and query parameters", () => {
		const E = route("GET", "/test/{id}")
			.path<{ id: string }>()
			.query<{ filter: string }>()
			.response<{ bool: boolean }>();

		const req = E.serialize({
			path: { id: "a b" },
			query: { filter: "c d" },
		});

		expect(req).toEqual({
			method: "GET",
			path: "/test/a%20b?filter=c%20d",
		});
	});
});
