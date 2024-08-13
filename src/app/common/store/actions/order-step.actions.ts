import { createAction, props } from "@ngrx/store";

export const loadOrderStep = createAction(
    '[Order Stpep] Load Order Step',
    props<{ step: any }>()
  );
  export const loadOrderStepSuccess = createAction(
    '[Order Stpep] Load Order Step Success',
    props<{ step: any }>()
  );
  export const loadOrderStepfailure = createAction(
    '[Order Stpep] Load Order Step failure',
    props<{ error: any }>()
  );