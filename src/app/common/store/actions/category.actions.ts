import { createAction, props } from '@ngrx/store';
import { Category } from '../../../new-customer/models/category-search';
import { ProductListResponse } from '../../../new-customer/models/product-list'

export const loadCategoryList = createAction(
  '[Category] Load Category List',
  props<{ storeId: number }>()
);

export const loadCategoryListSuccess = createAction(
  '[Category] Load Category List Success',
  props<{ categories: Category[] }>()
);

export const loadCategoryListFailure = createAction(
  '[Category] Load Category List Failure',
  props<{ error: any }>()
);

export const loadProductsByCategory = createAction(
  '[Category] Load Products By Category',
  props<{storeId: number, categoryId: string, deliveryMode: string }>()
);

export const loadProductsByCategorySuccess = createAction(
  '[Category] Load Products By Category Success',
  props<{ products: ProductListResponse[] }>()
);

export const loadProductsByCategoryFailure = createAction(
  '[Category] Load Products By Category Failure',
  props<{ error: any }>()
);

