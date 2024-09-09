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
export interface customerProfileData {
  customerProfileData: ApiResponse
}


export const customerDetailsReducer = createReducer(
  initialState,
  on(CustomerDetailsActions.loadCustomerDetailsSuccess, (state, { customerProfile }) => ({
    ...state,
    customerProfile,
    errcustomerDataerroror: null
  })),
  on(CustomerDetailsActions.loadCustomerDetailsFailure, (state, { error }) => ({
    ...state,
    customerProfile: null,
    error
  })),
  // future time-related actions
  on(CustomerDetailsActions.loadFutureOrders, state => ({
    ...state,
    response: null,
    futureTimesError: null,
  })),
  on(CustomerDetailsActions.loadFutureOrdersSuccess, (state, { response }) => ({
    ...state,
    response,
    futureTimesError: null,
  })),
  on(CustomerDetailsActions.loadFutureOrdersFailure, (state, { error }) => ({
    ...state,
    response: null,
    futureTimesError: error,
  }))
);





