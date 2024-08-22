import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CategorySearchService } from '../../services/category.service';
import { ProductListService } from '../../services/product-list.service';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../../../new-customer/models/category-search';
import { ProductListResponse } from '../../../new-customer/models/product-list';

@Injectable()
export class CategoryEffects {

    loadCategories$ = createEffect(() => this.actions$.pipe(
      ofType(CategoryActions.loadCategoryList),
      mergeMap(action => this.categoryService.getCategoryByStoreId(action.storeId)
        .pipe(
          map(categories =>  CategoryActions.loadCategoryListSuccess({ categories: categories as Category[] })
          ),
          catchError(error => {
            console.error('Error loading categories:', error);
            return of(CategoryActions.loadCategoryListFailure({ error }));
          })
        ))
      )
    );

    loadProductsByCategory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.loadProductsByCategory),
        mergeMap(({ storeId, categoryId, deliveryMode }) =>
          this.productListService.getProductList(storeId, categoryId, deliveryMode).pipe(
            map(products => CategoryActions.loadProductsByCategorySuccess({ products: products as ProductListResponse[] })),
            catchError(error => of(CategoryActions.loadProductsByCategoryFailure({ error })))
          )
        )
      )
    );

  constructor(
    private actions$: Actions,
    private categoryService: CategorySearchService,
    private productListService: ProductListService,
  ) {}
}