import { createReducer, on } from '@ngrx/store';
import * as StoreActions from '../actions/product-search.actions';
import { Item } from '../../../new-customer/models/product-search';

export interface StoreState {
  storeData: Item | null;
  error: any;
}

export const initialState: StoreState = {
  storeData: null,
  error: null,
};

export const storeReducer = createReducer(
  initialState,
  on(StoreActions.loadStoreData, state => ({
    ...state,
    storeData: null,
    error: null,
  })),
  on(StoreActions.loadStoreDataSuccess, (state, { storeData }) => ({
    ...state,
    storeData,
    error: null,
  })),
  on(StoreActions.loadStoreDataFailure, (state, { error }) => ({
    ...state,
    storeData: null,
    error,
  }))
);