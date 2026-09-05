import * as rest from "@matrix-nebu/rest";

/**
 * A client for the Matrix Client-Server API.
 */
export class Client {
	private readonly rest: rest.HttpClient;

	/**
	 * Creates a new Matrix Client-Server API client.
	 * @param baseUrl The base URL of the Matrix homeserver to connect to. This should be the URL,
	 * excluding the path, of the homeserver. For example, `https://matrix-client.matrix.org`.
	 * @param fetch A fetch function to use for making HTTP requests. Defaults to the global `fetch`
	 * function.
	 */
	constructor(
		readonly baseUrl: string,
		private readonly fetch: typeof globalThis.fetch = globalThis.fetch,
	) {
		this.rest = new rest.HttpClient(baseUrl, fetch);
	}

	/**
	 * Set the bearer token to use for authentication in requests.
	 * @param token A Matrix access token, or `null` to clear the token.3
	 */
	setToken(token: string | null): void {
		this.rest.setBearerToken(token);
	}

	/**
	 * Ask the server for the supported Matrix versions.
	 * @returns the server's supported Matrix versions.
	 */
	async getVersions(): Promise<rest.EndpointResponseBody<typeof rest.GetVersions>> {
		return this.rest.request(rest.GetVersions, {});
	}

	/**
	 * Ask the server for our account's capabilities. Requires authentication.
	 * @returns the server's capabilities for the authenticated user.
	 */
	async getCapabilities(): Promise<rest.EndpointResponseBody<typeof rest.GetCapabilities>> {
		return this.rest.request(rest.GetCapabilities, {});
	}
}
