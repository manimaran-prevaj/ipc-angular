/**
	* This config is shared between Angular http interceptor and web middleware
	* If HTTP method and path is in the list that it would be protected by google v3 captcha
*/

/**
	* path, method - HTTP method which needs to be protected
	* action - Unique identifier used for check if generate captcha was for specific method
*/
const captchaProtectedMethods = [

]

export default captchaProtectedMethods;
