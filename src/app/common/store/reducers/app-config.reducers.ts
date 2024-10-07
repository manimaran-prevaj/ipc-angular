import { createReducer, on } from "@ngrx/store";
import { AppConfig } from "../../models/app-config";
import { loadAppConfig, loadAppConfigSuccess } from "../actions/app-config.actions";

// Initial state with bannerMessage and dwellingType
export const initialState: AppConfig = { bannerMessage: '', dwellingType: [] };

export const appConfigReducer = createReducer(
  initialState,

  // Handle the loadAppConfig action, returning the existing state
  on(loadAppConfig, (state): AppConfig => ({ ...state })),

  // Handle the loadAppConfigSuccess action, updating the state with new config
  on(loadAppConfigSuccess, (state, action): AppConfig => {
    return {
      ...state, 
      bannerMessage: action.appConfig.bannerMessage, // Update the bannerMessage
      dwellingType: action.appConfig.dwellingType // Update dwellingType
    };
  })
);