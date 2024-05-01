import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
	providedIn: 'root'
})

export class CustomerEntryService {
	// TODO :: Remove this logic to NgRx Store
	private deliveryTypeSubject = new Subject<string>();
	deliveryType$ = this.deliveryTypeSubject.asObservable();

	setDeliveryType(type: string) {
		this.deliveryTypeSubject.next(type);
	}
}
