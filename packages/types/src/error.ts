import { type } from "arktype";

/** These error codes can be returned by any API endpoint. */
export const KnownErrorCode = {
	/**
	 * Request contained valid JSON, but it was malformed in some way, e.g. missing required keys,
	 * invalid values for keys.
	 */
	BadJson: "M_BAD_JSON",
	/** Forbidden access, e.g. joining a room without permission, failed login. */
	Forbidden: "M_FORBIDDEN",
	/** Too many requests have been sent in a short period of time. Wait a while then try again. */
	LimitExceeded: "M_LIMIT_EXCEEDED",
	/** No access token was specified for the request. */
	MissingToken: "M_MISSING_TOKEN",
	/** No resource was found for this request. */
	NotFound: "M_NOT_FOUND",
	/** Request did not contain valid JSON. */
	NotJson: "M_NOT_JSON",
	/**
	 * The request cannot be completed because the homeserver has reached a resource limit imposed
	 * on it.
	 */
	ResourceLimitExceeded: "M_RESOURCE_LIMIT_EXCEEDED",
	/** An unknown error has occurred. */
	Unknown: "M_UNKNOWN",
	/**
	 * The device ID supplied by the application service does not belong to the user ID during
	 * identity assertion.
	 * @addedIn v1.17
	 */
	UnknownDevice: "M_UNKNOWN_DEVICE",
	/**
	 * The access or refresh token specified was not recognised.
	 */
	UnknownToken: "M_UNKNOWN_TOKEN",
	/**
	 * The server did not understand the request. This is expected to be returned with a 404 HTTP
	 * status code if the endpoint is not implemented or a 405 HTTP status code if the endpoint is
	 * implemented, but the incorrect HTTP method is used.
	 */
	Unrecognised: "M_UNRECOGNIZED",
	/**
	 * The request cannot be completed because the user has exceeded (or the request would cause
	 * them to exceed) a limit associated with their account.
	 * @addedIn v1.18
	 */
	UserLimitExceeded: "M_USER_LIMIT_EXCEEDED",
	/** The account has been locked and cannot be used at this time. */
	UserLocked: "M_USER_LOCKED",
	/** The account has been suspended and can only be used for limited actions at this time. */
	UserSuspended: "M_USER_SUSPENDED",
	/**
	 * The state change requested cannot be performed, such as attempting to unban a user who is not
	 * banned.
	 */
	BadState: "M_BAD_STATE",
	/** The user is unable to reject an invite to join the server notices room. */
	CannotLeaveServerNoticeRoom: "M_CANNOT_LEAVE_SERVER_NOTICE_ROOM",
	/** The Captcha provided did not match what was expected. */
	CaptchaInvalid: "M_CAPTCHA_INVALID",
	/** A Captcha is required to complete the request. */
	CaptchaNeeded: "M_CAPTCHA_NEEDED",
	/**
	 * The resource being requested is reserved by an application service, or the application
	 * service making the request has not created the resource.
	 */
	Exclusive: "M_EXCLUSIVE",
	/** The room or resource does not permit guests to access it. */
	GuestAccessForbidden: "M_GUEST_ACCESS_FORBIDDEN",
	/** The client attempted to join a room that has a version the server does not support. */
	IncompatibleRoomVersion: "M_INCOMPATIBLE_ROOM_VERSION",
	/**
	 * A parameter that was specified has the wrong value. For example, the server expected an
	 * integer and instead received a string.
	 */
	InvalidParam: "M_INVALID_PARAM",
	/** Sent when the initial state given to the createRoom API is invalid. */
	InvalidRoomState: "M_INVALID_ROOM_STATE",
	/** Encountered when trying to register a user ID which is not valid. */
	InvalidUsername: "M_INVALID_USERNAME",
	/** A required parameter was missing from the request. */
	MissingParam: "M_MISSING_PARAM",
	/** Sent when the room alias given to the createRoom API is already in use. */
	RoomInUse: "M_ROOM_IN_USE",
	/**
	 * The client’s request used a third-party server, e.g. identity server, that this server does
	 * not trust.
	 */
	ServerNotTrusted: "M_SERVER_NOT_TRUSTED",
	/** Authentication could not be performed on the third-party identifier. */
	ThreepidAuthFailed: "M_THREEPID_AUTH_FAILED",
	/**
	 * The server does not permit this third-party identifier. This may happen if the server only
	 * permits, for example, email addresses from a particular domain.
	 */
	ThreepidDenied: "M_THREEPID_DENIED",
	/**
	 * The third party identifier specified by the client is not acceptable because it is already
	 * in use in some way.
	 */
	ThreepidInUse: "M_THREEPID_IN_USE",
	/** The homeserver does not support adding a third party identifier of the given medium. */
	ThreepidMediumNotSupported: "M_THREEPID_MEDIUM_NOT_SUPPORTED",
	/**
	 * Sent when a threepid given to an API cannot be used because no record matching the threepid
	 * was found.
	 */
	ThreepidNotFound: "M_THREEPID_NOT_FOUND",
	/** The request or entity was too large. */
	TooLarge: "M_TOO_LARGE",
	/** The request was not correctly authorised. Usually due to login failures. */
	Unauthorized: "M_UNAUTHORIZED",
	/**
	 * The client's request to create a room used a room version that the server does not support.
	 */
	UnsupportedRoomVersion: "M_UNSUPPORTED_ROOM_VERSION",
	/** The user ID associated with the request has been deactivated. */
	UserDeactivated: "M_USER_DEACTIVATED",
	/** Encountered when trying to register a user ID which has been taken. */
	UserInUse: "M_USER_IN_USE",
} as const;
export type KnownErrorCode = (typeof KnownErrorCode)[keyof typeof KnownErrorCode];

export type ErrorCode = KnownErrorCode | (string & {});

export const StandardErrorResponse = type({
	errcode: type.valueOf(KnownErrorCode),
	error: "string",
});
export type StandardErrorResponse = typeof StandardErrorResponse.infer;

export const ResourceLimitExceededErrorResponse = StandardErrorResponse.and({
	admin_contact: "string",
});
export type ResourceLimitExceededErrorResponse = typeof ResourceLimitExceededErrorResponse.infer;

export const UnknownTokenErrorResponse = StandardErrorResponse.and({
	soft_logout: "boolean",
});
export type UnknownTokenErrorResponse = typeof UnknownTokenErrorResponse.infer;

export const UserLimitExceededErrorResponse = StandardErrorResponse.and({
	info_uri: "string",
	can_upgrade: "boolean",
});

export const ErrorResponse = StandardErrorResponse.or(ResourceLimitExceededErrorResponse)
	.or(UnknownTokenErrorResponse)
	.or(UserLimitExceededErrorResponse);
export type ErrorResponse = typeof ErrorResponse.infer;
