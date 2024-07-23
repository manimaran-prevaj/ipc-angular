import { Injectable } from '@angular/core'
import { AppConfigService } from '../../services/app-config.service';
import { Actions, createEffect, ofType } from '@ngrx/effects'
import * as appConfigActions from '../actions/app-config.actions';
import { map, mergeMap } from 'rxjs';
import { AppConfig } from '../../models/app-config';

@Injectable()
export class AppConfigEffects {

    constructor(public action: Actions, public appConfigService: AppConfigService) { }

    loadAppConfig = createEffect(() => {
        return this.action
            .pipe(
                ofType(appConfigActions.loadAppConfig),
                mergeMap(() => this.appConfigService.getAppConfig()
                    .pipe(
                        map(appConfigData =>
                            appConfigActions.loadAppConfigSuccess({ appConfig: appConfigData as AppConfig })
                        )
                    )
                )
            );
    })
}