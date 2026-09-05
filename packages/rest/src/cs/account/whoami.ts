import { type } from "arktype";
import { endpoint } from "../../endpoint.js";

export const GetWhoami = endpoint({
	method: "GET",
	endpoint: "/_matrix/client/v3/account/whoami",

	response: type({
		/** The user ID that owns this access token. */
		user_id: "string",
		/** @addedIn v1.2 */
		is_guest: "boolean = false",
		/** Device ID associated with this access token. @addedIn v1.1 */
		device_id: "string",
	}),
});
