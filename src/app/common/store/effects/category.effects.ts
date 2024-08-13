import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CategorySearchService } from '../../services/category.service';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../../../new-customer/models/category-search';

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


  constructor(
    private actions$: Actions,
    private categoryService: CategorySearchService
  ) {}
}