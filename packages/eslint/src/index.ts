import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettier from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["**/dist/**", "**/coverage/**", "**/pnpm-lock.yaml"]),

	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.node },
	},
	{
		files: ["**/*.{ts,mts,cts}"],
		extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
	},

	{
		files: ["**/*.{js,mjs,cjs}", "*.config.{ts,mts,mjs}", "typedoc/**"],
		extends: [tseslint.configs.disableTypeChecked],
	},

	{ files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },

	{
		files: ["**/*.jsonc"],
		plugins: { json },
		language: "json/jsonc",
		extends: ["json/recommended"],
	},
	{
		files: ["**/*.json5"],
		plugins: { json },
		language: "json/json5",
		extends: ["json/recommended"],
	},
	{
		files: ["**/*.md"],
		plugins: { markdown },
		language: "markdown/gfm",
		extends: ["markdown/recommended"],
	},

	prettier,
]);
