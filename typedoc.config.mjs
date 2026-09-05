import { OptionDefaults } from "typedoc";

/** @type {import("typedoc").TypeDocOptions} */
const config = {
	entryPointStrategy: "packages",
	entryPoints: ["packages/sdk", "packages/types", "packages/rest"],

	plugin: ["./typedoc/plugin.ts"],

	packageOptions: {
		blockTags: [...OptionDefaults.blockTags, "@addedIn"],
	},
};

export default config;
