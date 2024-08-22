import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductListResponse } from '../../new-customer/models/product-list'
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable({
	providedIn: 'root'
})

export class ProductListService {

	constructor(private httpClient: ApplicationHttpClient) {}

	/**
	 * get Product list
	 */
	getProductList(storeId, productId, isDelivery): Observable<ProductListResponse[]> {
		const deliveryOption = isDelivery ? 'delivery' : 'pickup';
		const methodPath = `catalog/api/v1/product_list/${storeId}/${deliveryOption}`;
		const params = {
			category_id: productId
		}
		return this.httpClient.get<ProductListResponse[]>(methodPath, params);
	}
}


