import { describe, expect, test } from "vitest";
import { origin, useHomeserver } from "@matrix-nebu/tests";
import { HttpClient } from "./http";
import { GetWhoami } from "../cs/account/whoami";

const hs = useHomeserver();
const client = new HttpClient(origin, hs.fetch);

describe("HttpClient", () => {
	test("sends JSON and bearer headers with defaults", async () => {
		client.setBearerToken("secret");

		hs.intercept({
			method: "GET",
			path: GetWhoami.endpoint,
			headers: { Authorization: "Bearer secret", "Content-Type": "application/json" },
		}).reply(200, { user_id: "@pixie:homeserver.test", device_id: "test" });

		await expect(client.request(GetWhoami, {})).resolves.toEqual({
			user_id: "@pixie:homeserver.test",
			device_id: "test",
			is_guest: false,
		});
	});
});
