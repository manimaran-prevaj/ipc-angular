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
  
  on(CategoryActions.loadCategoryList, (state): StoreState => ({
    ...state,
    categories: null,
    categoryError: null,
  })),
  
  on(CategoryActions.loadCategoryListSuccess, (state, { categories }): StoreState => {
    return {
      ...state,
      categories: categories,
      categoryError: null,
    };
  }),
  
  on(CategoryActions.loadCategoryListFailure, (state, { error }): StoreState => ({
    ...state,
    categories: null,
    categoryError: error,
  })),

  // Product-related actions
  on(CategoryActions.loadProductsByCategory, (state): StoreState => ({
    ...state,
    products: null,
    productError: null,
  })),
  
  on(CategoryActions.loadProductsByCategorySuccess, (state, { products }): StoreState => ({
    ...state,
    products: products,
    productError: null,
  })),
  
  on(CategoryActions.loadProductsByCategoryFailure, (state, { error }): StoreState => ({
    ...state,
    products: null,
    productError: error,
  }))
);