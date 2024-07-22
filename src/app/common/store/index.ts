import { createSelector } from '@ngrx/store';
import { AppConfig } from '../models/app-config';

export const selectAppConfig = (state: AppConfig) => state;

export const selectFeatureCount = createSelector(
  selectAppConfig,
  (state: AppConfig) => state
);