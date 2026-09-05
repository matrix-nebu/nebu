import { type } from "arktype";
import { endpoint } from "../endpoint.js";

export const AccountModerationCapability = type({
	lock: "boolean = false",
	suspend: "boolean = false",
});

export const ProfileFieldsCapability = type({
	"allowed?": "string[]",
	"disallowed?": "string[]",
	enabled: "boolean",
});

export const RoomVersionsCapability = type({
	available: 'Record<string, "stable" | "unstable" | "deprecated">',
	default: "string",
});

export const Capabilities = type({
	"m.3pid_changes?": "boolean",
	"m.account_moderation?": AccountModerationCapability,
	"m.change_password?": "boolean",
	"m.forget_forced_upon_leave?": "boolean",
	"m.get_login_token?": "boolean",
	"m.profile_fields?": ProfileFieldsCapability,
	"m.room_versions?": RoomVersionsCapability,
	/** @deprecated */
	"m.set_avatar_url?": "boolean",
	/** @deprecated */
	"m.set_displayname?": "boolean",
});

export const GetCapabilities = endpoint({
	method: "GET",
	endpoint: "/_matrix/client/capabilities",

	response: type({
		capabilities: "string[]",
		unstable_features: "Record<string, boolean>",
	}),
});
