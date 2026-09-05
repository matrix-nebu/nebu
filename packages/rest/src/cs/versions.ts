import { type } from "arktype";
import { endpoint } from "../endpoint.js";

export const GetVersions = endpoint({
	method: "GET",
	endpoint: "/_matrix/client/versions",

	response: type({
		versions: "string[]",
		unstable_features: "Record<string, boolean>",
	}),
});
