import { Component, OnInit, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { selectCustomerProfile, selectStepData } from "../../../common/store";
import { ApiResponse } from "../../models/customer-details";
import { CustomerDetailsComponent } from "../../components/customer-details/customer-details.component";
import { loadOrderStep } from "../../../common/store/actions/order-step.actions";

@Component({
	selector: 'app-customer-entry',
	templateUrl: './customer-entry.component.html',
	styleUrls: ['./customer-entry.component.scss'],
})

export class CustomerEntryComponent implements OnInit {
	public customerResponse: ApiResponse;
	public date =new Date().toLocaleDateString();
	public phone = null;
	public isContinueOrder = false;
	public isExpanded = true;
	// @viewChild(CustomerDetailsComponent) 
	// public customerDetailsComponent: CustomerDetailsComponent;
	@ViewChild('CustomerDetailsComponent') customerDetailsComponent: CustomerDetailsComponent;

	constructor(
		private store: Store
	) { }

ngOnInit(): void {
	this.store.pipe(select(selectCustomerProfile)).subscribe(x=>{
		const data: any = x;
		this.customerResponse = data?.customerDetails?.customerProfile as ApiResponse;
		this.phone = this.customerDetailsComponent?.customerDetailsForm?.get("phone")?.value;
	});
	this.store.pipe(select(selectStepData)).subscribe(x=>{
		// const data: any = x;
		if(x?.OrderStepData?.step){
			if(x?.OrderStepData?.step?.stepName =="customer entry"){
				this.isExpanded = false;
			}
		}
	});
}

public continueOrder(){
	this.isContinueOrder = true;
	this.store.dispatch(loadOrderStep({ step:{stepName: 'customer entry'} }));
}

}
