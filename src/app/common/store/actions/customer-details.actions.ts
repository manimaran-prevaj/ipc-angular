import { createAction, props } from "@ngrx/store";
import { Customer, ApiResponse } from "../../../new-customer/models/customer-details";
import { OrderDateTime } from "../../../new-customer/models/customer-entry.model";

export const loadCustomerDetails = createAction(
  '[Customer Details] Load Customer Details',
  props<{ phone: Customer }>()
);

export const loadCustomerDetailsSuccess = createAction(
  '[Customer Details] Load Customer Details Success',
  props<{ customerProfile: ApiResponse }>()
);

export const loadCustomerDetailsFailure = createAction(
  '[Customer Details] Load Customer Details Failure',
  props<{ error: any }>()
);

// Define the action to initiate the future order times
export const loadFutureOrders = createAction(
  '[Customer] Load Future Orders',
  props<{ payload: { type: string; cart_has_alcohol: boolean; store_id: number } }>()
);

export const loadFutureOrdersSuccess = createAction(
  '[Customer] Load Future Orders Success',
  props<{ response: OrderDateTime[] }>()
);

export const loadFutureOrdersFailure = createAction(
  '[Customer] Load Future Orders Failure',
  props<{ error: any }>()
);

export function loadOrderStepSuccess(arg0: { step: any; }): any {
  return {
    type: 'LOAD_ORDER_STEP_SUCCESS',
    payload: arg0.step
};
}

export function loadOrderStepfailure(arg0: { error: any; }): any {
  return {
    type: 'LOAD_ORDER_STEP_FAILURE',
    payload: arg0.error
};
}
