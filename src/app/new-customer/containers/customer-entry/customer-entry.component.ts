import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { selectCustomerProfile, selectStepData } from "../../../common/store";
import { ApiResponse } from "../../models/customer-details";
import { CustomerDetailsComponent } from "../../components/customer-details/customer-details.component";
import { loadOrderStep } from "../../../common/store/actions/order-step.actions";
import { loadStoreData } from "../../../common/store/actions/product-search.actions";
import { loadCategoryList } from "../../../common/store/actions/category.actions";

@Component({
	selector: 'app-customer-entry',
	templateUrl: './customer-entry.component.html',
	styleUrls: ['./customer-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomerEntryComponent implements OnInit {
	public customerResponse: ApiResponse;
	public date =new Date().toLocaleDateString();
	public phone = null;
	public isContinueOrder = false;
	public isExpanded = true;
	public storeId : any;
	// @viewChild(CustomerDetailsComponent) 
	// public customerDetailsComponent: CustomerDetailsComponent;
	@ViewChild('CustomerDetailsComponent') customerDetailsComponent: CustomerDetailsComponent;

	constructor(
		private store: Store,
		public changeDetection: ChangeDetectorRef
	) { }

ngOnInit(): void {
	this.store.pipe(select(selectCustomerProfile)).subscribe(x=>{
		const data: any = x;
		this.customerResponse = data?.customerDetails?.customerProfile as ApiResponse;
		this.phone = this.customerDetailsComponent?.customerDetailsForm?.get("phone")?.value;
		this.storeId = data?.customerDetails?.customerProfile?.default_delivery_store_data?.store_id // Assuming store_id is the property name
	});
	this.store.pipe(select(selectStepData)).subscribe(x=>{
		// const data: any = x;
		if(x?.OrderStepData?.step){
			if(x?.OrderStepData?.step?.stepName =="customer entry"){
				this.isExpanded = true;
				this.changeDetection.detectChanges();
				this.isExpanded = false;
			}
			
		}
	});
}

public continueOrder(){
	this.isContinueOrder = true;
	this.isExpanded = false;
	this.store.dispatch(loadOrderStep({ step:{stepName: 'customer entry'} }));
	this.store.dispatch(loadStoreData({ storeId: this.storeId }));
	this.store.dispatch(loadCategoryList({ storeId: this.storeId}));
}

}
