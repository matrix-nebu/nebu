/** All possible HTTP methods. */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

/** Extracts the names of all embedded `{pathParameters}` from a {@link Route}'s path string. */
type ExtractPath<E extends string> = E extends `${string}{${infer P}}${infer Rest}`
	? P | ExtractPath<Rest>
	: never;

/** The type of parameters required to be substituted into a {@link Route}'s path string. */
export type PathParameters<E extends string> = Record<ExtractPath<E>, string>;

/** Get the type of inputs required to serialize a {@link Route} with the given parameters. */
export type RouteInputs<E extends string, Query extends object, Body> = PathParameters<E> &
	Query &
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	([Body] extends [never] ? {} : { body: Body });

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
 * @typeParam E - The string literal for the endpoint URL.
 * @typeParam Query - A record type representing query parameters.
 * @typeParam Body - The type of the request body.
 * @typeParam Response - The type of the response.
 */
export interface Route<
	E extends string,
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	Query extends object = {},
	Body = never,
	Response = never,
> {
	/** The HTTP method for the route. */
	readonly method: HttpMethod;
	/**
	 * The endpoint URL for the route.
	 *
	 * It may contain path parameters that will be substituted when serializing the request.
	 */
	readonly endpoint: E;

	/**
	 * Serialize the route into an {@link EndpointRequest} object.
	 * @param inputs The inputs to become the request.
	 */
	serialize(inputs: RouteInputs<E, Query, Body>): EndpointRequest;

	readonly __path?: E;
	readonly __query?: Query;
	readonly __body?: Body;
	readonly __response?: Response;
}

/**
 * Builder for creating Nebu routes with type-safe request and response typing.
 *
 * @typeParam E - The endpoint URL for the route.
 * @typeParam Query - A record type representing query parameters.
 * @typeParam Body - The type of the request body.
 * @typeParam Response - The type of the response.
 */
export class RouteBuilder<
	E extends string,
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	Query extends object = {},
	Body = never,
	Response = never,
> implements Route<E, Query, Body, Response> {
	/**
	 * Constructs a new RouteBuilder instance.
	 * @param method The HTTP method for the route.
	 * @param endpoint The endpoint URL for the route.
	 */
	constructor(
		readonly method: HttpMethod,
		readonly endpoint: E,
	) {}

	/**
	 * Set the type of the query parameters for the route.
	 * @returns A new RouteBuilder instance with the updated query parameter type.
	 */
	query<T extends object>() {
		return new RouteBuilder<E, T, Body, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the request body for the route.
	 * @returns A new RouteBuilder instance with the updated request body type.
	 */
	body<T>() {
		return new RouteBuilder<E, Query, T, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the response for the route.
	 * @returns A new RouteBuilder instance with the updated response type.
	 */
	response<T>() {
		return new RouteBuilder<E, Query, Body, T>(this.method, this.endpoint);
	}

	/**
	 * Serialize the route into an {@link EndpointRequest} object.
	 * @param inputs The inputs to become the request.
	 */
	serialize(inputs: RouteInputs<E, Query, Body>): EndpointRequest {
		const { body, ...params } = inputs as { body?: Body } & Record<string, unknown>;

		const used = new Set<string>();

		// Substitute path parameters in the endpoint URL
		let url = this.endpoint.replace(/\{(\w+)\}/g, (_, key: string) => {
			used.add(key);
			return encodeURIComponent(String(params[key]));
		});

		// The remaining top-level keys in `inputs`, excluding `body`, are embedded as query
		// parameters.
		const query = Object.entries(params)
			.filter(([key, value]) => !used.has(key) && value !== undefined)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
			.join("&");

		if (query) url += `?${query}`;

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
export function route<E extends string>(method: HttpMethod, endpoint: E): RouteBuilder<E> {
	return new RouteBuilder(method, endpoint);
}
