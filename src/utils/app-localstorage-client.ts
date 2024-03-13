import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";


@Injectable()
export class AppLocalStorageClient {
	constructor(@Inject(PLATFORM_ID) private platformId: object) { }
	/**
		* Sets local storage
	*/
	public set(key: string, value: string | number | boolean | object | Array<object> | Array<number> | Array<string>) {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	/**
		* Gets local storage
	*/
	public get(key: string): string | number | boolean | object | Array<object> | Array<number> | Array<string> | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		const localStore = localStorage.getItem(key);
		return JSON.parse(localStore);
	}

	/**
		* Check to see if item exists in local storage
	*/
	public exists(key): boolean {
		if (!isPlatformBrowser(this.platformId)) {
			return false;
		}
		return Boolean(localStorage.getItem(key));
	}

	/**
		* Removes value from local storage
	*/
	public deleteKey(key: string) {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		localStorage.removeItem(key);
	}
}
