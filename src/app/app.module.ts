import { APP_ID, ErrorHandler, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
	ApplicationCookieClient,
	AppGlobalErrorHandler,
	AppHttpCaptcha,
	AppHttpErrors,
	AppLocalStorageClient,
	ApplicationSessionsStorage
} from '../utils';

import { MaterialModule } from './material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderModule } from './header/header.module';
import { SideNavModule } from './sidenav/sidenav.module';
import { appConfigReducer } from './common/store/reducers/app-config.reducers';
import { AppConfigService } from './common/services/app-config.service';
import { EffectsModule } from '@ngrx/effects';
import { AppConfigEffects } from './common/store/effects/app-config.effects';
import { customerDetailsReducer } from './common/store/reducers/customer-details.reducers';
import { CustomerDetailsEffects } from './common/store/effects/customer-details.effects';
import{ CategoryEffects } from './common/store/effects/category.effects';
import { OrderStepEffects } from './common/store/effects/order-step.effects';
import { OrderStepReducer } from './common/store/reducers/order-step.reducers';
import { productSearchReducer } from './common/store/reducers/product-search.reducers';
 import { categoryReducer } from './common/store/reducers/category.reducers';
import { ProductSearchEffects } from './common/store/effects/product-search.effects';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service,RecaptchaSettings,RecaptchaV3Module } from 'ng-recaptcha';
// import { environment } from '../environments/environment';
import { ApplicationHttpClient } from '../utils/app-http-client';
import { ProductCategoryComponent } from './new-customer/containers/product-category/product-category.component';

@NgModule({
	declarations: [
		AppComponent,
  ProductCategoryComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		MatDialogModule,
		StoreModule.forRoot({}),
		StoreModule.forFeature('appConfig', appConfigReducer),
        StoreModule.forFeature('customerDetails', customerDetailsReducer),
		StoreModule.forFeature('OrderStepData',OrderStepReducer),
		StoreModule.forFeature('categoryReducer', categoryReducer),
		StoreModule.forFeature('productSearchData', productSearchReducer),
		EffectsModule.forRoot([]),
		EffectsModule.forRoot([AppConfigEffects, CustomerDetailsEffects, ProductSearchEffects, CategoryEffects, OrderStepEffects]),

		// Imported components of Angular Material
		MaterialModule,
		HeaderModule,
		SideNavModule,
		RecaptchaV3Module
	],
	providers: [
		provideClientHydration(),

		ApplicationHttpClient,
		// Client LocalStorage
		AppLocalStorageClient,

		// Client Cookie
		ApplicationCookieClient,

		// SessionStorage
		ApplicationSessionsStorage,
		AppConfigService,
		ReCaptchaV3Service,
		// ReCaptcha v3 private key
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: '6Ld1MbAUAAAAAPcFJqLdbOHzAptLMzkPIC22RW4L'
        },
        // ReCaptcha v2 private key
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: { siteKey: '6LeG1okiAAAAAJiax2DZclQkDp7WInA3uz5Myh7K' } as RecaptchaSettings,
        },

		// Proxy to catch JS errors
		{
			provide: ErrorHandler,
			useClass: AppGlobalErrorHandler
		},

		// Captcha http interceptor
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AppHttpCaptcha,
			multi: true
		},

		// Global error http interceptor
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AppHttpErrors,
			multi: true
		},
		provideAnimationsAsync()
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(
		@Inject(PLATFORM_ID) private platformId: object,
		@Inject(APP_ID) private appId: string
	) {
		const platform = isPlatformBrowser(platformId) ?
			'in the browser' : 'on the server';
		console.log(`Running ${platform} with appId=${appId}`);
	}
}
