import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Observable, mergeMap } from "rxjs";

// Config dictates which methods needs to have captcha
import * as captchaProtectedMethods from '../../src-web-mw/config-captcha-paths'

@Injectable()
export class AppHttpCaptcha implements HttpInterceptor {
	/**
	 * Creates a dict of path-method to avoid search by 2 values on every request
	*/

	protectedMethodsDict = {};

	constructor(
		private recaptchaV3Service: ReCaptchaV3Service
	) {
		captchaProtectedMethods.forEach((value) => {
			this.protectedMethodsDict[`${value.method}_${value.path}`] = value.action;
		})
	}

	/**
		* Middleware for adding silent captcha fot methods defined in the config
		* @param req - Request issues by http client
		* @param next
	*/
	/** Diabling eslint as HttpRequest<T> is of type generic  */
	/* eslint-disable */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<object>> {
		const methodPath = `${req.method}_${req.url.replace('/ajax/', '')}`;

		if (methodPath in this.protectedMethodsDict) {
			const captchaAction = this.protectedMethodsDict[methodPath];
			return this.recaptchaV3Service.execute(captchaAction)
				.pipe(
					mergeMap((token) => {
						req.body['token'] = token;
						return next.handle(req);
					})
				)
		} else {
			return next.handle(req);
		}
	}
	/* eslint-enable */
}
