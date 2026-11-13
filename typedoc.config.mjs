import { OptionDefaults } from "typedoc";

/** @type {import("typedoc").TypeDocOptions} */
const config = {
	entryPointStrategy: "packages",
	entryPoints: ["packages/sdk", "packages/api"],

	plugin: ["./typedoc/plugin.ts"],

	packageOptions: {
		blockTags: [...OptionDefaults.blockTags, "@addedIn"],
		excludeInternal: true,
	},
};

export default config;
