import { HttpClient, type EndpointResponseBody, GetVersions } from "@matrix-nebu/rest";

export class Client {
	private readonly rest: HttpClient;

	constructor(
		readonly baseUrl: string,
		private readonly fetch: typeof globalThis.fetch = globalThis.fetch,
	) {
		this.rest = new HttpClient(baseUrl, fetch);
	}

	async getVersions(): Promise<EndpointResponseBody<typeof GetVersions>> {
		return this.rest.request(GetVersions, {});
	}
}
