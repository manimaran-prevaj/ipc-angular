import { createAction, props } from '@ngrx/store';
import { Category } from '../../../new-customer/models/category-search';

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

// export function loadOrderStep(loadOrderStep: any): import("rxjs").OperatorFunction<import("@ngrx/store").Action, any> {
//     throw new Error('Function not implemented.');
// }
