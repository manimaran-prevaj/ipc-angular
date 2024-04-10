/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {
			colors: {
				'banner-green': '#148119',
				"color-brown": "#49454F",
				"border-color-gray": "#E6E6E6",
				"border-sidenav": "#CACACA"
			},
		},
	},
	plugins: [],
}
