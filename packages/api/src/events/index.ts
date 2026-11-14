import type { PresenceState, RoomMembershipState } from "../types/index.js";

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

/** Additional info on events. */
export interface UnsignedData<StateEventType extends StateEvent = never> {
	/** The time in ms since the event was sent. */
	age?: number;
	/** The room membership of the requesting user at the time of the event. */
	membership?: RoomMembershipState;
	/** The `content` of the previous state event replaced by the event. */
	prev_content?: StateEventType extends never ? undefined : StateEventType["content"];
	/** The event that redacted this event, if any. */
	redacted_because?: RedactionEvent;
	/** The event ID of the state event this event replaced. */
	replaces_state?: StateEventType extends never ? undefined : string;
	/** The client supplied txn ID. */
	transaction_id?: string;
}

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
	unsigned?: UnsignedData<ClientStateEventWithoutRoomId>;
}
export interface ClientStateEvent extends ClientStateEventWithoutRoomId {
	room_id: string;
	unsigned?: UnsignedData<ClientStateEvent>;
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

export interface RedactionEvent extends MessageLikeEvent {
	redacts: string;
	content: {
		reason?: string;
		redacts?: string;
	};
}

/** Either a message-like event or a state event. */
export type Event = MessageLikeEvent | StateEvent;
