import { describe, expect, test } from "vitest";
import { origin, useHomeserver } from "@matrix-nebu/tests";
import { REST } from "./index.js";
import type { EndpointRequest } from "../index.js";

const hs = useHomeserver();

describe("REST", () => {
	describe(".execute()", () => {
		test("sends a simple unauthenticated GET request", async () => {
			const rest = new REST(origin, hs.fetch);

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
	});
});
