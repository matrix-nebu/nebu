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

	async request<Path, Query, Body, Response, E extends Endpoint<Path, Query, Body, Response>>(
		endpoint: E,
		params: Path & Query & Body,
	): Promise<Response> {
		// substitute path parameters in the endpoint URL
		let url = endpoint.endpoint;
		if (endpoint.path && params) {
			for (const key of Object.keys(endpoint.path)) {
				const value = (params as Record<string, unknown>)[key];
				if (value === undefined) {
					throw new Error(`Missing path parameter: ${key}`);
				}
				url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
			}
		}

		// append query parameters to the URL
		const queryParams: Record<string, string> = {};
		if (endpoint.query && params) {
			for (const key of Object.keys(endpoint.query)) {
				const value = (params as Record<string, unknown>)[key];
				if (value !== undefined) {
					queryParams[key] = String(value);
				}
			}
		}

		const queryString = new URLSearchParams(queryParams).toString();
		if (queryString) {
			url += `?${queryString}`;
		}

		// prepare the request options
		const requestOptions: RequestInit = {
			method: endpoint.method,
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

		// include the request body if applicable
		if (endpoint.body && params) {
			const bodyParams: Record<string, unknown> = {};
			for (const key of Object.keys(endpoint.body)) {
				const value = (params as Record<string, unknown>)[key];
				if (value !== undefined) {
					bodyParams[key] = value;
				}
			}
			requestOptions.body = JSON.stringify(bodyParams);
		}

		// make the HTTP request
		const response = await this.fetch(`${this.baseUrl}${url}`, requestOptions);

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
			return responseBody as Response;
		}
	}
}
