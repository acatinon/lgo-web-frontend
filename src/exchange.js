
import 'babel-polyfill';
import Exchange from './Exchange.svelte';

const app = new Exchange({
	target: document.body,
	props: {
		themeId: "dark"
	}
});

export default app;