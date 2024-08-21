import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { searchProducts, selectCatogory, selectCustomerProfile, selectStepData } from "../../../common/store";
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
	@ViewChild('searchResults') searchResults: ElementRef;
	productData$: Observable<unknown>;
	productData: any[] = []; // Holds the product data
    filteredItems: any[] = []; // Holds the filtered search results
	eRef: any;
	searchQuery: string;
	showSearchModal: boolean;
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

	this.store.pipe(select(searchProducts)).subscribe(x => {
		const data: any = x;
		if (data && data.productSearchData && Array.isArray(data.productSearchData.item)) {
			this.productData = data.productSearchData.item;
		} else {
			this.productData = []; 
		}
	});
}

onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.productData.filter(item =>
      item.item_name_en?.toLowerCase().includes(query)
    );
    this.showSearchModal = this.filteredItems.length > 0;
  }

  checkEmpty(event: KeyboardEvent): void {
    if ((event.target as HTMLInputElement).value === '') {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredItems = [];
    this.showSearchModal = false;
  }

}
