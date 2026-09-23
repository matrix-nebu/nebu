import { type } from "arktype";
import { Endpoint } from "../endpoint.js";

export const GetVersions = new Endpoint({
	method: "GET",
	endpoint: "/_matrix/client/versions",

	response: {
		versions: "string[]",
		unstable_features: "Record<string, boolean>",
	},
});
