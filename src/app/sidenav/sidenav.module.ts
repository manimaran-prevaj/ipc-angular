import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SideNavItemComponent } from './components/sidenav-item/sidenav-item.component';
import { SideNavComponent } from './containers/sidenav/sidenav.component';

export const COMPONENTS = [
	SideNavItemComponent,
	SideNavComponent
];

@NgModule({
	declarations: COMPONENTS,
	imports: [
		CommonModule,
		MaterialModule
	],
	exports: COMPONENTS
})

export class SideNavModule { }
