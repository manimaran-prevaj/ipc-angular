import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CCCAccordionComponent } from './ccc-accordion/ccc-accordion.component';
import { CCCPhoneMaskDirective } from './directives/phone-mask.directive';
import { CCCModalComponent } from './ccc-modal/ccc-modal.component';

export const COMPONENTS = [
	CCCAccordionComponent,
	CCCPhoneMaskDirective,
	CCCModalComponent
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
