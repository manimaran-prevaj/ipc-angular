
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable, Injector, LOCALE_ID, PLATFORM_ID, StateKey, TransferState, makeStateKey } from "@angular/core";
import { ApplicationSessionsStorage } from "./app-session-storage";
import { ApplicationCookieClient } from "./app-cookie-client";
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { buildNumber } from '../revision';

/**
 * Client build would import empty object
 * Server build would have following module
 * defined in tsconfig.json and tsconfig.server.json
 */
// import * as ApiSignature from '@pp-universal/api-signature';
import ApiSignature = require("../../src-web-mw/src-shared/client/api-signature")
import { Observable, catchError, of, retryWhen, take, tap, throwError, mergeMap } from "rxjs";
import { environment } from "../environments/environment";
import { isPlatformServer } from "@angular/common";

// Request options interface
interface IRequestOptions {
	headers?: HttpHeaders;
	observe?: 'body';
	params?: HttpParams;
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
	body?: object;
}

// additional headers interface
interface AdditionalHeaderInterface {
	name: string;
	value: string
}

@Injectable()
export class ApplicationHttpClient {

    private API_RETRY_COUNT = 2;
	private NO_RETRY_STATUS_CODES = [400, 401, 403];
	private TOKEN_REFRESH_PATH = '/user/api/v1/auth/renew_token';
    private isServer: boolean;
    private lang: string;
    // Angular local to API request header
	private localToLang = {
		'en-US': 'en',
	};
    private apiHost = '/ajax';

	// Extending the HttpClient through the Angular DI.
	public constructor(
		public http: HttpClient,
		private appSession: ApplicationSessionsStorage,
		@Inject(PLATFORM_ID) protected platformId: object,
		@Inject(LOCALE_ID) protected localId: string,
		private transferState: TransferState,
		private appCookieClient: ApplicationCookieClient,
		private injector: Injector
	) {
		// If you don't want to use the extended versions in some cases you can
		// access the public property and use the original one.
		// for ex. this.httpClient.http.get(...)
		this.isServer = isPlatformServer(platformId);
		this.lang = this.localToLang[localId];

		// SSR should talk directly to API
		if (this.isServer) {
			this.apiHost = ApiSignature.getApiBaseUrl();
		}

        console.log(environment);
	}

    /**
	 * Set unique ID
	 */
	private _uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	/**
	 * Get JWT refresh token from local storage
	 */
	private _getRefreshToken(): string {
		return this.appSession.get('refreshToken') as string;
	}

	/**
	 * If renewing token failure than clear it and reload the page
	 */
	_resetUserSession() {
		this.appSession.deleteKey('expiresInSec');
		this.appSession.deleteKey('fetchTime');
		this.appSession.deleteKey('accessToken');
		this.appSession.deleteKey('refreshToken');

		// TODO UX?
		if (typeof window === 'object') {
			// window.location.reload();
		}
	}

	/**
	 * Save JWT and refresh token into local storage
	 */
	private _saveRenewedTokens(refreshResponse) {
		const expiresInSec = refreshResponse['expires_in'];
		const accessToken = refreshResponse['access_token'];
		const refreshToken = refreshResponse['refresh_token'];
		// Current unix time
		const fetchTime = Math.round(new Date().getTime() / 1000);

		this.appSession.set('expiresInSec', expiresInSec);
		this.appSession.set('fetchTime', fetchTime);
		this.appSession.set('accessToken', accessToken);
		this.appSession.set('refreshToken', refreshToken);
	}

	private _getLastPArt(passedUrl: string) {
		const arraySplitted = passedUrl.split('/');
		const lastWord = arraySplitted[arraySplitted.length - 1]
		return lastWord
	}

    /**
	 * Set No Cache Headers
	 */
	private _noCacheHeaders(commonHttpHeader: HttpHeaders, endPoint: string) {
		if (endPoint.indexOf('user') > -1 || endPoint.indexOf('checkout') > -1) {
			commonHttpHeader = commonHttpHeader.set('Pragma', 'no-cache')
			commonHttpHeader = commonHttpHeader.set('Cache-Control', 'no-cache')
			commonHttpHeader = commonHttpHeader.set('Expires', '-1')
		}

		return commonHttpHeader;
	}

    /**
	 * Get JWT from local storage
	 */
	private _getAccessToken(): string {
		return this.appSession.get('accessToken') as string;
	}

    /**
	 * Adds following header for every request
	 */
	private _getRequestHeader() {
		const lang = this.lang;
		const options = {} as IRequestOptions;

		let commonHttpHeader = new HttpHeaders();
		const accessToken = this._getAccessToken();

		const kumulosId = this.appCookieClient.get('kumulosID') as string;

		commonHttpHeader = commonHttpHeader.set('lang', lang);
		commonHttpHeader = commonHttpHeader.set('x-request-id', this._uuidv4());
		commonHttpHeader = commonHttpHeader.set('Content-Type', 'application/json');
		commonHttpHeader = commonHttpHeader.set('Accept', 'text/plain');
		// Setting empty header value will crash angular request lib
		if (this.appCookieClient.exists('forterToken')) {
			const forterToken = this.appCookieClient.get('forterToken') as string;
			commonHttpHeader = commonHttpHeader.set('fortertoken', forterToken);
		}

		// If you need to debug default store use the two headers below
		// commonHttpHeader = commonHttpHeader.set('x-appengine-city', 'Montreal');
		// commonHttpHeader = commonHttpHeader.set('x-appengine-region', 'QC');

		// Session should be different per tab. Following header would add session token to device.
		const isSessionTokenCreated = this.appSession.exists('session-token');
		if (!isSessionTokenCreated) {
			const newSessionToken = this._uuidv4();
			this.appSession.set('session-token', newSessionToken);
		}

		// Send empty session token when renders on the server side
		const sessionTokenRaw = this.appSession.get('session-token');
		const sessionToken = sessionTokenRaw ? sessionTokenRaw.toString() : '';

		// Set tab specific session token
		commonHttpHeader = commonHttpHeader.set('session-token', sessionToken);

		if (accessToken) {
			commonHttpHeader = commonHttpHeader.set('x-access-token', accessToken);
		}

		/**
		 * New headers 06/2021
		 */
		if (kumulosId) {
			commonHttpHeader = commonHttpHeader.set('kumulos-install-id', kumulosId);
		}

		if (!Date.now) {
			Date.now = function() { return new Date().getTime(); }
		}
		const date = new Date();
		const offset = date.getTimezoneOffset();

		commonHttpHeader = commonHttpHeader.set('timestamp', '' + date.getTime());
		commonHttpHeader = commonHttpHeader.set('timezone', '' + offset);
		commonHttpHeader = commonHttpHeader.set('app-web-version', buildNumber);

		if (this.isServer) {
			const ssrRequest = this.injector.get(REQUEST);
			const ssrResponse = this.injector.get(RESPONSE);

			/**
			 * Handle session and get signature headers
			 */
			commonHttpHeader = ApiSignature.default.setSsrRequestHeader(ssrRequest, ssrResponse, commonHttpHeader, lang);
		}

		options.headers = commonHttpHeader;
		// options.withCredentials = true;

		return options;
	}

		/**
	 * Renew Auth Token
	 */
		private _renewAuthToken(): Observable<boolean> {
			const options = this._getRequestHeader();
			const refreshToken = this._getRefreshToken();
			const payload = {
				'refresh_token': refreshToken
			};
			const checkStatus = this.appSession.get('RenewalTokenStatus');
			if(!checkStatus) {
				this._openRenewalTokenStatus();
				const refreshUrl = this.apiHost + this.TOKEN_REFRESH_PATH;
	
				return this.http.post(refreshUrl, payload, options).pipe(
					mergeMap(serverResponse => {
					this._removeRenewalTokenStatus();
					// Update LocalStorage and retry the get call.
					// console.log('Token renew success');
					this._saveRenewedTokens(serverResponse);
					return of(true);
					}),
				)
			}
		}


	/**
	 * GET request
	 */
	public get<ServerModel>(endPoint: string, params?: string | any): Observable<ServerModel> {
		
		const options = this._getRequestHeader();
		options.headers = this._noCacheHeaders(options.headers, endPoint);

		let stateKeyPath = endPoint;
		let fullUrl = this.apiHost + '/' + endPoint;
		let urlParams = '';
		// console.log('GET request');

		// Build GET params string
		if (params && typeof params === 'string') {
			urlParams = params;
		} else if (params && typeof params === 'object') {
			urlParams = '?';
			const queryString = [];
			for (const key in params) {
				if (key) {
					queryString.push(key + '=' + params[key])
				}
			}
			urlParams += queryString.join('&');
		}
		fullUrl += urlParams;
		stateKeyPath += urlParams;

		const statekey: StateKey<ServerModel> = makeStateKey<ServerModel>(stateKeyPath);
		// const storedResponse = this.transferState.get<ServerModel>(statekey, null);
		// Return Transfer State only if env picker baseApiUrl has not been set
		// if (storedResponse && !baseApiUrl && !ignoreCache) {
		// 	return of(storedResponse);
		// }

		// if (responseType === 'text'){
		// 	options["responseType"] = 'text';
		// } else {
		// 	options["responseType"] = 'json';
		// }

		return this.http.get<ServerModel>(fullUrl, options).pipe(
			retryWhen(error => error.pipe(
				mergeMap((httpResponse) => {
					if (!httpResponse.ok) {
						return throwError(httpResponse);
					}
					const isHttpCodeInRetryList = this.NO_RETRY_STATUS_CODES.indexOf(httpResponse.status) > -1;
					return isHttpCodeInRetryList ? throwError(httpResponse) : of(httpResponse)
				}),
				take(this.API_RETRY_COUNT),
			)),
			catchError(error => {

				const refreshToken = this._getRefreshToken();
				if (error.status === 401 && refreshToken) {
					const payload = {
						'refresh_token': refreshToken
					};
					const checkStatus = this.appSession.get('RenewalTokenStatus');
					if(!checkStatus) {
						this._openRenewalTokenStatus();
						const refreshUrl = this.apiHost + this.TOKEN_REFRESH_PATH;
						return this.http.post(refreshUrl, payload, options).pipe(
							mergeMap(serverResponse => {
                                this._removeRenewalTokenStatus();
								// Update LocalStorage and retry the get call.
								this._saveRenewedTokens(serverResponse);
								return this.get<ServerModel>(endPoint, params);
							}),
							catchError((newError) => {
                                this._removeRenewalTokenStatus();
								const lastPartPathNewError = this._getLastPArt(newError.url);
								const lastPartPath = this._getLastPArt(refreshUrl);
								if (lastPartPath === lastPartPathNewError) {
									console.error('CRITICAL | Renewing token failure', newError);
									this._resetUserSession();
								}
								return throwError(newError);
							})
						)
					}
				} else {
					return throwError(error);
				}
			}),
			tap(data => {
				if (this.isServer) {
					this.transferState.set(statekey, data)
				}
			})
		)
	}

	
	/**
	 * POST request
	 */
	public post<ServerModel>(endPoint: string, params: any, additionalHeaders?: AdditionalHeaderInterface[]): Observable<ServerModel> {

		const options = this._getRequestHeader();
		const fullUrl = this.apiHost + '/' + endPoint;

		if (additionalHeaders && additionalHeaders.length > 0) {
			additionalHeaders.forEach(header => {
				options.headers = options.headers.set(header.name, header.value)
			})
		}

		return this.http.post<ServerModel>(fullUrl, params, options).pipe(
			retryWhen(error => error.pipe(
				mergeMap((httpResponse) => {
					if (!httpResponse.ok) {
						return throwError(httpResponse);
					}
					const isHttpCodeInRetryList = this.NO_RETRY_STATUS_CODES.indexOf(httpResponse.status) > -1;
					return isHttpCodeInRetryList ? throwError(httpResponse) : of(httpResponse)
				}
				),
				take(this.API_RETRY_COUNT),
			)),
			catchError(error => {

				const refreshToken = this._getRefreshToken();
				// note: once backend changes the login failure response to 200 we should move refreshToken back within the if statement
				if (error.status === 401 && refreshToken) {
					const payload = {
						'refresh_token': refreshToken
					};
					const checkStatus = this.appSession.get('RenewalTokenStatus');
					if(!checkStatus) {
						this._openRenewalTokenStatus();
						const refreshUrl = this.apiHost + this.TOKEN_REFRESH_PATH;
						return this.http.post(refreshUrl, payload, options).pipe(
							mergeMap(serverResponse => {
								this._removeRenewalTokenStatus();
								// Update LocalStorage and retry the get call.f
								this._saveRenewedTokens(serverResponse);
								return this.post<ServerModel>(endPoint, params);
							}),
							catchError((newError) => {
								this._removeRenewalTokenStatus();
								const lastPartPathNewError = this._getLastPArt(newError.url);
								const lastPartPath = this._getLastPArt(refreshUrl);
								if (lastPartPath === lastPartPathNewError) {
									console.error('CRITICAL | Renewing token failure', newError, 'fullUrl:', fullUrl, 'refreshUrl', refreshUrl);
									this._resetUserSession();
								}
								return throwError(newError);
							})
						)
					}
				} else {
					return throwError(error);
				}
			})
		);
	}
		/**
	 * PUT request
	 */
		public put<ServerModel>(endPoint: string, params: any): Observable<ServerModel> {
			const options = this._getRequestHeader();
			const fullUrl = this.apiHost + '/' + endPoint;
	
			return this.http.put<ServerModel>(fullUrl, params, options).pipe(
				retryWhen(error => error.pipe(
					mergeMap((httpResponse) => {
						if (!httpResponse.ok) {
							return throwError(httpResponse);
						}
						const isHttpCodeInRetryList = this.NO_RETRY_STATUS_CODES.indexOf(httpResponse.status) > -1;
						return isHttpCodeInRetryList ? throwError(httpResponse) : of(httpResponse)
					}
					),
					take(this.API_RETRY_COUNT),
				)),
				catchError(error => {
	
					const refreshToken = this._getRefreshToken();
	
					if (error.status === 401 && refreshToken) {
						const payload = {
							'refresh_token': refreshToken
						};
						const checkStatus = this.appSession.get('RenewalTokenStatus');
						if(!checkStatus) {
							this._openRenewalTokenStatus();
							const refreshUrl = this.apiHost + this.TOKEN_REFRESH_PATH;
							return this.http.post(refreshUrl, payload, options).pipe(
								mergeMap(serverResponse => {
									this._removeRenewalTokenStatus();
									// Update LocalStorage and retry the get call.
									this._saveRenewedTokens(serverResponse);
									return this.put<ServerModel>(endPoint, params);
								}),
								catchError((newError) => {
									this._removeRenewalTokenStatus();
									const lastPartPathNewError = this._getLastPArt(newError.url);
									const lastPartPath = this._getLastPArt(refreshUrl);
									if (lastPartPath === lastPartPathNewError) {
										console.error('CRITICAL | Renewing token failure', newError);
										this._resetUserSession();
									}
									return throwError(newError);
								})
							)
						}
					} else {
						return throwError(error);
					}
				})
			);
		}
	
		/**
		 * DELETE request
		 */
		public delete<ServerModel>(endPoint: string): Observable<ServerModel> {
			const options = this._getRequestHeader();
			const fullUrl = this.apiHost + '/' + endPoint;
	
			return this.http.delete<ServerModel>(fullUrl, options).pipe(
				retryWhen(error => error.pipe(
					mergeMap((httpResponse) => {
						if (!httpResponse.ok) {
							return throwError(httpResponse);
						}
						const isHttpCodeInRetryList = this.NO_RETRY_STATUS_CODES.indexOf(httpResponse.status) > -1;
						return isHttpCodeInRetryList ? throwError(httpResponse) : of(httpResponse)
					}
					),
					take(this.API_RETRY_COUNT),
				)),
				catchError(error => {
	
					const refreshToken = this._getRefreshToken();
	
					if (error.status === 401 && refreshToken) {
						const payload = {
							'refresh_token': refreshToken
						};
						const checkStatus = this.appSession.get('RenewalTokenStatus');
						if(!checkStatus) {
							this._openRenewalTokenStatus();
							const refreshUrl = this.apiHost + this.TOKEN_REFRESH_PATH;
							return this.http.post(refreshUrl, payload, options).pipe(
								mergeMap(serverResponse => {
									this._removeRenewalTokenStatus();
									// Update LocalStorage and retry the get call.
									this._saveRenewedTokens(serverResponse);
									return this.delete<ServerModel>(endPoint);
								}),
								catchError((newError) => {
									this._removeRenewalTokenStatus();
									const lastPartPathNewError = this._getLastPArt(newError.url);
									const lastPartPath = this._getLastPArt(refreshUrl);
									if (lastPartPath === lastPartPathNewError) {
										console.error('CRITICAL | Renewing token failure', newError);
										this._resetUserSession();
									}
									return throwError(newError);
								})
							)
						}
					} else {
						return throwError(error);
					}
				})
			);
		}

	private _openRenewalTokenStatus() {
		this.appSession.set('RenewalTokenStatus', 1);
	}
	
	private _removeRenewalTokenStatus() {
		this.appSession.deleteKey('RenewalTokenStatus');
	}

}
