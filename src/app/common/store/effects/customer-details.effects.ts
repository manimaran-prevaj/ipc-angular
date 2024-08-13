import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { loadCustomerDetails } from '../actions/customer-details.actions';
import * as customerActions from '../actions/customer-details.actions';
import { CustomerEntryService } from '../../../new-customer/services/customer-entry.service';
import { ApiResponse } from '../../../../app/new-customer/models/customer-details';

@Injectable()
export class CustomerDetailsEffects {
  loadCustomerDetails$ = createEffect(() => this.actions$.pipe(
    ofType(loadCustomerDetails),
    mergeMap(action => this.customerEntryService.getCustomerDetailsByPhone(action.phone).pipe(
      map(customerProfileData => customerActions.loadCustomerDetailsSuccess({customerProfile: customerProfileData as unknown as ApiResponse })),
      catchError(error => of(customerActions.loadCustomerDetailsFailure({ error })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private customerEntryService: CustomerEntryService
  ) {}
}
