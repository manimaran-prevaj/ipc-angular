import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {  selectCustomerProfile, selectStepData } from "../../../common/store";
import { mockCategories } from '../../../../mockdata/category';
import { Observable } from "rxjs";
import { loadCategoryList } from "../../../common/store/actions/category.actions";
import { loadStoreData } from "../../../common/store/actions/product-search.actions";

@Component({
	selector: 'app-new-customer',
	templateUrl: './new-customer.component.html',
	styleUrls: ['./new-customer.component.scss'],
})

export class NewCustomerComponent implements OnInit {

	categoryNames$: Observable<string[]>;

	categories = mockCategories;

	public isOrderentryExpanded = false;
	constructor(
		private store: Store,
	) { }
	
ngOnInit(): void {
	this.store.select(selectStepData).subscribe(x=>{
		// const data: any = x;
		if(x?.OrderStepData?.step){
			if(x?.OrderStepData?.step?.stepName !=="order entry"){
				this.isOrderentryExpanded = true;
			}
		}
	});

	this.store.select(selectCustomerProfile).subscribe(x=>{
		const data: any = x;
		if (data) {
			const storeId = data?.customerDetails?.customerProfile?.default_delivery_store_data?.store_id // Assuming store_id is the property name
			if (storeId) {
				this.store.dispatch(loadStoreData({ storeId }));
				this.store.dispatch(loadCategoryList({ storeId }));
			}
	}
		
	});

	// Subscribe to the category names observable
    this.categoryNames$ = null//this.store.pipe(select(selectCategoryNames));

}
}
