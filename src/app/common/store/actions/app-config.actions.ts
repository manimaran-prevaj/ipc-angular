import { createAction, props } from "@ngrx/store";
import { AppConfig } from "../../models/app-config";

export const loadAppConfig = createAction(
    '[app init] loadAppConfig'
);

export const loadAppConfigSuccess = createAction(
    '[app init] loadAppConfigSuccess',
    props<{appConfig: AppConfig}>()
    );