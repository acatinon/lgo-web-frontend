<script>
import moment from "moment";
import { readable } from 'svelte/store';

export let value;

export const formatted = readable(moment(value).fromNow(), function start(set) {
	const interval = setInterval(() => {
		set(moment(value).fromNow());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

</script>

<span>{$formatted}</span>