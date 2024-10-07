import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ProductSearchService } from '../../services/store-products.service';
import * as StoreActions from '../actions/product-search.actions';
import { Item } from '../../../new-customer/models/product-search';

@Injectable()
export class ProductSearchEffects {

  loadStoreData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StoreActions.loadStoreData),
      mergeMap(action => {
        return this.productSearchService.getProductsByStoreId(action.storeId).pipe(
          map(item => {
            return StoreActions.loadStoreDataSuccess({ item: item as Item[] });
          }),
          catchError(error => {
            return of(StoreActions.loadStoreDataFailure({ error }));
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private productSearchService: ProductSearchService
  ) { }
}