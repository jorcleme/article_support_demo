// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {}
		interface PageData {
			url: URL
		}
		interface PageError {}
		interface Platform {}
		interface LayoutLoad {
			url: URL
		}
	}
}
