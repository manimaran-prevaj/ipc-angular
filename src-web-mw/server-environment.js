/**
	* Config and evn picker for MW
	* !!!!
	* Make Sure That Config Is NOT EXPOSED to client build
	* Only For Web Middleware and Server Side Rendering
	* !!!!
*/

const gaeAppId = process.env.GOOGLE_CLOUD_PROJECT;
const isRunningLocally = !gaeAppId;
let currentEnv = 'ppl-ccc-uat-fe';

// Sessions IP limiter is not used in current version
const devSessionIpLimits = {
	isEnabled: false,
	host: isRunningLocally ? 'localhost' : '10.0.0.3',
	port: '6379',
	maxSessionCount: 30,
	limitResetTimeSec: 60 * 5 // 5 minutes
}

// Maps project id to enviroment
const appsEnv = {
	'ppl-ccc-uat-fe': 'ppl-ccc-uat-fe'
}

const envConfig = {
	'ppl-ccc-uat-fe': {
		sessionIpLimits: devSessionIpLimits,
		session_secret_key: '',
		base_api_host: '',
		recaptcha_key: '',
		allowed_api_hosts: [
		],
		auth: {
			private: '',
			public: ''
		}
	},
}

console.log(`Using config for product id: ${gaeAppId}`);

if (appsEnv[gaeAppId]) {
	currentEnv = appsEnv[gaeAppId]
} else {
	console.log(`CRITICAL | Environment is not defined for project id: ${gaeAppId}. Using default configuration: ${currentEnv}`);
	if (!isRunningLocally) {
		console.log(`Current proccess env:`);
		console.log(process.env);
	}
}

const obj = {
	isRunningLocally,
	...envConfig[currentEnv]
}

export default obj;
