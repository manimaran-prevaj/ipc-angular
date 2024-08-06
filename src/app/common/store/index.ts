import { createSelector } from '@ngrx/store';
import { AppConfig } from '../models/app-config';
import { ApiResponse } from '../../new-customer/models/customer-details'
import * as fromStoreSearch from './reducers/product-search';

export const selectAppConfig = (state: AppConfig) => state;
export const selectCustomerProfile = (state: ApiResponse) => state;

export interface CommonState {
	productSearch: fromStoreSearch.StoreState
}

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



