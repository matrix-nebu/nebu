import { type EndpointRequest, type Route, type RouteInputs } from "../route.js";
import { isMatrixErrorResponse, MatrixError } from "../client-server/error.js";

/** Global options for the REST client. */
export interface RESTOptions {
	/** The fetch function to use for requests. */
	fetch?: typeof globalThis.fetch;

	/** The default timeout for requests. */
	timeout?: number;
}

/** Options configurable when calling {@link REST.execute}. */
export interface RequestOptions {
	/** An optional AbortSignal to cancel the request. */
	signal?: AbortSignal;

	/** The timeout for the request. */
	timeout?: number;
}

/**
 * REST executor for the Matrix Client-Server API.
 */
// TODO: This class needs to handle rate limiting, retries, etc.
export class REST {
	/**
	 * The base URL to send requests to. For example, `https://matrix-client.matrix.org`.
	 */
	public readonly baseUrl: string;

	/**
	 * The Matrix access token to use for requests.
	 * If unset, requests will be made without authentication.
	 */
	private accessToken?: string;

	/** The fetch function to use for requests. */
	private readonly fetch: typeof globalThis.fetch;

	/** The default timeout, in milliseconds, for requests. */
	private readonly timeout?: number;

	/**
	 * Creates a new REST executor.
	 * @param baseUrl The base URL to send requests to.
	 * @param options The global options for the REST client.
	 *
	 * @example
	 * ```ts
	 * const rest = new REST("https://matrix-client.matrix.org", {
	 *   timeout: 30000,
	 * });
	 * rest.setAccessToken("syt_...");
	 * ```
	 */
	constructor(baseUrl: string, options: RESTOptions = {}) {
		// remove a trailing slash from the base URL if present, to avoid double slashes in requests
		this.baseUrl = baseUrl.replace(/\/$/, "");
		this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
		this.timeout = options.timeout;
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
	async execute(request: EndpointRequest, options: RequestOptions = {}): Promise<unknown> {
		const timeout = options.timeout ?? this.timeout;
		const timeoutSignal = timeout ? AbortSignal.timeout(timeout) : undefined;
		const signal = options.signal
			? timeoutSignal
				? AbortSignal.any([options.signal, timeoutSignal])
				: options.signal
			: timeoutSignal;

		const url = this.baseUrl + request.path;

		const headers = new Headers();
		const requestOptions: RequestInit = {
			method: request.method,
			headers,
			signal,
		};

		if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
			headers.set("Content-Type", "application/json");
			requestOptions.body = JSON.stringify(request.body);
		}

		if (this.accessToken) headers.set("Authorization", `Bearer ${this.accessToken}`);

		const response = await this.fetch(url, requestOptions);

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
		options: RequestOptions = {},
	): Promise<Response> {
		const request = route.serialize(inputs);
		const json = await this.execute(request, options);
		return json as Response;
	}
}
