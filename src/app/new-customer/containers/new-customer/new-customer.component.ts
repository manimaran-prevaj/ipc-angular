import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { selectCatogory, selectCustomerProfile, selectStepData } from "../../../common/store";
import { Observable } from "rxjs";
import { MatAccordion } from "@angular/material/expansion";

@Component({
	selector: 'app-new-customer',
	templateUrl: './new-customer.component.html',
	styleUrls: ['./new-customer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewCustomerComponent implements OnInit {

	categoryNames$: Observable<string[]>;

	public isOrderentryExpanded = false;
	@ViewChild('MatAccordion') accordion: MatAccordion
	constructor(
		private store: Store,
		public changeDetection: ChangeDetectorRef
	) { }
	
ngOnInit(): void {
	this.store.select(selectStepData).subscribe(x=>{
		// const data: any = x;
		if(x?.OrderStepData?.step){
			if(x?.OrderStepData?.step?.stepName !=="order entry"){
				this.isOrderentryExpanded = false;
				this.changeDetection.detectChanges();
				this.isOrderentryExpanded = true;
			}
		}
	});
	

	this.store.pipe(select(selectCustomerProfile)).subscribe(x=>{
		const data: any = x;
		if (data) {
			const storeId = data?.customerDetails?.customerProfile?.default_delivery_store_data?.store_id // Assuming store_id is the property name
			if (storeId) {
				// this.store.dispatch(loadOrderStep({ step:{stepName: 'customer entry'} }));
				// this.store.dispatch(loadStoreData({ storeId }));
				// this.store.dispatch(loadCategoryList({ storeId }));
			}
	}
		
	});

	this.store.pipe(select(selectCatogory)).subscribe(x=>{
		const data: any = x;
		if (data) {
			this.categoryNames$ = data?.categoryReducer?.categories?.map(x=>x.name);
		}
	});


}
}
