import { REST, routes, type PresenceState } from "@matrix-nebu/api";

export type Filter = routes.user.Filter;

/** Settings applied to a {@link SyncLoop} at construction. */
export interface SyncLoopSettings {
	/** The REST client to use for sync requests. */
	rest: REST;
	/** The user ID to use for the sync requests. */
	userId: string;
	/** The timeout for each sync request. */
	timeout?: number;
	/** The next batch token to use for the first sync request. If not provided, the first sync request will be a full sync. */
	nextBatch?: string;
	/** The ID of the filter to use for the sync request. */
	filterId?: string;
	/** The presence state to set for the user. Changed with {@link SyncLoop.setPresence} */
	setPresence?: PresenceState;
	/** Whether or not to set `use_state_after`. Defaults to `true`. */
	useStateAfter?: boolean;
}

/**
 * Class that handles the long-polling sync loop with the homeserver.
 *
 * This class produces a generator, {@link SyncLoop#events}, yielding new sync responses as they
 * arrive.
 */
export class SyncLoop {
	readonly rest: REST;
	readonly userId: string;
	public readonly timeout: number;

	private nextBatch: string | undefined;
	private filterId: string | undefined;
	private abortController = new AbortController();

	public setPresence: PresenceState;
	public useStateAfter: boolean;

	/**
	 * Create a new SyncLoop.
	 *
	 * @param options - The settings to use for the sync loop.
	 */
	constructor(options: SyncLoopSettings) {
		this.rest = options.rest;
		this.userId = options.userId;
		this.nextBatch = options.nextBatch;
		this.timeout = options.timeout ?? 30000;
		this.filterId = options.filterId;
		this.setPresence = options.setPresence ?? "online";
		this.useStateAfter = options.useStateAfter ?? true;
	}

	/**
	 * Upload a new {@link Filter} to the homeserver and use it for future requests.
	 */
	public async uploadFilter(filter: Filter): Promise<void> {
		const response = await this.rest.request(routes.user.UploadFilter, {
			body: filter,
			userId: this.userId,
		});
		this.filterId = response.filter_id;
	}

	public async *events(): AsyncGenerator<typeof routes.sync.v3.Sync.Response> {
		this.abortController = new AbortController();

		while (true) {
			if (this.abortController.signal.aborted) return;

			const request: Partial<typeof routes.sync.v3.Sync.Inputs> = {};
			if (this.filterId) request.filter = this.filterId;
			if (this.nextBatch) request.since = this.nextBatch;

			const response = await this.rest.request(
				routes.sync.v3.Sync,
				{
					...(request as typeof routes.sync.v3.Sync.Inputs),
					set_presence: this.setPresence,
					use_state_after: this.useStateAfter,
				},
				{
					// give the server a bit more time to respond on its own
					timeout: this.timeout + 5000,
					signal: this.abortController.signal,
				},
			);

			this.nextBatch = response.next_batch;

			yield response;
		}
	}

	public stop(): void {
		this.abortController.abort();
	}
}
