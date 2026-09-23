import { type } from "arktype";
import { Endpoint } from "../../endpoint.js";

export const GetWhoami = new Endpoint({
	method: "GET",
	endpoint: "/_matrix/client/v3/account/whoami",

	response: {
		/** The user ID that owns this access token. */
		user_id: "string",
		/** @addedIn v1.2 */
		is_guest: "boolean = false",
		/** Device ID associated with this access token. @addedIn v1.1 */
		device_id: "string",
	},
});
