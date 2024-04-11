import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CCCAccordionComponent } from './ccc-accordion/ccc-accordion.component';

export const COMPONENTS = [
	CCCAccordionComponent
];
@NgModule({
	declarations: COMPONENTS,
	imports: [
		CommonModule,
		MaterialModule
	],
	exports: COMPONENTS
})

export class CommonComponentsModule { }
