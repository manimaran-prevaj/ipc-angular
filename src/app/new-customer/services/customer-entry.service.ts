import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer-details'
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable({
	providedIn: 'root'
})

export class CustomerEntryService {

	constructor(private httpClient: ApplicationHttpClient) {}

	// TODO :: Remove this logic to NgRx Store
	private deliveryTypeSubject = new Subject<string>();
	deliveryType$ = this.deliveryTypeSubject.asObservable();

	setDeliveryType(type: string) {
		this.deliveryTypeSubject.next(type);
	}

	public getCustomerDetailsByPhone(customer: Customer): Observable<Customer> {
        const url = `/user/api/v1/customer_profile`;
		const payload = { "phone_num": customer};
        return this.httpClient.post<Customer>(url, payload);
	}

	public selectOrderStepData(step: any): Observable<any> {
		return of(step);
	}
}

