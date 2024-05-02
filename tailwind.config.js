/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {
			colors: {
				'dark-green': '#148119',
				"dark-brown": "#49454f",
				"white-grey": "#e6e6e6",
				"pastel-grey": "#cacaca",
				"dark-orange": "#d4400f",
				"snow-grey": "#f7f9fB"
			},
		},
	},
	plugins: [],
}
