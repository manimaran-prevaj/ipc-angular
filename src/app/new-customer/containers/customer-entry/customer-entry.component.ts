import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCustomerProfile, selectStepData } from "../../../common/store";
import { ApiResponse } from "../../models/customer-details";
import { CustomerDetailsComponent } from "../../components/customer-details/customer-details.component";
import { loadOrderStep } from "../../../common/store/actions/order-step.actions";
import { loadStoreData } from "../../../common/store/actions/product-search.actions";
import { loadCategoryList } from "../../../common/store/actions/category.actions";
import { DeliveryModeService } from "../../../common/services/delivey-mode.service";
import { loadFutureOrders } from "../../../common/store/actions/customer-details.actions";
import { Observable, tap } from "rxjs";

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
	public customerData$: Observable<ApiResponse>;
	// @viewChild(CustomerDetailsComponent) 
	// public customerDetailsComponent: CustomerDetailsComponent;
	@ViewChild('CustomerDetailsComponent') customerDetailsComponent: CustomerDetailsComponent;
	deliveryMode: string;

	constructor(
		private store: Store,
		public changeDetection: ChangeDetectorRef,
		private deliveryModeService: DeliveryModeService,
	) {
		this.customerData$ = this.store.select(selectCustomerProfile);
	}

ngOnInit(): void {

	let hasDispatchedFutureOrders = false;	
	// Subscribe to the delivery mode observable
		// Use async pipe in the template for customerData$
		this.customerData$.pipe(
			tap((customerProfile: ApiResponse) => {
				const data = customerProfile?.default_delivery_store_data;
				this.phone = this.customerDetailsComponent?.customerDetailsForm?.get("phone")?.value;
				this.storeId = data?.store_id;

				// Dispatch action to load future orders after getting customer profile
				if (this.storeId && !hasDispatchedFutureOrders) {
					this.store.dispatch(
						loadFutureOrders({
							payload: {
								type: this.deliveryMode,
								cart_has_alcohol: false,
								store_id: this.storeId
							}
						})
					);
					hasDispatchedFutureOrders = true;
				}
			})
		).subscribe();

		// Subscribe to delivery mode observable
		this.deliveryModeService.deliveryMode$.pipe(
			tap(mode => {
				this.deliveryMode = mode;
			})
		).subscribe();

		// Handle step data changes
		this.store.select(selectStepData).pipe(
			tap((x) => {
				if (x?.OrderStepData?.step && x.OrderStepData.step.stepName === "customer entry") {
					this.isExpanded = true;
					this.changeDetection.detectChanges();
					this.isExpanded = false;
				}
			})
		).subscribe();
	}


public continueOrder(){
	this.isContinueOrder = true;
	this.isExpanded = false;
	this.store.dispatch(loadOrderStep({ step:{stepName: 'customer entry'} }));
	this.store.dispatch(loadStoreData({ storeId: this.storeId }));
	this.store.dispatch(loadCategoryList({ storeId: this.storeId}));
}

}
