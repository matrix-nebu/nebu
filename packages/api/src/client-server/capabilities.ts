import { route } from "../route.js";

/** A capability which can be either enabled or disabled. */
export type BooleanCapability = {
	enabled: boolean;
};

/**
 * Capability to indicate if the user can perform account moderation actions via server
 * administration endpoints.
 * @addedIn v1.18
 */
export type AccountModerationCapability = {
	/**
	 * `true` if the user can lock a user via `PUT /admin/lock/{userId}`, `false` otherwise.
	 */
	lock?: boolean;
	/**
	 * `true` if the user can suspend a user via `PUT /admin/suspend/{userId}`, `false` otherwise.
	 */
	suspend?: boolean;
};

/** Capability to indicate if the user can set or modify extended profile fields */
export type ProfileFieldsCapability = {
	/**
	 * `true` if the user can create, update or delete any profile fields, `false` otherwise.
	 */
	enabled: boolean;
	/**
	 * If present, a list of profile fields that clients are allowed to create, modify or delete,
	 * provided {@link enabled} is true; no other profile fields may be changed.
	 *
	 * If absent, clients may set all profile fields except those forbidden by the disallowed list,
	 * where present.
	 */
	allowed?: string[];
	/**
	 * This property has no meaning if allowed is also specified.
	 *
	 * Otherwise, if present, a list of profile fields that clients are not allowed to create,
	 * modify or delete. Provided enabled is true, clients MAY assume that they can set any profile
	 * field which is not included in this list.
	 */
	disallowed?: string[];
};

/** The room versions the server supports. */
export type RoomVersionsCapability = {
	/** A detailed description of the room versions the server supports. */
	supported: string[];
	/** The default room version the server is using for new rooms. */
	default: string;
};

/** Information about the server’s supported feature set and other relevant capabilities. */
export type Capabilities = {
	/** Capability to indicate if the user can change 3PID associations on their account. */
	"m.3pid_changes": BooleanCapability;
	/**
	 * Capability to indicate if the user can perform account moderation actions via server
	 * administration endpoints.
	 * @addedIn v1.18
	 */
	"m.account_moderation": AccountModerationCapability;
	/** Capability to indicate if the user can change their password. */
	"m.change_password": BooleanCapability;
	/**
	 * Capability to indicate if the server automatically forgets rooms once the user leaves.
	 * @addedIn v1.18
	 */
	"m.forget_forced_upon_leave": BooleanCapability;
	/**
	 * Capability to indicate if the user can generate tokens to log further clients into their
	 * account.
	 */
	"m.get_login_token": BooleanCapability;
	/**
	 * Capability to indicate if the user can set or modify extended profile fields
	 *
	 * If absent, assume they are supported, assuming {@link VersionsResponse} indicates support.
	 *
	 * @addedIn v1.16
	 */
	"m.profile_fields": ProfileFieldsCapability;
	/** The room versions the server supports. */
	"m.room_versions": RoomVersionsCapability;
	/**
	 * Capability to indicate if the user can change their avatar. Refer to {@link m.profile_fields}
	 * for extended profile management.
	 * @deprecated
	 */
	"m.set_avatar_url": BooleanCapability;
	/**
	 * Capability to indicate if the user can change their display name. Refer to
	 * {@link m.profile_fields} for extended profile management.
	 * @deprecated
	 */
	"m.set_displayname": BooleanCapability;
};

/** Gets information about the server's supported feature set and other relevant capabilities. */
export const GetCapabilities = route("GET", "/_matrix/client/v3/capabilities").response<{
	capabilities: Capabilities;
}>();
