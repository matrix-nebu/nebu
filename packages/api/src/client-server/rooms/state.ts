import { route } from "../../route.js";

/**
 * Send a state event into a room.
 * This endpoint does not support txn IDs.
 */
export const SendState = route(
	"PUT",
	"/_matrix/client/v3/rooms/{roomId}/state/{eventType}/{stateKey}",
)
	.path<{ roomId: string; eventType: string; stateKey: string }>()
	.body<Record<string, unknown>>()
	.response<{ event_id: string }>();
