import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCategorydata, selectProductData, selectProductsByCategory, selectCustomerProfile, selectStepData } from "../../../common/store";
import { map, Observable, startWith, tap } from "rxjs";
import { MatAccordion } from "@angular/material/expansion";
import { MatDialog } from '@angular/material/dialog';
import { DeliveryModeService } from '../../../common/services/delivey-mode.service';
import { loadProductsByCategory } from "../../../common/store/actions/category.actions";
import { Router } from '@angular/router';
import { ProductCategoryComponent } from "../product-category/product-category.component";
import { ApiResponse, DefaultDeliveryStoreData } from "../../models/customer-details";
import { Category } from '../../models/category-search';
import { Item } from "../../models/product-search";
import { ProductListResponse } from "../../models/product-list";
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-new-customer',
	templateUrl: './new-customer.component.html',
	styleUrls: ['./new-customer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewCustomerComponent implements OnInit {
	public isOrderentryExpanded = false;
	@ViewChild('searchInput') searchInput!: ElementRef;
	@ViewChild('MatAccordion') accordion: MatAccordion;
	@ViewChild('searchResults') searchResults: ElementRef;
	productData$: Observable<unknown>;
	productData: any[] = []; // Holds the product data
	filteredItems: any[] = []; // Holds the filtered search results
	eRef: any;
	searchQuery: string;
	showSearchModal: boolean;
	deliveryMode: string;
	storeId: number;
	public customerData$: Observable<ApiResponse>;
	public deliveryStoreData: DefaultDeliveryStoreData | null = null;
	categoryNames$: Observable<string[]>;
	categoryList$: Observable<Category[]>;
	productSerchItems$: Observable<Item[]>;
	selectProductsByCategory$: Observable<ProductListResponse[]>;
	filteredProducts = new FormControl();
	searchControl = new FormControl('');
	searchProduct: number = 0;

	constructor(
		private store: Store,
		public changeDetection: ChangeDetectorRef,
		private deliveryModeService: DeliveryModeService,
		private router: Router,
		private dialog: MatDialog
	) {
		this.customerData$ = this.store.select(selectCustomerProfile);
		this.categoryList$ = this.store.select(selectCategorydata);
		this.productSerchItems$ = this.store.select(selectProductData);
		this.selectProductsByCategory$ = this.store.select(selectProductsByCategory);
	}

	ngOnInit(): void {

		this.productSerchItems$.subscribe((productList: Item[]) => {
			if (Array.isArray(productList)) {
				// If productList is an array, assign it directly
				this.productData = productList;
				this.filteredItems = this.productData.filter(item =>
					item.item_name_en?.toLowerCase()
				);
				this.searchInput.nativeElement.focus();
			} else {
				// In case the productList is not an array, reset productData
				this.productData = [];
			}
		});

		this.store.select(selectStepData).pipe(
			tap(x => {
				if (x?.OrderStepData?.step && x.OrderStepData.step.stepName !== "order entry") {
					this.isOrderentryExpanded = false;
					this.changeDetection.detectChanges();
					this.isOrderentryExpanded = true;
				}
			})
		).subscribe();


		this.customerData$.subscribe((customerProfile : ApiResponse) => {
			this.deliveryStoreData = customerProfile?.default_delivery_store_data
			if(this.deliveryStoreData) {
				this.storeId = this.deliveryStoreData.store_id;
			}
		});

		// Use a pipe to filter and handle the subscription properly
		this.selectProductsByCategory$.subscribe((products: ProductListResponse[]) => {
			const productsByCategory= products;
			if (productsByCategory) {
				if (this.dialog) {
					this.dialog.open(ProductCategoryComponent, {
						width: 'auto',
						height: 'auto',
						data: { products: productsByCategory }  // Pass the product data to the dialog
					});
				} else {
				console.error('MatDialog is not available.');
				}
			}
		});

		// Subscribe to the delivery mode observable
		this.deliveryModeService.deliveryMode$.subscribe(mode => {
			this.deliveryMode = mode;
		});

		this.searchControl.valueChanges.subscribe((value) => {
			this.filterOptions(value);
		});


	}

	filterSearch(event: Event) {
		const value = (event.target as HTMLInputElement).value.toLowerCase();
		this.searchProduct = value.length;
		if (value.length >= 0) {
			return this.filteredItems = this.productData.filter(item =>
				item.item_name_en?.toLowerCase().includes(value)
			);
		}
		this.searchProduct = value.length;
		return this.filteredItems = [];
	}

	filterOptions(value: string) {
		this.searchProduct = value.length;
		if (value.length >= 0) {
			this.filteredItems = this.productData.filter((option) =>
				option.item_name_en.toLowerCase().includes(value.toLowerCase())
			);
		}
	}

	editOption(option: any) {
		console.log(`Editing option: ${option.item_name_en}`, option);
		// Logic for editing the option can go here
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
		this.filteredProducts = new FormControl();
		this.searchProduct = 0;
	}

	onCategoryClick(categoryId: string): void {
		this.store.dispatch(loadProductsByCategory({ storeId: this.storeId, categoryId, deliveryMode: this.deliveryMode }));
	}
}
