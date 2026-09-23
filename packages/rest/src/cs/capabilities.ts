import { type } from "arktype";
import { Endpoint } from "../endpoint.js";

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

export const BooleanCapability = type({
	enabled: "boolean",
});

export const Capabilities = type({
	"m.3pid_changes?": BooleanCapability,
	"m.account_moderation?": AccountModerationCapability,
	"m.change_password?": BooleanCapability,
	"m.forget_forced_upon_leave?": BooleanCapability,
	"m.get_login_token?": BooleanCapability,
	"m.profile_fields?": ProfileFieldsCapability,
	"m.room_versions?": RoomVersionsCapability,
	/** @deprecated */
	"m.set_avatar_url?": BooleanCapability,
	/** @deprecated */
	"m.set_displayname?": BooleanCapability,
});

export const GetCapabilities = new Endpoint({
	method: "GET",
	endpoint: "/_matrix/client/capabilities",

	response: {
		capabilities: Capabilities,
		unstable_features: "Record<string, boolean>",
	},
});
