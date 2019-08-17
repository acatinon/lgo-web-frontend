
import 'babel-polyfill';
import Exchange from './Exchange.svelte';

const app = new Exchange({
	target: document.body,
	props: {}
});

export default app;