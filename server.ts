import 'zone.js';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, CommonEngineRenderOptions } from '@angular/ssr';
import * as express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import { existsSync } from 'node:fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
	const server = express();
	const distFolder = join(process.cwd(), '/build-browser');
	const indexHtml = existsSync(join(distFolder, 'index.original.html'))
		? join(distFolder, 'index.original.html')
		: join(distFolder, 'index.html');

	const commonEngine = new CommonEngine();

	server.set('view engine', 'html');
	server.set('views', distFolder);

	// Example Express Rest API endpoints
	// server.get('/api/**', (req, res) => { });
	// Serve static files from /browser
	server.get('*.*', express.static(distFolder, {
		maxAge: '1y'
	}));

	// All regular routes use the Angular engine
	server.get('*', (req, res, next) => {
		const { protocol, originalUrl, baseUrl, headers } = req;

		commonEngine
			.render({
				bootstrap: AppServerModule,
				documentFilePath: indexHtml,
				url: `${protocol}://${headers.host}${originalUrl}`,
				publicPath: distFolder,
				providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
			})
			.then((html) => res.send(html))
			.catch((err) => next(err));
	});

	return server;
}

function run(): void {
	const port = process.env['PORT'] || 4000;

	// Start up the Node server
	const server = app();
	server.listen(port, () => {
		console.log(`Node Express server listening on http://localhost:${port}`);
	});
}

run();
