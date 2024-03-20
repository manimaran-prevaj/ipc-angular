const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');
const TerserPlugin = require("terser-webpack-plugin");


module.exports = merge(webpackConfig, {

	devtool: false,

	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'pp-sdk-bundle.js'
	},

	plugins: [
		new CleanWebpackPlugin()
	],

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true
			})
		]
	}

});
