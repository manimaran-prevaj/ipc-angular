import { createReducer, on } from '@ngrx/store';
import * as StoreActions from '../actions/product-search.actions';
import { Item } from '../../../new-customer/models/product-search';

export interface ProductState {
  item: Item | null;
  error: any;
}

export const initialState: ProductState = {
  item: null,
  error: null,
};

export const productSearchReducer = createReducer(
  initialState,
  on(StoreActions.loadStoreData, state => ({
    ...state,
    item: null,
    error: null,
  })),
  on(StoreActions.loadStoreDataSuccess, (state, { item }) => ({
    ...state,
    item,
    error: null,
  })),
  on(StoreActions.loadStoreDataFailure, (state, { error }) => ({
    ...state,
    item: null,
    error,
  }))
);