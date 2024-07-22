import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, map, throwError } from "rxjs";

@Injectable()
export class AppHttpErrors implements HttpInterceptor {
	private SHOW_GLOBAL_ERROR_CODES = [429];


	/**
	 * Check if HTTP code
	 */
	private handleOnRequest(event: any) {
		const httpCode = event.status;
		const isGlobalErrorForCode = this.SHOW_GLOBAL_ERROR_CODES.indexOf(httpCode) !== -1;
		if (isGlobalErrorForCode) {
			// this.store.dispatch(new RateLimitReached());
			return;
		}
	}

	/**
		* Middleware for checking all HTTP codes.
		* Dispatches NGRX action if any call returns 429
	*/
	intercept(req: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {
		return next.handle(req).pipe(
			map((event: HttpEvent<object>) => {
				this.handleOnRequest(event);
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				this.handleOnRequest(error);
				return throwError(() => error);
			})
		);

	}
}
