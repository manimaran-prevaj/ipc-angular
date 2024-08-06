import { createAction, props } from '@ngrx/store';
import { Item } from '../../../new-customer/models/product-search';

export const loadStoreData = createAction(
  '[Product Search] Load Store Data',
  props<{ storeId: number }>()
);

export const loadStoreDataSuccess = createAction(
  '[Product Search] Load Store Data Success',
  props<{ storeData: Item }>()
);

export const loadStoreDataFailure = createAction(
  '[Product Search] Load Store Data Failure',
  props<{ error: any }>()
);
