import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {OrderDateTime } from '../../new-customer/models/customer-entry.model';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable({
	providedIn: 'root'
})

export class FutureOrdersService {

    private apiUrl = 'store/api/v1/future_orders';

	constructor(private httpClient: ApplicationHttpClient) {}

	/**
	 * get FutureOrderTimes
	 */
    loadFutureOrders(payload: { type: string; cart_has_alcohol: boolean; store_id: number }): Observable<OrderDateTime[]> {
        return this.httpClient.post(this.apiUrl, payload);
      }
}