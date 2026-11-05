import { route } from "../../route.js";

/**
 * Send a redaction event into a room.
 */
export const SendRedaction = route(
	"PUT",
	"/_matrix/client/v3/rooms/{roomId}/redact/{eventId}/{txnId}",
)
	.body<{ reason: string }>()
	.response<{ event_id: string }>();
