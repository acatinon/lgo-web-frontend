import { writable } from 'svelte/store';

function createTheme() {
	const { subscribe, set } = writable(localStorage.getItem("theme") || "dark");

    const updateLocalStorage = (value: string) => {
        localStorage.setItem("theme", value);
        set(value);
    }

	return {
		subscribe,
		set: updateLocalStorage
	};
}

export const theme = createTheme();