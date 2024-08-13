import { createReducer, on } from "@ngrx/store";
import * as OrderStepActions from '../actions/order-step.actions';


export interface OrderState{
    orderStep: any | null;
    error: any
  }
  export const initialOrderstate: OrderState = {
    orderStep: null,
    error: null
  }
  export interface Orderstep{
    step: any;
  }

  export const OrderStepReducer = createReducer(
    initialOrderstate,
    on(OrderStepActions.loadOrderStepSuccess, (state, { step }) => ({
      ...state,
      step,
      error: null
    })),
    on(OrderStepActions.loadOrderStepfailure, (state, { error }) => ({
      ...state,
      step: null,
      error
    }))
  );