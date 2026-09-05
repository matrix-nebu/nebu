import { Type } from "arktype";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

export interface Endpoint<PathParams, QueryParams, RequestBody, ResponseBody> {
	readonly method: HttpMethod;
	readonly endpoint: string;

	readonly path?: PathParams extends undefined ? undefined : Type<PathParams>;
	readonly query?: QueryParams extends undefined ? undefined : Type<QueryParams>;
	readonly body?: RequestBody extends undefined ? undefined : Type<RequestBody>;

	readonly response: Type<ResponseBody>;
}

export function endpoint<PathParams, QueryParams, RequestBody, ResponseBody>(
	endpoint: Endpoint<PathParams, QueryParams, RequestBody, ResponseBody>,
): Endpoint<PathParams, QueryParams, RequestBody, ResponseBody> {
	return Object.freeze(endpoint);
}

export type EndpointPathParams<E> = E extends Endpoint<infer P, any, any, any> ? P : never;
export type EndpointQueryParams<E> = E extends Endpoint<any, infer Q, any, any> ? Q : never;
export type EndpointRequestBody<E> = E extends Endpoint<any, any, infer B, any> ? B : never;
export type EndpointResponseBody<E> = E extends Endpoint<any, any, any, infer R> ? R : never;
