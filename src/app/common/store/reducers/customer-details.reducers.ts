import { createReducer, on } from "@ngrx/store";
import * as CustomerDetailsActions from '../actions/customer-details.actions';
import { ApiResponse } from "../../../new-customer/models/customer-details";

export interface State {
  customerProfile: ApiResponse | null;
  error: any;
}

export const initialState: State = {
  customerProfile: null,
  error: null
};
export interface customerProfileData {
  customerProfileData: ApiResponse
}


export const customerDetailsReducer = createReducer(
  initialState,
  on(CustomerDetailsActions.loadCustomerDetailsSuccess, (state, { customerProfile }) => ({
    ...state,
    customerProfile,
    error: null
  })),
  on(CustomerDetailsActions.loadCustomerDetailsFailure, (state, { error }) => ({
    ...state,
    customerProfile: null,
    error
  }))
);





