// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export interface IEnvConfig {
	isProdModeEnabled: boolean;
	isEnvPickerEnabled: boolean;
	env: string;
	apiHost: string;
	googleServiceKey: string;
	visaCheckoutKey: string;
	visaCheckoutSDKUrl: string;
	visaCheckoutBtnPath: string;
	fbAppId: string;
	googleOauthClientId: string;
	tagAnalyticsKey: string;
	recaptchaClientKey: string;
	recaptchav2ClientKey: string;
}


export const environment: IEnvConfig = {
	isProdModeEnabled: true,
	isEnvPickerEnabled: true,
	env: 'uat',
	apiHost: '/ajax', // Same as hosted static files
	googleServiceKey: 'AIzaSyCSopYLOHccRWMUDtNceS6X-IcGMV6aa0Y',
	visaCheckoutKey: 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI',
	visaCheckoutSDKUrl: 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
	visaCheckoutBtnPath: 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png',
	fbAppId: '624145881267740',
	googleOauthClientId: '529491074325-ds06japs2j4m6j83mqeff3top68nl1ui.apps.googleusercontent.com',
	tagAnalyticsKey: 'GTM-W7QJ6KVF',
	recaptchaClientKey: '6Ld1MbAUAAAAAPcFJqLdbOHzAptLMzkPIC22RW4L',
	recaptchav2ClientKey: '6LeG1okiAAAAAJiax2DZclQkDp7WInA3uz5Myh7K'
};


// Temp setup to use prod keys on UAT
// environment.googleServiceKey = 'AIzaSyB8qajvb79Y9NE33gZfRorrSpYiKU3JkZU';
// environment.visaCheckoutKey = 'GK1F0NIKGNGPOGG0SZH321EzssTNu1bfFhBlLbGjAm3nLCyMY';
// environment.visaCheckoutSDKUrl = 'https://assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
// environment.visaCheckoutBtnPath = 'https://secure.checkout.visa.com/wallet-services-web/xo/button.png';
// environment.fbAppId = '134691203322543';
// environment.googleOauthClientId = '870073479312-h6fjp0dirfsgrr9gv3m0ggra1lrvbet4.apps.googleusercontent.com ';


// export * from './common';
