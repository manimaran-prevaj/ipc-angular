import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { getProductList, searchProducts, selectCatogory, selectCustomerProfile, selectStepData } from "../../../common/store";
import { Observable } from "rxjs";
import { MatAccordion } from "@angular/material/expansion";
import { MatDialog } from '@angular/material/dialog';
import { DeliveryModeService } from '../../../common/services/delivey-mode.service';
import { loadProductsByCategory } from "../../../common/store/actions/category.actions";
import { Router } from '@angular/router';
import { ProductCategoryComponent } from "../product-category/product-category.component";

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
	deliveryMode: string;
	storeId: number;

	constructor(
		private store: Store,
		public changeDetection: ChangeDetectorRef,
		private deliveryModeService: DeliveryModeService,
		private router: Router,
		private dialog: MatDialog 
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
			this.storeId = data?.customerDetails?.customerProfile?.default_delivery_store_data?.store_id
	}
		
	});

	this.store.pipe(select(selectCatogory)).subscribe(x => {
		const data: any = x;
		if (data) {
			this.categoryNames$ = data?.categoryReducer?.categories?.map(category => ({
				id: category.id,
				name: category.name,
			}));
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

	// Use a pipe to filter and handle the subscription properly
	this.store.pipe(select(getProductList)).subscribe(productData => {
		const catgProductList: any = productData;
		if (catgProductList?.categoryReducer?.products) {
			if (this.dialog) {
				this.dialog.open(ProductCategoryComponent, {
					width: 'auto',
					height: 'auto',
					data: { products: catgProductList?.categoryReducer?.products }  // Pass the product data to the dialog
				});
			} else {
			console.error('MatDialog is not available.');
			}
		} else {
			console.error('Product data is undefined or null.');
		}
	});

	// Subscribe to the delivery mode observable
	this.deliveryModeService.deliveryMode$.subscribe(mode => {
		this.deliveryMode = mode;
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

  onCategoryClick(categoryId: string): void {
	this.store.dispatch(loadProductsByCategory({ storeId: this.storeId, categoryId, deliveryMode: this.deliveryMode }));
  
	
  }
}
