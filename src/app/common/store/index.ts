import { createSelector } from '@ngrx/store';
import { AppConfig } from '../models/app-config';
import { ApiResponse } from '../../new-customer/models/customer-details'
import { Category } from '../../new-customer/models/category-search';
import * as fromStoreSearch from './reducers/product-search.reducers';
import { Item } from '../../new-customer/models/product-search';
import * as fromCategorySearch from './reducers/category.reducers';

export const selectAppConfig = (state: AppConfig) => state;
export const selectCustomerProfile = (state: ApiResponse) => state;
export const selectStepData = (state: any) => state;
export const selectProductData = (state: Item) => state;

export interface CommonState {
	productSearch: fromStoreSearch.ProductState
  categorySearch: fromCategorySearch.StoreState
}

// Select the categorySearch state
 export const selectCategorySearchState = (state: CommonState) => state.categorySearch;
export const selectCatogory = (state: Category[])=>state;

export const selectFeatureCount = createSelector(
  selectAppConfig,
  (state: AppConfig) => state
);


export const getcustomerProfile = createSelector (
  selectCustomerProfile,
  (state: ApiResponse) => state.customer_data
);


export const getOrderStepData = createSelector(
selectStepData,
(state: any) => state
)

export const getProductData = createSelector(
  selectProductData,
  (state: any) => state
  )

export const getCategorydata = createSelector(
  selectCatogory,
  (categories:Category[])=>categories
)

