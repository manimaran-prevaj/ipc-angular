import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../../../new-customer/models/category-search';

export interface StoreState {
  categories: Category[] | null;
  error: any;
}

export const initialState: StoreState = {
  categories: null,
  error: null
};

export const categoryReducer = createReducer(
    initialState,
    on(CategoryActions.loadCategoryList, state => ({
      ...state,
      categories: null,
      error: null,
    })),
    on(CategoryActions.loadCategoryListSuccess, (state, { categories }) => ({
      ...state,
      categories,
      error: null,
    })),
    on(CategoryActions.loadCategoryListFailure, (state, { error }) => ({
      ...state,
      categories: null,
      error,
    }))
  );
  
