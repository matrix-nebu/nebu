import { route } from "../../route.js";

/** A portion of a {@link Filter} representing non-room events. */
export type EventFilter = {
	/** The maximum number of events to return, must be an integer greater than 0. */
	limit?: number;
	/** A list of sender IDs to exclude. If this list is absent then no senders are excluded. */
	not_senders?: string[];
	/**
	 * A list of event types to exclude. If this list is absent then no event types are excluded.
	 * A matching type will be excluded even if it is listed in the types filter. A `*` can be used
	 * as a wildcard to match any sequence of characters.
	 */
	not_types?: string[];
	/** A list of senders IDs to include. If this list is absent then all senders are included. */
	senders?: string[];
	/**
	 * A list of event types to include. If this list is absent then all event types are included.
	 * A `*` can be used as a wildcard to match any sequence of characters.
	 */
	types?: string[];
};

/** A portion of a {@link Filter} representing room events. */
export type RoomEventFilter = {
	/**
	 * If true, includes only events with a url key in their content. If false, excludes those
	 * events. If omitted, url key is not considered for filtering.
	 */
	contains_url?: boolean;
	/**
	 * If true, sends all membership events for all events, even if they have already been sent to
	 * the client. Does not apply unless {@link lazy_load_members} is true.
	 */
	include_redundant_members?: boolean;
	/** If true, enables lazy-loading of membership events. */
	lazy_load_members?: boolean;
	/** The maximum number of events to return, must be an integer greater than 0. */
	limit?: number;
	/** A list of rooms to exclude. If this list is absent then no rooms are excluded. */
	not_rooms?: string[];
	/** A list of sender IDs to exclude. If this list is absent then no senders are excluded. */
	not_senders?: string[];
	/** A list of event types to exclude. If this list is absent then none are excluded. */
	not_types?: string[];
	/** A list of rooms to include. If this list is absent then all rooms are included. */
	rooms?: string[];
	/** A list of sender IDs to include. If this list is absent then all senders are included. */
	senders?: string[];
	/** A list of event types to include. If this list is absent then all are included. */
	types?: string[];
	/** If true, enables per-thread notification counts. Only applies to the /sync endpoint. */
	unread_thread_notifications?: boolean;
};

/** A portion of a {@link Filter} representing room data. */
export type RoomFilter = {
	/** The per user account data to include for rooms. */
	account_data?: RoomEventFilter;
	/** The ephemeral events to include for rooms. */
	ephemeral?: RoomEventFilter;
	/** Include rooms that the user has left in the sync. */
	include_leave?: boolean;
	/**
	 * A list of room IDs to exclude from the sync. If this list is absent then no rooms are
	 * excluded.
	 */
	not_rooms?: string[];
	/**
	 * A list of room IDs to include in the sync. If this list is absent then all rooms are
	 * included.
	 */
	rooms?: string[];
	/** The state events to include for rooms. */
	state?: RoomEventFilter;
	/** The message and state update events to include for rooms. */
	timeline?: RoomEventFilter;
};

/** A filter which may be used in requests to restrict which events are returned to the client. */
export type Filter = {
	/** The user account data that isn’t associated with rooms to include. */
	account_data?: EventFilter;
	/**
	 * List of event fields to include. If this list is absent then all fields are included.
	 *
	 * The entries are {@link https://spec.matrix.org/v1.19/appendices/#dot-separated-property-paths|dot-separated paths}
	 * for each property to include.
	 *
	 * A server may include more fields than were requested.
	 */
	event_fields?: string[];
	/**
	 * The format to use for events.
	 *
	 * `client` will return the events in a format suitable for clients.
	 * `federation` will return the raw event as received over federation.
	 */
	event_format?: "client" | "federation";
	/** The presence updates to include. */
	presence?: EventFilter;
	/** Filters to be applied to room data. */
	room?: RoomFilter;
};

export const UploadFilter = route("POST", "/_matrix/client/v3/user/{userId}/filter")
	.path<{ userId: string }>()
	.body<Filter>()
	.response<{ filter_id: string }>();

export const GetFilter = route("GET", "/_matrix/client/v3/user/{userId}/filter/{filterId}")
	.path<{ userId: string; filterId: string }>()
	.response<Filter>();
