import { route } from "../../route.js";

export interface WhoamiResponse {
	/** Device ID associated with the access token. Omitted if there is no device. @addedIn v1.1 */
	device_id?: string;
	/** `true` if the user is a guest user. @addedIn v1.2 */
	is_guest?: boolean;
	/** The User ID that owns the access token. */
	user_id: string;
}

/** Gets information about the owner of a given access token. */
export const GetWhoami = route(
	"GET",
	"/_matrix/client/v3/account/whoami",
).response<WhoamiResponse>();
