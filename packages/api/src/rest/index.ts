import { type EndpointRequest, type Route, type RouteInputs } from "../route.js";
import { isMatrixErrorResponse, MatrixError } from "../client-server/error.js";

/**
 * REST executor for the Matrix Client-Server API.
 */
// TODO: This class needs to handle rate limiting, retries, etc.
export class REST {
	/**
	 * The homeserver base URL.
	 * For endpoints like `https://matrix.example.com/_matrix/client/...`, the base URL is
	 * `https://matrix.example.com`. If the base URL is a directory, it should end with a trailing
	 * slash (e.g. `https://example.com/matrix-client/`).
	 */
	public readonly baseUrl: string;

	/**
	 * The Matrix access token to use for requests.
	 * If unset, requests will be made without authentication.
	 */
	public accessToken?: string;

	/**
	 * The fetch function to use for requests.
	 */
	private readonly fetch: typeof globalThis.fetch;

	/**
	 * Creates a new REST executor.
	 * @param baseUrl The homeserver base URL.
	 * @param accessToken The Matrix access token to use for requests.
	 */
	constructor(baseUrl: string, fetch: typeof globalThis.fetch = globalThis.fetch) {
		this.baseUrl = baseUrl;
		this.fetch = fetch;
	}

	/** Sets the access token for subsequent requests. */
	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}

	/**
	 * Executes a serialized {@link EndpointRequest} and sends it to the homeserver.
	 * @param request The serialized request to execute.
	 * @returns The parsed JSON response from the homeserver.
	 * @throws If the request fails or the response is not valid JSON.
	 */
	async execute(request: EndpointRequest): Promise<unknown> {
		const url = new URL(request.path, this.baseUrl);

		const headers = new Headers();
		const requestOptions: RequestInit = {
			method: request.method,
			headers,
		};

		if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
			headers.set("Content-Type", "application/json");
			requestOptions.body = JSON.stringify(request.body);
		}

		if (this.accessToken) headers.set("Authorization", `Bearer ${this.accessToken}`);

		const response = await this.fetch(url.toString(), requestOptions);

		let json: unknown;
		try {
			json = await response.json();
		} catch {
			if (!response.ok) {
				throw new Error(`HTTP error ${response.status.toString()}: ${response.statusText}`);
			} else {
				throw new Error(
					`Failed to parse JSON response: ${response.status.toString()}: ${response.statusText}`,
				);
			}
		}

		if (!response.ok && isMatrixErrorResponse(json)) {
			throw new MatrixError(json);
		} else if (!response.ok) {
			throw new Error(`HTTP error ${response.status.toString()}: ${response.statusText}`);
		}

		return json;
	}

	/**
	 * Accepts a {@link Route} and its inputs, executing the request.
	 * @param route The route to request.
	 * @param inputs The parameters to serialize into the request.
	 * @returns The parsed JSON response from the homeserver.
	 * @throws If the request fails or the response is not valid JSON.
	 */
	async request<
		Path extends object = never,
		Query extends object = never,
		Body = never,
		Response = never,
	>(
		route: Route<Path, Query, Body, Response>,
		inputs: RouteInputs<Path, Query, Body>,
	): Promise<Response> {
		const request = route.serialize(inputs);
		const json = await this.execute(request);
		return json as Response;
	}
}
