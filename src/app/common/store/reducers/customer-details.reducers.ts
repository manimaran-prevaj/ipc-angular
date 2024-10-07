import { createReducer, on } from "@ngrx/store";
import * as CustomerDetailsActions from '../actions/customer-details.actions';
import { ApiResponse } from "../../../new-customer/models/customer-details";
import { OrderDateTime } from "../../../new-customer/models/customer-entry.model";

export interface State {
  customerProfile: ApiResponse | null;
  response: OrderDateTime[] | null;
  futureTimesError: any;
  customerDataerror: any;
}

export const initialState: State = {
  customerProfile: null,
  response: null,
  futureTimesError: null,
  customerDataerror: null
};

export const customerDetailsReducer = createReducer(
  initialState,

  // Handle successful customer details loading
  on(CustomerDetailsActions.loadCustomerDetailsSuccess, (state, { customerProfile }): State => ({
    ...state,
    customerProfile,
    customerDataerror: null
  })),

  // Handle failed customer details loading
  on(CustomerDetailsActions.loadCustomerDetailsFailure, (state, { error }): State => ({
    ...state,
    customerProfile: {} as ApiResponse,
    customerDataerror: error
  })),

  // Handle future orders loading
  on(CustomerDetailsActions.loadFutureOrders, (state): State => ({
    ...state,
    response: null,
    futureTimesError: null,
  })),

  // Handle successful future orders loading
  on(CustomerDetailsActions.loadFutureOrdersSuccess, (state, { response }): State => ({
    ...state,
    response,
    futureTimesError: null,
  })),

  // Handle failed future orders loading
  on(CustomerDetailsActions.loadFutureOrdersFailure, (state, { error }): State => ({
    ...state,
    response: null,
    futureTimesError: error,
  }))
);