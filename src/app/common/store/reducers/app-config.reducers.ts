import { createReducer, on } from "@ngrx/store";
import { AppConfig } from "../../models/app-config";
import { loadAppConfig,loadAppConfigSuccess } from "../actions/app-config.actions";


export const initialState: AppConfig = {bannerMessage:'',dwellingType:[]};

export interface AppConfigState {
    appConfigState: AppConfig
}


export const appConfigReducer = createReducer(
    initialState
    ,on(loadAppConfig, state=>({...state}))
    ,on(loadAppConfigSuccess, (state, action): AppConfig=>{
        state = action.appConfig
        return {
            ...action.appConfig
    };
})
)