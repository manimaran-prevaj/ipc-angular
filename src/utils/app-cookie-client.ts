import { isPlatformBrowser } from "@angular/common"
import { Inject, Injectable, Optional, PLATFORM_ID } from "@angular/core"
import { Subject } from "rxjs";
import Cookies from 'js-cookie';


@Injectable()
export class ApplicationCookieClient {
	private readonly cookieSource = new Subject<Readonly<Record<string, [string]>>>()
	public readonly cookies$ = this.cookieSource.asObservable();

	constructor(@Inject(PLATFORM_ID) private platformId: object, @Optional() @Inject(Request) private req) { }
	/**
		* Sets local storage
	*/
	public set(key: string, value, options?) {
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
	public get(key: string): string | number | boolean | object | object[] | number[] | string[] | null {
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
	public getAll() {
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
