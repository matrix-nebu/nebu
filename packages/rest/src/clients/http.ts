import type { Endpoint } from "../endpoint.js";
import { ErrorResponse } from "@matrix-nebu/types";
import { type } from "arktype";

export class HttpClient {
	private bearerToken: string | null = null;

	constructor(
		private readonly baseUrl: string,
		private readonly fetch: typeof globalThis.fetch = globalThis.fetch,
	) {}

	setBearerToken(token: string | null): void {
		this.bearerToken = token;
	}

	async request<Path, Query, Req, Resp, E extends Endpoint<Path, Query, Req, Resp>>(
		endpoint: E,
		params: Path & Query & Req,
	): Promise<Resp> {
		let request = endpoint.toRequest(params);

		const requestOptions: RequestInit = {
			method: request.method,
			headers: {
				"Content-Type": "application/json",
			},
		};
		if (this.bearerToken) {
			requestOptions.headers = {
				...requestOptions.headers,
				Authorization: `Bearer ${this.bearerToken}`,
			};
		}

		if (request.body !== undefined) {
			requestOptions.body = JSON.stringify(request.body);
		}

		// make the HTTP request
		const response = await this.fetch(`${this.baseUrl}${request.path}`, requestOptions);

		// check for HTTP errors
		if (!response.ok) {
			// try to parse the error response as a Matrix error
			let json: unknown;
			try {
				json = await response.json();
			} catch {
				throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
			}

			let mxError = ErrorResponse(json);
			if (mxError instanceof type.errors) {
				throw new Error(`Got unexpected error response: ${JSON.stringify(json)}`);
			}

			throw new Error(
				`HTTP error ${response.status}: ${response.statusText} - ${mxError.errcode}: ${mxError.error}`,
			);
		}

		// parse the response body as JSON
		let json;
		try {
			json = await response.json();
		} catch {
			throw new Error(`Failed to parse JSON response from ${endpoint.endpoint}`);
		}
		const responseBody = endpoint.response(json);
		if (responseBody instanceof type.errors) {
			throw new Error(`Got unexpected response body: ${JSON.stringify(json)}`);
		} else {
			return responseBody as Resp;
		}
	}
}
