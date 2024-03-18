// Libs for remote request
import axios from 'axios';

// Server env config
import * as envConfig from './../server-environment.js';

// Captcha methods list
import captchaProtectedMethods from '../config-captcha-paths.js';

// https://developers.google.com/recaptcha/docs/verify

const Captcha = (() => {
	const captchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
	// need data
	const recaptchaKey = envConfig.recaptcha_key;

	let protectedMethodsDict = {};
	captchaProtectedMethods.forEach(value => {
		protectedMethodsDict[`${value.method}_${value.path}`] = value.action;
	})

	const isPathRequireCaptcha = (path) => {
		return path in protectedMethodsDict;
	}

	/**
		* Makes remote call to google to verify captcha token
		* Validates decoded token action
	*/
	const isTokenValid = async (methodPath, token, remoteIp) => {
		return new Promise((resolve, reject) => {
			const params = {
				secret: recaptchaKey,
				response: token,
				remoteip: remoteIp
			};
			const headers = {
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
			}

			const captchaAction = protectedMethodsDict[methodPath];
			axios.post(captchaVerifyUrl, {}, { headers, params }).then(result => {
				const response = result.data || {};
				console.log(response);

				// Check is `success` key is present in the response
				if (!('success' in response)) {
					console.error('type:monitoring operation_name:invalid_recapthca_response success:False reason:Invalid re captha response');
					console.error(response);
					resolve(false);
					return false;
				}

				// Check if request captcha method match with decoded
				if (captchaAction !== response.action) {
					console.error('type:monitoring operation_name:invalid_recapthca_method success:False reason:Invalid re captha response method');
					resolve(false);
					return false;
				}

				// Success
				resolve(!!response.success);
			}).catch(error => {
				// Error
				if (error.response) {
					/*
						* The request was made and the server responded with a
						* status code that falls out of the range of 2xx
					*/
					console.error(`type:monitoring operation_name:api_invalid_response_code success:False reason:${error.response.status}`);
					console.error(error.response.data);
					console.error(error.response.headers);
				} else if (error.request) {
					/*
						* The request was made but no response was received, `error.request`
						* is an instance of XMLHttpRequest in the browser and an instance
						* of http.ClientRequest in Node.js
					*/
					console.error(`type:monitoring operation_name:api_no_response success:False reason:${error.request}`);
					console.error(error.request);
				} else {
					// Something happened in setting up the request and triggered an Error
					console.error(`type:monitoring operation_name:api_unknown_error success:False reason:${error.config}`);
					console.error(error.config);
				}

				resolve(false);
			})
		})

	}

	return {
		isPathRequireCaptcha,
		isTokenValid
	}
})();

export default Captcha;
