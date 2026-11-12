import { route } from "./route.js";
import { describe, test, expect } from "vitest";

describe("Route", () => {
	test("serializes a simple route with no parameters", () => {
		const E = route("GET", "/test").response<{ bool: boolean }>();

		const req = E.serialize({});

		expect(req).toEqual({
			method: "GET",
			path: "/test",
		});
	});

	test("serializes a route with path and query parameters", () => {
		const E = route("GET", "/test/{id}").query<{ filter: string }>().response<{ bool: boolean }>();

		const req = E.serialize({
			id: "123",
			filter: "active",
		});

		expect(req).toEqual({
			method: "GET",
			path: "/test/123?filter=active",
		});
	});

	test("properly URL-escapes path and query parameters", () => {
		const E = route("GET", "/test/{id}").query<{ filter: string }>().response<{ bool: boolean }>();

		const req = E.serialize({
			id: "a b",
			filter: "c d",
		});

		expect(req).toEqual({
			method: "GET",
			path: "/test/a%20b?filter=c%20d",
		});
	});

	test("serializes a route with a request body", () => {
		const E = route("POST", "/test").body<{ name: string }>().response<{ id: string }>();

		const req = E.serialize({
			body: { name: "Alice" },
		});

		expect(req).toEqual({
			method: "POST",
			path: "/test",
			body: { name: "Alice" },
		});
	});
});
