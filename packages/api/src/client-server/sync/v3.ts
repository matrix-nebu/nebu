import { route } from "../../route.js";
import { events, type PresenceState } from "../../index.js";

type ListOfEvents<T> = {
	/** List of new events. */
	events: T[];
};

/** The global private data created by this user. */
export interface SyncAccountData {
	events: events.MessageLikeEvent[];
}

/** Information on e2ee device updates. */
export interface SyncDeviceLists {
	/** List of users who have updated their identity, or joined an e2ee room with us. */
	changed: string[];
	/** List of users who we no longer share e2ee rooms with. */
	left: string[];
}

/** Information on the rooms the user is in. */
export interface SyncRooms {
	/** The rooms that the user has been invited to, mapped as room ID to room information. */
	invite: Record<string, SyncInviteRoom>;
	/** The rooms that the user has joined, mapped as room ID to room information. */
	join: Record<string, SyncJoinRoom>;
	/** The rooms that the user has knocked upon, mapped as room ID to room information. */
	knock: Record<string, SyncKnockRoom>;
	/**
	 * The rooms that the user has left or been banned from, mapped as room ID to room information.
	 */
	leave: Record<string, SyncLeaveRoom>;
}

/** Information on a room that the user has been invited to. */
export interface SyncInviteRoom {
	/** The stripped state of the room. */
	invite_state: ListOfEvents<events.StateEvent>;
}

/** Information on a room that the user has joined. */
export interface SyncJoinRoom {
	/** The room's account data updates. */
	account_data?: SyncAccountData;
	/** New ephemeral events in the room (typing/read receipts). */
	ephemeral?: ListOfEvents<events.EphemeralEvent>;
	/**
	 * Updates to the state, between `since` and the start of the timeline.
	 * If `full_state` is true, this will be the full state of the room up to the start of the
	 * timeline.
	 * State updates for m.room.member events will be incomplete if lazy_load_members is true.
	 * Omitted if `use_state_after` is true.
	 */
	state?: SyncState;
	/**
	 * Updates to the state, between `since` and the **end** of the timeline.
	 * If `full_state` is true, this will be the full state of the room up to the end of the
	 * timeline.
	 * State updates for m.room.member events will be incomplete if lazy_load_members is true.
	 * Required if `use_state_after` is true.
	 */
	state_after?: SyncState;
	/** Information about the room clients may need to render it to users. */
	summary?: SyncSummary;
	/** The timeline of messages and other events in the room. */
	timeline?: SyncTimeline;
	/** Counts of unread notifications for this room. */
	unread_notifications?: SyncUnreadNotifications;
	/** If  unread_thread_notifications` was enabled on the filter, notification counts per-thread. */
	unread_thread_notifications?: Record<string, SyncUnreadNotifications>;
}

/** Information on a room that the user has knocked upon. */
export interface SyncKnockRoom {
	/** The room's information. */
	room: events.RoomEvent;
}

/** Information on a room that the user has left or been banned from. */
export interface SyncLeaveRoom {
	/** The room's information. */
	room: events.RoomEvent;
}

/**
 * {@link https://spec.matrix.org/v1.19/client-server-api/#get_matrixclientv3sync Send a sync request.}
 */
export const Sync = route("GET", "/_matrix/client/v3/sync")
	.query<{
		filter: string;
		full_state: boolean;
		set_presence: PresenceState;
		since: string;
		timeout: number;
		use_state_after: boolean;
	}>()
	.response<{
		/** The global private data created by this user. */
		account_data?: SyncAccountData;
		/** Device list updates. */
		device_lists?: SyncDeviceLists;
		/** For each key algorithm, the number of unclaimed OTKs for this device. */
		device_one_time_keys_count?: Record<string, number>;
		/** The next batch token for the long-polling loop. */
		next_batch: string;
		/** Presence updates. */
		presence?: ListOfEvents<events.PresenceEvent>;
		/** Room updates. */
		rooms?: SyncRooms;
		/** Information on the send-to-device messages for the client device. */
		to_device?: ListOfEvents<events.ToDeviceEvent>;
	}>();
