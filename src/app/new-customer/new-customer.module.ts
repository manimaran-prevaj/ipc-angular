import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CommonComponentsModule } from '../common/common.module';
import { RouterModule } from '@angular/router';
import { routes } from './new-customer.routes';
import { MatRadioModule} from '@angular/material/radio'


import { NewCustomerComponent } from './containers/new-customer/new-customer.component';
import { CustomerEntryComponent } from './containers/customer-entry/customer-entry.component';
import { OrderEntryComponent } from './containers/order-entry/order-entry.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressDetailsComponent } from './components/address-details/address-details.component';
import { DwellingTypeDetailsComponent } from './components/dwelling-type-details/dwelling-type-details.component';
import { ManualAddressDetailsComponent } from './components/manual-address-details/manual-address-details.component';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';

export const COMPONENTS = [
	NewCustomerComponent,
	CustomerDetailsComponent,
	CustomerEntryComponent,
	AddressDetailsComponent,
	DwellingTypeDetailsComponent,
	ManualAddressDetailsComponent,
	OrderEntryComponent
];

@NgModule({
	declarations: COMPONENTS,
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		CommonComponentsModule,
		MatRadioModule,
		MatDialogContent,
		MatDialogModule,
		MatDialogTitle
	],
	exports: COMPONENTS,
	providers:[{provide:MAT_DIALOG_DATA, useValue:{}}]
})

export class NewCustomerModule { }
