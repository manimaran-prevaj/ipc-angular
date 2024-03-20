const path = require('path');
const webpack = require('webpack');

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');

/**
 * Webpack Configuration
 */
module.exports = {
	entry: {
		bundle: path.join(dirApp, 'index.ts')
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		fallback: {
			"timers": require.resolve("timers-browserify"),
			"crypto": require.resolve("crypto-browserify")
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			IS_DEV: IS_DEV
		}),
	],
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						compact: false,
					}
				},
			},
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: ["ts-loader"]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
					"postcss-loader",
				],
			}
		]
	}

};
