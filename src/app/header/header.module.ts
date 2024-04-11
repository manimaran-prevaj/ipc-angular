import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { LogoDateComponent } from './components/logo-date/logo-date.component';
import { BannerComponent } from './components/banner/banner.component';
import { HeaderComponent } from './containers/header/header.component';

export const COMPONENTS = [
	LogoDateComponent,
	BannerComponent,
	HeaderComponent
];

@NgModule({
	declarations: COMPONENTS,
	imports: [
		CommonModule,
		MaterialModule
	],
	exports: COMPONENTS
})

export class HeaderModule { }
