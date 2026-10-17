import { MockAgent, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import { afterEach, beforeEach } from "vitest";

type InterceptOptions = Parameters<ReturnType<MockAgent["get"]>["intercept"]>[0];

export const origin = "https://homeserver.test";

export const useHomeserver = () => {
	const original = getGlobalDispatcher();

	let agent: MockAgent;

	beforeEach(() => {
		agent = new MockAgent();
		agent.disableNetConnect();

		setGlobalDispatcher(agent);
	});

	afterEach(async () => {
		try {
			agent.assertNoPendingInterceptors();
		} finally {
			await agent.close();
			setGlobalDispatcher(original);
		}
	});

	return {
		intercept: (options: InterceptOptions) => agent.get(origin).intercept(options),
		fetch: globalThis.fetch,
	};
};
