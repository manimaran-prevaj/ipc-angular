import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import { ApplicationHttpClient } from '../../../utils/app-http-client'
import { AppConfig } from '../models/app-config'

@Injectable()
export class AppConfigService{

    constructor(public httpClient: ApplicationHttpClient){}

    public getAppConfig(): Observable<AppConfig>{
       return this.httpClient.get<AppConfig>('application/api/v1/config');
    }
}