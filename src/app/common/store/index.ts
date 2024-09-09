import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppConfig } from '../models/app-config';
import { ApiResponse } from '../../new-customer/models/customer-details'
import { Category } from '../../new-customer/models/category-search';
import * as fromStoreSearch from './reducers/product-search.reducers';
import { Item } from '../../new-customer/models/product-search';
import * as fromCategorySearch from './reducers/category.reducers';
import { ProductListResponse } from '../../new-customer/models/product-list';
import { OrderDateTime } from '../../new-customer/models/customer-entry.model';
import { State } from './reducers/customer-details.reducers';

export const selectAppConfig = (state: AppConfig) => state;
export const selectCustomerProfile = (state: ApiResponse) => state;
export const selectStepData = (state: any) => state;
export const selectProductData = (state: Item) => state;
export const selectFutureTimes = (state: OrderDateTime[]) => state;

export interface CommonState {
	productSearch: fromStoreSearch.ProductState
  categorySearch: fromCategorySearch.StoreState
}

// Select the categorySearch state
 export const selectCategorySearchState = (state: CommonState) => state.categorySearch;
export const selectCatogory = (state: Category[])=>state;
export const productList = (state: ProductListResponse[])=> state;
export const futureOrderTime = (state: OrderDateTime[]) => state;
export const searchProducts = (state: Item) => state;

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
  searchProducts,
  (item:Item) => item
  )

export const getCategorydata = createSelector(
  selectCatogory,
  (categories:Category[])=>categories
)

export const getProductList = createSelector(
  productList,
  (productList:ProductListResponse[])=>productList
)

export const getFutureTimes = createSelector(
  selectFutureTimes,
  (futureOrderTime:OrderDateTime[])=>futureOrderTime
)

//NOTE load specific state - mean create selector for specific state information to avoid multiple hits to subscription
export const selectCustomerDetails = createFeatureSelector<State>('customerDetails');
export const selectOrderDateTime = createSelector(
	selectCustomerDetails,
	(state: State) => state.response
)