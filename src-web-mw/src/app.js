// Library imports
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Web app server
const app = express();

// Environment config
import EnvConfig from './../server-environment.js';

// App imports
import Captcha from './captcha.js';
import RemoteDal from './remote-dal.js';
import WebSession from './web-session.js';


// Required to pass real client's IP to the instance
// https://cloud.google.com/appengine/docs/flexible/nodejs/runtime#https_and_forwarding_proxies
app.set('trust proxy', true);

// Post params and cookie extractor middleware
app.use(bodyParser.urlencoded({
	limit: '50mb',
	parameterLimit: 100000,
	extended: true
}))
app.use(bodyParser.json({
	limit: '50mb'
}))
app.use(cookieParser());


app.all('*', async (req, res) => {
	const method = req.method;
	const url = req.url;
	const clientHeaders = req.headers;
	const path = url.replace('/ajax/', '');
	const requestIp = req.ip;
	clientHeaders['x-real-ip'] = requestIp;
	const params = req.body;

	// Allow CORS requested ONLY for local
	if (EnvConfig.isRunningLocally) {
		const originHeader = req.header('Origin');
		// If you run server side rendering request would go cross domain.
		if (originHeader) {
			res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
			res.set('Access-Control-Allow-Origin', originHeader);
			res.set('Access-Control-Allow-Headers', 'x-request-id, lang, base-api-url, content-type');
		}

		if (method === 'OPTIONS') {
			res
				.status(200)
				.end();
			return false;
		}
	}

	// Check it request header are valid and redirect to base if not
	const isHeadersValid = RemoteDal.checkHeaderValid(clientHeaders);
	if (!isHeadersValid) {
		console.error('type:monitoring operation_name:invalid_headers success:False reason:Missing request id');
		res
			.status(415)
			.end();
		return false;
	}

	// Handle cookies based session
	let { deviceId } = WebSession.getOrCreateSessionDeviceId(req, res);
	// Append session id to device id to implement tab specific session
	const sessionToken = req.header('session-token');
	deviceId = `${deviceId}_${sessionToken}`

	// // Handel limit if session is new
	// if (isNewSession) {
	// 	const isNewSessionAllowed = await WebSessionLimiter.isNewSessionAllowed(requestIp);
	// 	if (!isNewSessionAllowed) {
	// 		// https://tools.ietf.org/html/rfc7231#section-6.5.9
	// 		console.error('type:monitoring operation_name:ip_rate_limiter success:False reason:Too many requests');
	// 		res
	// 			.status(410)
	// 			.end();
	// 		return false;
	// 	}

	// 	WebSessionLimiter.countStartedSession(requestIp);
	// }

	const methodPath = `${method}_${path}`;
	// Check captcha for defined routes
	if (Captcha.isPathRequireCaptcha(methodPath)) {
		const token = params.token;
		const isTokenValid = await Captcha.isTokenValid(methodPath, token, requestIp);
		if (!isTokenValid) {
			console.error('type:monitoring operation_name:invalid_recapthca_token success:False reason:Invalid re captha token');

			res.status(405).end();
			return false;
		}
	}

	// Call API
	const request = {
		method,
		path,
		params
	}
	const callResult = await RemoteDal.call(request, clientHeaders, deviceId);

	res
		.status(callResult.httpCode)
		.send(callResult.body)
		.end();
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log('Press Ctrl+C to quit.');
});
