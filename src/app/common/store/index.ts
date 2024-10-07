import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppConfig } from '../models/app-config';
import * as fromStoreSearch from './reducers/product-search.reducers';
import * as fromCategorySearch from './reducers/category.reducers';
import { State } from './reducers/customer-details.reducers';
import { StoreState } from './reducers/category.reducers';
import { ProductState } from './reducers/product-search.reducers';

export const selectAppConfig = (state: AppConfig) => state;

export const selectStepData = (state: any) => state;

export interface CommonState {
	productSearch: fromStoreSearch.ProductState
  categorySearch: fromCategorySearch.StoreState
}
export const selectAppConfigState = createFeatureSelector<AppConfig>('appConfig');
// CustomerProfile state
export const selectCustomerDetails = createFeatureSelector<State>('customerDetails');
export const selectCategories = createFeatureSelector<StoreState>('categoryDetails');
export const selectMenuItems = createFeatureSelector<ProductState>('productSearchData');

export const selectBannerMessage = createSelector(
  selectAppConfigState,
  (state: AppConfig) => state.bannerMessage
);

export const selectOrderStepData = createSelector(
selectStepData,
(state: any) => state
)

export const selectProductData = createSelector(
  selectMenuItems,
  (state: ProductState)=> {
    return state.item;
  }
  );

  export const selectCategorydata = createSelector(
    selectCategories,
    (state: StoreState) => {
      return state.categories;
    }
  );

export const selectProductsByCategory = createSelector(
  selectCategories,
  (state: StoreState) => {
    return state.products;
  }
)

//NOTE load specific state - mean create selector for specific state information to avoid multiple hits to subscription 
export const selectOrderDateTime = createSelector(
	selectCustomerDetails,
	(state: State) => state.response
)

export const selectCustomerProfile = createSelector(
	selectCustomerDetails,
	(state: State) => state.customerProfile
)