import App from './App.svelte';

const app = new App({
	target: document.getElementById("app-container"),
	// target: document.body,
	props: {
		name: 'world'
	}
});

export default app;