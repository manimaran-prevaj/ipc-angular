import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CommonComponentsModule } from '../common/common.module';
import { RouterModule } from '@angular/router';
import { routes } from './new-customer.routes';


import { NewCustomerComponent } from './containers/new-customer/new-customer.component';
import { CustomerEntryComponent } from './containers/customer-entry/customer-entry.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const COMPONENTS = [
	NewCustomerComponent,
	CustomerDetailsComponent,
	CustomerEntryComponent
];

@NgModule({
	declarations: COMPONENTS,
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		CommonComponentsModule
	],
	exports: COMPONENTS
})

export class NewCustomerModule { }
