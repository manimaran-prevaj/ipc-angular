import { createAction, props } from '@ngrx/store';
import { StoreID, Item } from '../../../new-customer/models/product-search';

export const loadStoreData = createAction(
  '[Customer Details] Load Store Data',
  props<{ storeId: number }>()
);

export const loadStoreDataSuccess = createAction(
  '[Customer Details] Load Store Data Success',
  props<{ storeData: Item }>()
);

export const loadStoreDataFailure = createAction(
  '[Customer Details] Load Store Data Failure',
  props<{ error: any }>()
);