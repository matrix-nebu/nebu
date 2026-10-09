/**
 * All possible HTTP methods.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

/**
 * The serialized HTTP request information produced by an {@link Route} instance after it has
 * been instantiated with data.
 *
 * The endpoint's path and query parameters are serialized into {@link path}, and if the endpoint
 * defines a request body, it is serialized into {@link body}.
 */
export interface EndpointRequest {
	/** The HTTP method for the request. */
	method: HttpMethod;
	/** The URL-safe request path, including any substituted path and query parameters. */
	path: string;
	/** The request body, if the endpoint defines a request body. */
	body?: unknown;
}

/**
 * A branded type representing a Nebu route, with type-safe request and response typing.
 * @typeParam Path - A record type representing path parameters.
 * @typeParam Query - A record type representing query parameters.
 * @typeParam Body - The type of the request body.
 * @typeParam Response - The type of the response.
 */
export interface Route<Path extends object, Query extends object, Body, Response = unknown> {
	/** The HTTP method for the route. */
	readonly method: HttpMethod;
	/**
	 * The endpoint URL for the route.
	 *
	 * It may contain path parameters that will be substituted when serializing the request.
	 */
	readonly endpoint: string;

	/**
	 * Serialize the route into an {@link EndpointRequest} object.
	 * @param inputs The inputs to become the request.
	 */
	serialize(inputs: RouteInputs<Path, Query, Body>): EndpointRequest;

	readonly __path?: Path;
	readonly __query?: Query;
	readonly __body?: Body;
	readonly __response?: Response;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type RouteInputs<Path extends object, Query extends object, Body> = ([Path] extends [never]
	? {}
	: { path: Path }) &
	([Query] extends [never] ? {} : { query: Query }) &
	([Body] extends [never] ? {} : { body: Body });
/* eslint-enable @typescript-eslint/no-empty-object-type */

/**
 * Builder for creating Nebu routes with type-safe request and response typing.
 *
 * @typeParam Path - A record type representing path parameters.
 * @typeParam Query - A record type representing query parameters.
 * @typeParam Body - The type of the request body.
 * @typeParam Response - The type of the response.
 */
export class RouteBuilder<
	Path extends object = never,
	Query extends object = never,
	Body = never,
	Response = never,
> implements Route<Path, Query, Body, Response> {
	/**
	 * Constructs a new RouteBuilder instance.
	 * @param method The HTTP method for the route.
	 * @param endpoint The endpoint URL for the route.
	 */
	constructor(
		readonly method: HttpMethod,
		readonly endpoint: string,
	) {}

	/**
	 * Set the type of the path parameters for the route.
	 * @returns A new RouteBuilder instance with the updated path parameter type.
	 */
	path<T extends object>() {
		return new RouteBuilder<T, Query, Body, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the query parameters for the route.
	 * @returns A new RouteBuilder instance with the updated query parameter type.
	 */
	query<T extends object>() {
		return new RouteBuilder<Path, T, Body, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the request body for the route.
	 * @returns A new RouteBuilder instance with the updated request body type.
	 */
	body<T>() {
		return new RouteBuilder<Path, Query, T, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the response for the route.
	 * @returns A new RouteBuilder instance with the updated response type.
	 */
	response<T>() {
		return new RouteBuilder<Path, Query, Body, T>(this.method, this.endpoint);
	}

	/**
	 * Serialize the route into an {@link EndpointRequest} object.
	 * @param inputs The inputs to become the request.
	 */
	serialize(inputs: RouteInputs<Path, Query, Body>): EndpointRequest {
		const { path, query, body } = inputs as {
			path?: Path;
			query?: Query;
			body?: Body;
		};

		// substitute path parameters in the endpoint URL
		let url = this.endpoint;
		if (path) {
			for (const [key, value] of Object.entries(path)) {
				url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
			}
		}

		// append query parameters to the URL
		if (query && Object.keys(query).length > 0) {
			// use percent encoding, never "+" like URLSearchParams uses
			const queryString = Object.entries(query)
				.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
				.join("&");
			url += `?${queryString}`;
		}

		return {
			method: this.method,
			path: url,
			body,
		};
	}
}

/**
 * Shorthand for creating a new {@link RouteBuilder} instance.
 * @param method The HTTP method for the route.
 * @param endpoint The endpoint URL for the route.
 * @returns A new RouteBuilder instance.
 */
export function route<
	Path extends object = never,
	Query extends object = never,
	Body = never,
	Response = never,
>(method: HttpMethod, endpoint: string): RouteBuilder<Path, Query, Body, Response> {
	return new RouteBuilder(method, endpoint);
}
