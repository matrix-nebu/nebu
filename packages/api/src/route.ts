/** All possible HTTP methods. */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

/** Extracts the names of all embedded `{pathParameters}` from a {@link Route}'s path string. */
type ExtractPath<E extends string> = E extends `${string}{${infer P}}${infer Rest}`
	? P | ExtractPath<Rest>
	: never;

/**
 * The type of parameters required to be substituted into a {@link Route}'s path string.
 * @internal
 */
export type PathParameters<E extends string> = Record<ExtractPath<E>, string>;

/**
 * Get the type of inputs required to serialize a {@link Route} with the given parameters.
 * @internal
 */
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
 * Builder for creating Nebu routes with type-safe request and response typing.
 *
 * @typeParam E - The endpoint URL for the route.
 * @typeParam Query - A record type representing query parameters.
 * @typeParam Body - The type of the request body.
 * @typeParam Response - The type of the response.
 */
export class Route<
	E extends string,
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	Query extends object = {},
	Body = never,
	Response = never,
> {
	/** The type of path parameters for the route. */
	declare public readonly Path: PathParameters<E>;
	/** The type of query parameters for the route. */
	declare public readonly Query: Query;
	/** The type of the request body for the route. */
	declare public readonly Body: Body;
	/** The type of the response for the route. */
	declare public readonly Response: Response;
	/** The type of all inputs to request this route. */
	declare public readonly Inputs: RouteInputs<E, Query, Body>;

	/**
	 * Constructs a new Route instance.
	 * @param method The HTTP method for the route.
	 * @param endpoint The endpoint URL for the route.
	 */
	constructor(
		readonly method: HttpMethod,
		readonly endpoint: E,
	) {}

	/**
	 * Set the type of the query parameters for the route.
	 * @returns A new Route instance with the updated query parameter type.
	 */
	query<T extends object>() {
		return new Route<E, T, Body, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the request body for the route.
	 * @returns A new Route instance with the updated request body type.
	 */
	body<T>() {
		return new Route<E, Query, T, Response>(this.method, this.endpoint);
	}

	/**
	 * Set the type of the response for the route.
	 * @returns A new Route instance with the updated response type.
	 */
	response<T>() {
		return new Route<E, Query, Body, T>(this.method, this.endpoint);
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
 * Shorthand for creating a new {@link Route} instance.
 * @param method The HTTP method for the route.
 * @param endpoint The endpoint URL for the route.
 * @returns A new Route instance.
 */
export function route<E extends string>(method: HttpMethod, endpoint: E): Route<E> {
	return new Route(method, endpoint);
}
