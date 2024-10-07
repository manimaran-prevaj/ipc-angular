import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { loadCustomerDetails } from '../actions/customer-details.actions';
import * as customerActions from '../actions/customer-details.actions';
import { CustomerEntryService } from '../../../new-customer/services/customer-entry.service';
import { FutureOrdersService } from '../../services/future-order.service';
import { ApiResponse } from '../../../../app/new-customer/models/customer-details';

@Injectable()
export class CustomerDetailsEffects {
  loadCustomerDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCustomerDetails),
      mergeMap(action => {
        return this.customerEntryService.getCustomerDetailsByPhone(action.phone).pipe(
          map(customerProfileData => {
            return customerActions.loadCustomerDetailsSuccess({ customerProfile: customerProfileData as unknown as ApiResponse });
          }),
          catchError(error => {
            return of(customerActions.loadCustomerDetailsFailure({ error }));
          })
        );
      })
    );
  });

  loadFutureOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(customerActions.loadFutureOrders),
      mergeMap(action => {
        return this.futureOrdersService.loadFutureOrders(action.payload).pipe(
          map(futureOrderTime => {
            return customerActions.loadFutureOrdersSuccess({ response: futureOrderTime });
          }),
          catchError(error => {
            return of(customerActions.loadFutureOrdersFailure({ error }));
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private customerEntryService: CustomerEntryService,
    private futureOrdersService: FutureOrdersService
  ) {}
}
