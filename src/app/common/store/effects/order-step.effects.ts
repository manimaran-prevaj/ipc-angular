import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CustomerEntryService } from '../../../new-customer/services/customer-entry.service';
import { loadOrderStep } from '../actions/order-step.actions';
import * as orderStepActions from '../actions/order-step.actions';
import { AppConfigService } from '../../services/app-config.service';

@Injectable()
export class OrderStepEffects {
  
  loadOrderstep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadOrderStep),
      mergeMap(action => {
        return this.customerEntryService.selectOrderStepData(action.step).pipe(
          map(stepData => {
            return orderStepActions.loadOrderStepSuccess({ step: stepData });
          }),
          catchError(error => {
            return of(orderStepActions.loadOrderStepfailure({ error }));
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private customerEntryService: CustomerEntryService,
    private appConfigService: AppConfigService
  ) {}
}
