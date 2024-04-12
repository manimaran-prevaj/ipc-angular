import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CommonComponentsModule } from '../common/common.module';
import { RouterModule } from '@angular/router';
import { routes } from './new-customer.routes';


import { NewCustomerComponent } from './containers/new-customer/new-customer.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';

export const COMPONENTS = [
	NewCustomerComponent,
	CustomerDetailsComponent
];

@NgModule({
	declarations: COMPONENTS,
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		MaterialModule,
		CommonComponentsModule
	],
	exports: COMPONENTS
})

export class NewCustomerModule { }
