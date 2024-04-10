import { APP_ID, ErrorHandler, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
	AppCookieClient,
	AppGlobalErrorHandler,
	AppHttpCaptcha,
	AppHttpErrors,
	AppLocalStorageClient,
	AppSessionsStorage
} from '../utils';

import { MaterialModule } from './material/material.module';
import { LogoDateComponent } from './header/components/logo-date/logo-date.component';
import { BannerComponent } from './header/components/banner/banner.component';
import { HeaderComponent } from './header/containers/header/header.component';
import { SideNavComponent } from './sidenav/containers/sidenav/sidenav.component';
import { SideNavItemComponent } from './sidenav/components/sidenav-item/sidenav-item.component';


@NgModule({
	declarations: [
		AppComponent,
		LogoDateComponent,
		BannerComponent,
		HeaderComponent,
		SideNavComponent,
		SideNavItemComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		StoreModule.forRoot(),

		// Imported components of Angular Material
		MaterialModule
	],
	providers: [
		provideClientHydration(),

		// Client LocalStorage
		AppLocalStorageClient,

		// Client Cookie
		AppCookieClient,

		// SessionStorage
		AppSessionsStorage,

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
