import { createReducer, on } from "@ngrx/store";
import * as OrderStepActions from '../actions/order-step.actions';

// Define the interface for the OrderState, including both 'orderStep' and 'step'
export interface OrderState {
  orderStep: any | null;
  step: any | null;  // Adding 'step' as a valid property
  error: any;
}

// Initial state for the OrderState interface
export const initialOrderstate: OrderState = {
  orderStep: null,
  step: null,  // Initialize 'step' to null in the initial state
  error: null
};

// Create the reducer for handling order steps
export const OrderStepReducer = createReducer(
  initialOrderstate,

  // On success, update the 'orderStep' and 'step' properties
  on(OrderStepActions.loadOrderStepSuccess, (state, { step }): OrderState => ({
    ...state,
    orderStep: step,  // Update 'orderStep' with the 'step' value
    step,             // Also store the 'step' in its own property
    error: null
  })),

  // On failure, reset 'orderStep' and 'step', and set the error message
  on(OrderStepActions.loadOrderStepfailure, (state, { error }): OrderState => ({
    ...state,
    orderStep: null,  // Reset 'orderStep' to null on failure
    step: null,       // Reset 'step' to null on failure
    error             // Store the error message
  }))
);