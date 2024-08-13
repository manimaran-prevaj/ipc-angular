import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../new-customer/models/category-search'
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable({
	providedIn: 'root'
})

export class CategorySearchService {

    private baseUrl = '/catalog/api/v1/category_list';

	constructor(private httpClient: ApplicationHttpClient) {}

	/**
	 * Get categories by id
	 */
	public getCategoryByStoreId(storeId: number): Observable<Category[]> {
        const methodPath =  `catalog/api/v1/category_list/${storeId}`;
        //const body = { store_id: storeId };
        return this.httpClient.get<Category[]>(methodPath);
}
}


