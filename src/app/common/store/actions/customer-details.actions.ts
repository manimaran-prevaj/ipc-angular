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
