import { Type, type } from "arktype";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

/**
 * Obtained from a {@link Endpoint} instance after it has been instantiated with data.
 */
export interface EndpointRequest {
	/** The HTTP method for the endpoint. */
	method: HttpMethod;
	/** The path for the endpoint, including path and query parameters. */
	path: string;
	/** The query parameters for the endpoint. */
	body?: unknown;
}

export type InferEndpointArgs<PathDef, QueryDef, ReqDef> = (PathDef extends undefined
	? {}
	: type.infer<PathDef>) &
	(QueryDef extends undefined ? {} : type.infer<QueryDef>) &
	(ReqDef extends undefined ? {} : type.infer<ReqDef>);

export class Endpoint<
	const PathDef = undefined,
	const QueryDef = undefined,
	const ReqDef = undefined,
	const RespDef = unknown,
> {
	// We store the original object keys of the types to allow for determining which request fields
	// belong to which output.
	readonly method: HttpMethod;
	readonly endpoint: string;
	readonly path?: PathDef extends undefined ? undefined : type.instantiate<PathDef>;
	readonly pathKeys: string[];
	readonly query?: QueryDef extends undefined ? undefined : type.instantiate<QueryDef>;
	readonly queryKeys: string[];
	readonly request?: ReqDef extends undefined ? undefined : type.instantiate<ReqDef>;
	readonly requestKeys: string[];
	readonly response: type.instantiate<RespDef>;

	constructor(options: {
		method: HttpMethod;
		endpoint: string;
		path?: PathDef extends undefined ? undefined : type.validate<PathDef>;
		query?: QueryDef extends undefined ? undefined : type.validate<QueryDef>;
		request?: ReqDef extends undefined ? undefined : type.validate<ReqDef>;
		response: type.validate<RespDef>;
	}) {
		this.method = options.method;
		this.endpoint = options.endpoint;
		this.pathKeys = [];
		this.queryKeys = [];
		this.requestKeys = [];
		if (options.path) {
			this.path = type(options.path as never);
			this.pathKeys = Object.keys(options.path);
		}
		if (options.query) {
			this.query = type(options.query as never);
			this.queryKeys = Object.keys(options.query);
		}
		if (options.request) {
			this.request = type(options.request as never);
			this.requestKeys = Object.keys(options.request);
		}
		this.response = type(options.response as never) as never;
	}

	toRequest(params: InferEndpointArgs<PathDef, QueryDef, ReqDef>): EndpointRequest {
		let path = this.endpoint;

		// Substitute path parameters in the endpoint URL
		if (this.path) {
			// validate params against the path type
			this.path.assert(params);

			for (const key of this.pathKeys) {
				const value = params[key as keyof typeof params];
				path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
			}
		}

		// Insert query parameters into the endpoint URL
		if (this.query) {
			// validate params against the query type
			this.query.assert(params);

			const queryParams = this.queryKeys
				.map((key) => {
					const value = params[key as keyof typeof params];
					if (value === undefined || value === null) {
						return null;
					}
					return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
				})
				.filter((param) => param !== null)
				.join("&");

			if (queryParams.length > 0) {
				path += `?${queryParams}`;
			}
		}

		// Clean up the body of keys we previously used
		let cleanBody = this.request?.onUndeclaredKey("delete").assert(params) as never;

		return {
			method: this.method,
			path,
			body: cleanBody,
		};
	}
}
