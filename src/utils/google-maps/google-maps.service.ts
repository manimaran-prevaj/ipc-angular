import {
	Injectable,
	ModuleWithProviders,
	Optional,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { UserServiceConfig } from './google-maps.class';


// Env config
const googleServiceKey = 'AIzaSyC0zOIHU71Kv09KZolCIBhntJlt_NLk4Vw';

@Injectable()
export class GoogleMapsService {
	/* eslint-disable @typescript-eslint/no-explicit-any */

	/**
	 * Google Maps Api link
	 */
	readonly base = 'https://maps.googleapis.com/maps/api/';
	readonly url: string;
	readonly geoUrl: string;

	/**
	 * Promise to callback
	 */
	private loadAPI: Promise<any>;
	private loadAPI1: Promise<any>;

	private isRenderedOnServer: boolean;

	/**
	 * Configure core method
	 * @param config
	 * @returns {{ngModule: GoogleMapsService, providers: [{provide: UserServiceConfig, useValue: UserServiceConfig}]}}
	 */
	static forRoot(config: UserServiceConfig): ModuleWithProviders<GoogleMapsService> {
		return {
			ngModule: GoogleMapsService,
			providers: [
				{ provide: UserServiceConfig, useValue: config }
			]
		};
	}

	/**
	 * Constructor
	 * @param config
	 */
	constructor(
		@Optional() config: UserServiceConfig,
		private http: HttpClient,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);

		if (config) {
			this.url = this.base + 'js?key=' + googleServiceKey + '&callback=__onGoogleLoaded&libraries=' + config.libraries.join(',');
			this.geoUrl = this.base + 'geocode/json?key=' + googleServiceKey;
		} else {
			throw new Error('Module have been forRoot({API_KEY: your api key})');
		}
	}

	/**
	 * Load script
	 */
	private loadScript(): void {
		if (!this.isRenderedOnServer) {
			if (!document.getElementById('google-maps-angular2')) {
				const script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = `${this.url}`;
				script.id = 'google-maps-angular2';

				document.head.appendChild(script);
			}
		}
	}

	/**
	 * Wait callback and return google.maps object
	 * @returns {Promise<any>}
	 */


	get init(): Promise<any> {
		this.loadAPI = new Promise((resolve) => {
			if (!this.isRenderedOnServer) {

				if (!window['__onGoogleLoaded']) {
					/* eslint-disable */
					window['__onGoogleLoaded'] = (ev: any) => {
						resolve(window['google']['maps']);
					};
					this.loadScript();
				} else {
					resolve(window['google']['maps']);
				}

			}
		});
		return this.loadAPI;
	}

	/**
	 * Wait callback and return google.maps object
	 * @returns {Promise<any>}
	 */
	get initload(): Promise<any> {
		this.loadAPI1 = new Promise((resolve) => {
			if (!this.isRenderedOnServer) {

				if (!window['agmLazyMapsAPILoader']) {
					/* eslint-disable */
					window['agmLazyMapsAPILoader'] = (ev: any) => {
						resolve(window['google']['maps']);
					};
				} else {
					resolve(window['google']['maps']);
				}

			}
		});
		return this.loadAPI1;
	}


	/**
	 * find addresses based on lat and long
	 */
	reverseGeo(latlng) {
		const url = this.geoUrl + '&latlng=' + latlng;
		return this.http.get(url).pipe(
			map((res) => res)
		);
		// ...errors if any
		// .catch((error: any) => Observable.throwError(error.json().error || 'Server error'));
	}

}
