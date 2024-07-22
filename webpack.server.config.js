import path from 'path';
// import webpack from 'webpack';
import { AngularWebpackPlugin } from '@ngtools/webpack';

import linkerPlugin from '@angular/compiler-cli/linker/babel';

import nodeExternals from 'webpack-node-externals';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  /* ... */
  mode: 'production',
  entry: { server: path.join(__dirname, 'server.ts') }, 
  resolve: { 
	extensions: ['.js', '.ts', '.css', '.scss']
  },
  externalsPresets: { node: true },
  target: 'es2022',
  externalsType: 'module',
  externals: [nodeExternals(
	{
        importType: 'module'
    }
  )],
  experiments: {
	outputModule: true
  },
  output: {
	path: path.join(__dirname, `dist`),
	filename: 'server.js',
	library: {
		type: 'module'
	}
  },
  module: {
    rules: [
      /* ... */
      {
        test: /\.[jt]sx?$/,
        loader: '@ngtools/webpack',
      },
	  {
        test: /\.[cm]?js$/,
        use: {
          loader: 'babel-loader',
		  options: {
			presets: [
				'@babel/preset-env'
			],
			// "plugins": [
			// 	'@babel/plugin-proposal-class-properties'
			// ],
			cacheDirectory: true,
            compact: false,
            plugins: [linkerPlugin, '@babel/plugin-proposal-class-properties'],
          },
        },
      },
	  { test: /\.[s]?css$/, loader: 'raw-loader' }
    ],
  },

  plugins: [
	// new webpack.ContextReplacementPlugin(
	// 	/(.+)?express(\\|\/)(.+)?/,
	// 	path.join(__dirname, 'src'),
	// 	{}
	// ),
    new AngularWebpackPlugin({
      tsconfig: path.join(__dirname, 'tsconfig.json'),
      // ... other options as needed
    }),
  ],
};