import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { ErrorHandler, Injectable, Injector } from "@angular/core";


@Injectable()
export class AppGlobalErrorHandler extends ErrorHandler {
	constructor(
		private injector: Injector
	) {
		super();
	}

	/**
		* Any JS crash will call this function
	*/
	override handleError(error: Error) {
		const location = this.injector.get(LocationStrategy);
		const url = location instanceof PathLocationStrategy ? location.path() : '';

		// Removes line brakes from call stack
		const stack = error.stack ? error.stack.replace(/(\r\n|\n|\r)/gm, '') : null;
		const customError = {
			event: 'customJSError',
			eventCategory: 'JavaScript Errors',
			eventAction: stack,
			eventLabel: url
		};
		super.handleError(error);
	}
}
