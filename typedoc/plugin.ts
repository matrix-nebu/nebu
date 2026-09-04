import { Application, JSX } from "typedoc";

export function load(app: Application): void {
	app.renderer.hooks.on("comment.beforeTags", (_context, comment) => {
		const tag = comment.getTag("@addedIn");

		if (!tag) {
			return JSX.createElement(JSX.Fragment, null);
		}

		tag.skipRendering = true;

		const version = tag.content
			.filter((part) => part.kind === "text")
			.map((part) => part.text)
			.join("")
			.trim();

		if (!version) {
			return JSX.createElement(JSX.Fragment, null);
		}

		return JSX.createElement(
			"div",
			{ class: "nebu-added-in" },
			JSX.createElement("span", { class: "nebu-added-in-label" }, "Added in Matrix"),
			JSX.createElement("code", { class: "nebu-added-in-version" }, `${version}`),
		);
	});
}
