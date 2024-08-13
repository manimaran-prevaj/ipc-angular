import { createSelector } from '@ngrx/store';
import { AppConfig } from '../models/app-config';
import { ApiResponse } from '../../new-customer/models/customer-details'
import { Category } from '../../new-customer/models/category-search';
import * as fromStoreSearch from './reducers/product-search.reducers';
import * as fromCategorySearch from './reducers/category.reducers';

export const selectAppConfig = (state: AppConfig) => state;
export const selectCustomerProfile = (state: ApiResponse) => state;
export const selectStepData = (state: any) => state;

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

export const getDefaultDeliveryStoreDetails = createSelector (
  selectCustomerProfile,
  (state: ApiResponse) => state.default_delivery_store_data
);

export const getDefaultPickupStoreDetails = createSelector (
  selectCustomerProfile,
  (state: ApiResponse) => state.default_pickup_store_data
);

export const getOrderStepData = createSelector(
selectStepData,
(state: any) => state
)


// Select the full list of categories
// export const selectCategories = createSelector(
//   selectCategorySearchState,
//   (state: fromCategorySearch.StoreState) => {
//     console.log('Categories state:', state.categories); // Log the full categories state
//     return state.categories; 
//   }
// );

// Select only the category names
// export const selectCategoryNames = createSelector(
//   selectCategories,
//   (categories: Category[]) => categories.map(category => category.name)
// );
export const getCategorydata = createSelector(
  selectCatogory,
  (state:Category[])=>state
)

