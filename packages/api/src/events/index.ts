import type { PresenceState } from "../types/index.js";

/** An event. */
export interface BaseEvent {
	/** The contents of this event, varying by type. */
	content: Record<string, unknown>;

	/** The type of this event. */
	type: string;
}

/** A message-like (non-state) event. */
export interface MessageLikeEvent extends BaseEvent {
	/** The sender of this event. */
	sender: string;
}

/** A state event. */
export interface StateEvent extends MessageLikeEvent {
	/** The state key of this event. */
	state_key: string;
}

/** A send-to-device message. */
export type ToDeviceEvent = MessageLikeEvent;

/** An EDU (typing/receipts). */
export type EphemeralEvent = MessageLikeEvent;

/** A client event. */
export interface ClientMessageLikeEventWithoutRoomId extends MessageLikeEvent {
	event_id: string;
	origin_server_ts: number;
	unsigned?: UnsignedData;
}
export interface ClientMessageLikeEvent extends ClientMessageLikeEventWithoutRoomId {
	room_id: string;
}
export interface ClientStateEventWithoutRoomId extends StateEvent {
	event_id: string;
	origin_server_ts: number;
	unsigned?: UnsignedData;
}
export interface ClientStateEvent extends ClientStateEventWithoutRoomId {
	room_id: string;
}
export type ClientEventWithoutRoomId =
	ClientMessageLikeEventWithoutRoomId | ClientStateEventWithoutRoomId;
export type ClientEvent = ClientMessageLikeEvent | ClientStateEvent;

// TODO: Make a map of known events and a union of all of them
export interface PresenceEvent extends MessageLikeEvent {
	type: "m.presence";
	content: {
		avatar_url?: string;
		currently_active?: boolean;
		displayname?: string;
		last_active_ago: number;
		presence: PresenceState;
		status_msg?: string;
	};
}

/** Either a message-like event or a state event. */
export type Event = MessageLikeEvent | StateEvent;
