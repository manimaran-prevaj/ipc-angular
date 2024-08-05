import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreID } from '../../new-customer/models/product-search'
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class ProductSearchService {

	constructor(private httpClient: ApplicationHttpClient) {}


	public getProductsByStoreId(storeId: number): Observable<StoreID> {
        const url = `/catalog/api/v1/product/search`;
		const params = new HttpParams().set('store_id', storeId.toString());
        return this.httpClient.get(url, { params });
	}
}

