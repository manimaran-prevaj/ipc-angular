import { createAction, props } from "@ngrx/store";
import { Customer, ApiResponse } from "../../../new-customer/models/customer-details";

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
