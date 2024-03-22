import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";


@Injectable()
export class AppSessionsStorage {

	private isSessionStorageAvail = false;
	private sessionStorageEmulator: { key?: string } = {};

	/**
		* The session data would be saved to js runtime memory if
		* session storage is not accessible.
	*/
	constructor(@Inject(PLATFORM_ID) private platformId: object) {
		this.isSessionStorageAvail = typeof sessionStorage === 'object' && 'setItem' in sessionStorage;
	}

	/**
		* Sets local storage
	*/
	public set(key: string, value: string | number | boolean | object | object[] | number[] | string[]) {
		if (isPlatformBrowser(this.platformId)) {
			if (this.isSessionStorageAvail) {
				sessionStorage.setItem(key, JSON.stringify(value));
			} else {
				this.sessionStorageEmulator[key] = JSON.stringify(value);
			}
		}
	}

	/**
		* Gets local storage
	*/
	public get(key: string): string | number | boolean | object | object[] | number[] | string[] | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}

		if (this.isSessionStorageAvail) {
			const value = sessionStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} else {
			const value = this.sessionStorageEmulator[key];
			return value ? JSON.parse(value) : null;

		}
	}

	/**
		* Check to see if item exists in local storage
	*/
	public exists(key): boolean {
		if (!isPlatformBrowser(this.platformId)) {
			return false;
		}

		if (this.isSessionStorageAvail) {
			return Boolean(sessionStorage.getItem(key));
		} else {
			return Boolean(key in this.sessionStorageEmulator);
		}
	}

	/**
		* Removes value from local storage
	*/
	public deleteKey(key: string) {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		if (this.isSessionStorageAvail) {
			sessionStorage.removeItem(key);
			return;
		} else {
			delete this.sessionStorageEmulator.key;
			return;
		}
	}
}
