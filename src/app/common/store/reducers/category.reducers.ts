import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../../../new-customer/models/category-search';
import { ProductListResponse } from '../../../new-customer/models/product-list';

export interface StoreState {
  categories: Category[] | null;
  products: ProductListResponse[] | null;
  categoryError: any;
  productError: any;
}

export const initialState: StoreState = {
  categories: null,
  products: null,
  categoryError: null,
  productError: null
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
      categories: categories,
      error: null,
    })),
    on(CategoryActions.loadCategoryListFailure, (state, { error }) => ({
      ...state,
      categories: null,
      error,
    })),

      // Product-related actions
    on(CategoryActions.loadProductsByCategory, state => ({
      ...state,
      products: null,
      productError: null,
    })),
    on(CategoryActions.loadProductsByCategorySuccess, (state, { products }) => ({
      ...state,
      products: products,
      productError: null,
    })),
    on(CategoryActions.loadProductsByCategoryFailure, (state, { error }) => ({
      ...state,
      products: null,
      productError: error,
    }))
  );
  
