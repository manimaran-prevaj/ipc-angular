

export class PpLogging {

	/**
	 * Checks browser global object
	 */
	static isEnabled() {
		return typeof window === 'object' && 'ccc-sdk-logging' in window;
	}
}
