import { route } from "../../route.js";

/**
 * Send a message event into a room.
 */
export const SendMessage = route(
	"PUT",
	"/_matrix/client/v3/rooms/{roomId}/send/{eventType}/{txnId}",
)
	.body<Record<string, unknown>>()
	.response<{ event_id: string }>();
