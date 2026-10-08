import { route } from "../route.js";

/** A response from {@link GetVersions} */
export type VersionsResponse = {
	/** The supported versions. */
	versions: string[];
	/** Experimental features the server supports. */
	unstable_features?: Record<string, boolean>;
};

/** Gets the versions of the specification supported by the server. */
export const GetVersions = route("GET", "/_matrix/client/versions").response<VersionsResponse>();
