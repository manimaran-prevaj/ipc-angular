import { isPlatformBrowser } from "@angular/common"
import { Inject, Injectable, Optional, PLATFORM_ID } from "@angular/core"
import { Observable, Subject } from "rxjs";
import Cookies from 'js-cookie';


export interface ICookieService {
	// tslint:disable:no-any
	readonly cookies$: Observable<{ readonly [key: string]: any }>
	/**
	 * get all cookies
	 */
	getAll(): any
	/**
	 * get cookie
	 */
	get(name: string): any
	/**
	 * set cookies
	 */
	set(name: string, value: any, options?): void
	/**
	 * remove cookies
	 */
	remove(name: string, options?): void
}

@Injectable()
export class AppCookieClient {
	private readonly cookieSource = new Subject<{ readonly [key: string]: any }>()
	public readonly cookies$ = this.cookieSource.asObservable();

	constructor(@Inject(PLATFORM_ID) private platformId: Object, @Optional() @Inject(Request) private req: any) { }
	/**
		* Sets local storage
	*/
	public set(key: string, value: any, options?) {
		if (isPlatformBrowser(this.platformId)) {
			const defaultOptions = {
				sameSite: 'Strict'
			};

			const setOptions = { ...defaultOptions, ...options }

			Cookies.set(key, value, setOptions)
			this.updateSource();
		}
	}

	/**
		* Gets local storage
	*/
	public get(key: string): string | number | boolean | Object | Array<Object> | Array<Number> | Array<String> | null {
		if (isPlatformBrowser(this.platformId)) {
			return JSON.stringify(key)
		} else {
			try {
				return this.req && this.req.cookies ? JSON.parse(this.req.cookies[key]) : undefined
			} catch (err) {
				return this.req && this.req.cookies ? this.req.cookies[key] : undefined
			}
		}
	}

	/**
		* Check to see if item exists in local storage
	*/
	public exists(key: string): boolean {
		return Boolean(this.get(key))
	}

	/**
		* Removes value from local storage
	*/
	public deleteKey(key: string, options?) {
		if (isPlatformBrowser(this.platformId)) {
			Cookies.remove(key, options)
			this.updateSource()
		}
	}

	/**
		* get all
	*/
	public getAll(): any {
		if (isPlatformBrowser(this.platformId)) {
			return
		} else {
			if (this.req) {
				return this.req.cookies
			}
		}
	}

	/**
		* Update Cookies
	*/
	private updateSource() {
		this.cookieSource.next(this.getAll())
	}
}
