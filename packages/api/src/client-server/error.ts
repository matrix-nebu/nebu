/** Common error codes returned by the Matrix Client-Server API. */
export type ErrorCode =
	/** Request contained valid JSON, but it was malformed in some way */
	| "M_BAD_JSON"
	/** Forbidden access, e.g. joining a room without permission, failed login. */
	| "M_FORBIDDEN"
	/** Too many requests have been sent in a short period of time. Wait a while then try again. */
	| "M_LIMIT_EXCEEDED"
	/** No access token was specified for the request. */
	| "M_MISSING_TOKEN"
	/** No resource was found for this request. */
	| "M_NOT_FOUND"
	/** Request did not contain valid JSON. */
	| "M_NOT_JSON"
	/** The request cannot be completed because the homeserver has reached a resource limit. */
	| "M_RESOURCE_LIMIT_EXCEEDED"
	/** An unknown error has occurred. */
	| "M_UNKNOWN"
	/**
	 * The device ID supplied by the application service does not belong to the user ID asserted
	 * @addedIn v1.17
	 */
	| "M_UNKNOWN_DEVICE"
	/** The access or refresh token specified was not recognised. */
	| "M_UNKNOWN_TOKEN"
	/**
	 * The server did not understand the request. This is expected to be returned with a 404 HTTP
	 * status code if the endpoint is not implemented or a 405 HTTP status code if the endpoint is
	 * implemented, but the incorrect HTTP method is used.
	 */
	| "M_UNRECOGNIZED"
	/**
	 * The request cannot be completed because the user has exceeded (or the request would cause
	 * them to exceed) a limit associated with their account.
	 * @addedIn v1.18
	 */
	| "M_USER_LIMIT_EXCEEDED"
	/** The account has been locked and cannot be used at this time. */
	| "M_USER_LOCKED"
	/** The account has been suspended and can only be used for limited actions at this time. */
	| "M_USER_SUSPENDED"
	/** The state change requested cannot be performed. */
	| "M_BAD_STATE"
	/** The user is unable to reject an invite to join the server notices room. */
	| "M_CANNOT_LEAVE_SERVER_NOTICE_ROOM"
	/** The Captcha provided did not match what was expected. */
	| "M_CAPTCHA_INVALID"
	/** A Captcha is required to complete the request. */
	| "M_CAPTCHA_NEEDED"
	/**
	 * The resource being requested is reserved by an application service, or the application
	 * service making the request has not created the resource.
	 */
	| "M_EXCLUSIVE"
	/** The room or resource does not permit guests to access it. */
	| "M_GUEST_ACCESS_FORBIDDEN"
	/** The client attempted to join a room that has a version the server does not support. */
	| "M_INCOMPATIBLE_ROOM_VERSION"
	/** A parameter that was specified has the wrong value. */
	| "M_INVALID_PARAM"
	/** Sent when the initial state given to the createRoom API is invalid. */
	| "M_INVALID_ROOM_STATE"
	/** Encountered when trying to register a user ID which is not valid. */
	| "M_INVALID_USERNAME"
	/** A required parameter was missing from the request. */
	| "M_MISSING_PARAM"
	/** Sent when the room alias given to the createRoom API is already in use. */
	| "M_ROOM_IN_USE"
	/**
	 * The client’s request used a third-party server, e.g. identity server, that this server does
	 * not trust.
	 */
	| "M_SERVER_NOT_TRUSTED"
	/** Authentication could not be performed on the third-party identifier. */
	| "M_THREEPID_AUTH_FAILED"
	/** The server does not permit this third-party identifier. */
	| "M_THREEPID_DENIED"
	/**
	 * The third party identifier specified by the client is not acceptable because it is already in
	 * use in some way.
	 */
	| "M_THREEPID_IN_USE"
	/** The homeserver does not support adding a third party identifier of the given medium. */
	| "M_THREEPID_MEDIUM_NOT_SUPPORTED"
	/**
	 * Sent when a threepid given to an API cannot be used because no record matching the threepid
	 * was found.
	 */
	| "M_THREEPID_NOT_FOUND"
	/** The request or entity was too large. */
	| "M_TOO_LARGE"
	/** The request was not correctly authorised. Usually due to login failures. */
	| "M_UNAUTHORIZED"
	/**
	 * The client’s request to create a room used a room version that the server does not support.
	 */
	| "M_UNSUPPORTED_ROOM_VERSION"
	/** The user ID associated with the request has been deactivated. */
	| "M_USER_DEACTIVATED"
	/** Encountered when trying to register a user ID which has been taken. */
	| "M_USER_IN_USE"
	| (string & {});

/** An error returned by the Matrix API. */
export interface MatrixError {
	/** A human-readable error message. */
	error: string;
	/** A unique string identifying the error. */
	errcode: ErrorCode;
}

/** The error response for `M_LIMIT_EXCEEDED`. */
export interface MatrixLimitExceededError extends MatrixError {
	errcode: "M_LIMIT_EXCEEDED";
	/**
	 * How long to wait (in milliseconds) before retrying.
	 * @deprecated Use the `Retry-After` HTTP header instead.
	 */
	retry_after_ms?: number;
}

/** The error response for `M_RESOURCE_LIMIT_EXCEEDED`. */
export interface MatrixResourceLimitExceededError extends MatrixError {
	errcode: "M_RESOURCE_LIMIT_EXCEEDED";
	/** A place the user receiving this error can reach out to. */
	admin_contact: string;
}

/** The error response for `M_UNKNOWN_TOKEN`. */
export interface MatrixUnknownTokenError extends MatrixError {
	errcode: "M_UNKNOWN_TOKEN";
	/** True if the client is in soft-logout state. */
	soft_logout?: boolean;
}

/** The error response for `M_USER_LIMIT_EXCEEDED`. */
export interface MatrixUserLimitExceededError extends MatrixError {
	errcode: "M_USER_LIMIT_EXCEEDED";
	/** A URI providing more context on the encountered limit. */
	info_uri: string;
	/** True if this limit can be increased. */
	can_upgrade?: boolean;
}

/** The union of all possible error responses from the Matrix API. */
export type MatrixErrorResponse =
	| MatrixError
	| MatrixLimitExceededError
	| MatrixResourceLimitExceededError
	| MatrixUnknownTokenError
	| MatrixUserLimitExceededError;
