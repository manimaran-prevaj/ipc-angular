import { createReducer, on } from "@ngrx/store";
import { AppConfig } from "../../models/app-config";
import { loadAppConfig } from "../actions/app-config.actions";


export const initialState: AppConfig = {bannerMessage:'',dwellingType:[]};

export const appConfigReducer = createReducer(
    initialState
    ,on(loadAppConfig, state=>({...state}))
)