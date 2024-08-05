/// <reference types="@googlemaps/types" />
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";

// TODO:: Recent delivery/pickup addresses to be obtained from BE API
import { deliveryAddresses, pickupAddresses } from './../../../../mockdata/addresses.js';
import { Subscription } from "rxjs";
import { DwellingTypeOptions } from "../../models/customer-entry.model";
import { dwellingTypeOptions } from "./../../../../mockdata/static-copy.js";
import { ManualAddressDetailsComponent } from "../manual-address-details/manual-address-details.component";
import { select, Store } from "@ngrx/store";
import { selectAppConfig, selectCustomerProfile } from "../../../common/store";
import { ApiResponse } from "../../models/customer-details";
declare let google;

@Component({
	selector: 'app-address-details',
	templateUrl: './address-details.component.html',
	styleUrls: ['./address-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class AddressDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
	/** Diabling eslint as content is of ElementRef<any> is of type generic  */
	/* eslint-disable */
	@ViewChild('inputfield') inputfield: ElementRef<any>;
	@ViewChild('noResults') noResultsElement: ElementRef<any>;
	/* eslint-enable */
	public addressDetailsForm: FormGroup
	public deliveryType: string;
	public recentDeliveryAddresses;
	public recentPickupAddresses;
	public autocomplete: google.maps.places.Autocomplete;
	public isAutoCompleteEmpty: boolean;
	public dwellingTypeOptions: DwellingTypeOptions[] = dwellingTypeOptions;
	public selectedDwellingType: string;

	public nodeObserver: MutationObserver;
	public formChangeRef: Subscription;
	public customerDetails: ApiResponse;
	public storeHoursData:any[] = [];
	public storeHours:any[] = [];
	public currentStoreStatus = '';
	public pickupAvailable = '';
	public today: number;

	constructor(
		public dialog: MatDialog,
		// TODO :: Remove this logic to NgRx Store
		private customerEntryService: CustomerEntryService,
		private formBuilder: FormBuilder,
		private store: Store
	) {
		this.addressDetailsForm = this.formBuilder.group({
			autocompleteAddress: [''],
			dwellingType: [''],
			storeHours:['']
		});

		this.nodeObserver = new MutationObserver((mutations) => {
			const autocompleteAddressControl = this.addressDetailsForm.get('autocompleteAddress');
			const currentInputValue = autocompleteAddressControl ? autocompleteAddressControl.value : null;

			mutations.forEach((mutation) => {
				let isEmpty = false;
				let isDisplayed = true;
				if (mutation.type === 'childList') {
					isEmpty = mutation.addedNodes.length < 1;
				} else {
					isDisplayed = mutation.target['style'].display !== 'none'
				}
				// TODO:: Remove these consoles for Manual lookup modal development
				console.log(isEmpty, isDisplayed, currentInputValue);
			})
		})
	}

	ngOnInit(): void {
		this.store.pipe(select(selectAppConfig)).subscribe(x=>{
			const resp: any = x;
			if (resp?.appConfig?.bannerMessage) {
				this.dwellingTypeOptions = resp.appConfig.dwellingType;
			}
		});
		
		this.store.pipe(select(selectCustomerProfile)).subscribe(x=>{
			const data: any = x;
			this.customerDetails = data?.customerDetails?.customerProfile as ApiResponse;
			if (this.customerDetails) {
				this.addressDetailsForm.patchValue({autocompleteAddress:this.customerDetails.default_delivery_store_data.address
				})
				
				this.storeHoursData = this.transformOperatingHours(this.customerDetails.default_delivery_store_data.operating_hours_details_cache);
				const currentDayStore: any = this.customerDetails.default_delivery_store_data.operating_hours_details_cache.find(x => x.day_name == new Date().getDay()-1);
				const currentDate = new  Date();
				currentDate.setDate(currentDate.getDate()+1);
				if (Date.parse(new Date().toLocaleString()) < Date.parse(new Date(new Date(currentDate).toLocaleDateString() + ' ' + currentDayStore.start_time).toLocaleString())) {
					this.currentStoreStatus = "Closed Opens " + this.formatTime(currentDayStore.start_time);
				}
				else if(Date.parse(new Date().toLocaleString()) < Date.parse(new Date(new Date(currentDate).toLocaleDateString() + ' ' + currentDayStore.end_time).toLocaleString())) {
					this.currentStoreStatus = "Open Closes " + this.formatTime(currentDayStore.end_time);
				} else {
					this.currentStoreStatus = "Closed";
				}
				this.addressDetailsForm.patchValue({storeHours:this.storeHoursData.find(x=>x.day == new Date().getDay()-1)});
				this.pickupAvailable = this.customerDetails.default_delivery_store_data.pickup_available ? 'Available':'N/A';
			}
		});
		// TODO :: Remove this logic to NgRx Store
		this.deliveryType = 'delivery';
		this.customerEntryService.deliveryType$.subscribe((deliveryType: string) => {
			this.deliveryType = deliveryType;
			this.selectedDwellingType = '';
			this.addressDetailsForm.reset();
			this.addressDetailsForm.controls['dwellingType'][this.deliveryType === 'pickup' ? 'disable' : 'enable']();
			if (this.deliveryType == 'delivery') {
				this.addressDetailsForm.patchValue({ 
					autocompleteAddress: this.customerDetails?.default_delivery_store_data?.address,
					storeHours:this.storeHoursData.find(x=>x.day == new Date().getDay()-1) 
				});
			}
		});

		// TODO:: Recent delivery/pickup addresses to be obtained from BE API
		this.recentDeliveryAddresses = deliveryAddresses;
		this.recentPickupAddresses = pickupAddresses;
		this.isAutoCompleteEmpty = true;
	}


	// Function to format time from 24-hour to 12-hour format
 formatTime(time: string): string {
	const [hour, minute] = time.split(':').map(Number);
	const period = hour < 12 ? 'a.m.' : 'p.m.';
	const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
	return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }
  
  // Function to transform operating hours data
  transformOperatingHours(data: any[]) {
	return data.map(item => ({
		label: item.label,
		hours: `${this.formatTime(item.start_time)} - ${this.formatTime(item.end_time)}`,
		day:item.day_name
	}));
  }
  
  // Transformed data
  storeHoursData1 = this.transformOperatingHours(this.storeHoursData);

	ngAfterViewInit(): void {
		this.initMap(true);
		this.onFormChanges();
	}

	initMap(isInitialLoad: boolean) {
		if (isInitialLoad) {
			const options = {
				componentRestrictions: { country: 'ca' }
			};
			this.autocomplete = new google.maps.places.Autocomplete(this.inputfield.nativeElement, options);
			this.autocomplete.addListener('place_changed', () => {
				const place = this.autocomplete?.getPlace();
				this.handleAutoComplete();
				console.log(place);
				this.isAutoCompleteEmpty = true;
			})
		}
	}

	onFormChanges() {
		const autocompleteAddressControl = this.addressDetailsForm.get('autocompleteAddress');
		if (autocompleteAddressControl) {
			this.formChangeRef = autocompleteAddressControl.valueChanges.subscribe(() => {
				this.handleAutoComplete();
			});
		}
	}

	handleAutoComplete() {
		const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('pac-container');
		const activePacElement = elements[elements.length - 1];
		this.isAutoCompleteEmpty = this.inputfield.nativeElement.value === '';
		if (activePacElement) {
			this.noResultsElement.nativeElement.appendChild(activePacElement);
			this.nodeObserver.observe(activePacElement, { childList: true, attributes: true });
		}
	}

	/** Diabling eslint as TemplateRef<any> is of type generic  */
	/* eslint-disable */
	openRecentAddresses(content: TemplateRef<any>): void {
		const dialogRef = this.dialog.open(CCCModalComponent, {
			data: {
				title: `Recent ${this.deliveryType} addresses`,
				cancelText: 'Cancel',
				confirmText: 'Done',
				delievryType: this.deliveryType,
				content
			},
			maxHeight: '500px'
		});

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm) {
				console.log(`${this.deliveryType} closed`);
			} else {
				console.log(`${this.deliveryType} cancel`);
			}
		});
	}
	/* eslint-enable */

	onDwellingTypeChange(event) {
		this.selectedDwellingType = event?.value;
	}

	onManualLookup(content: TemplateRef<ManualAddressDetailsComponent>): void {
		this.dialog.open(CCCModalComponent, {
			data: {
				title: "",
				
				cancelText: 'Cancel',
				confirmText: 'Done',
				content
			},
			maxHeight: '90%',
			width:"80%",
		});
	}

	onStoreHoursChange(){
		this.addressDetailsForm.patchValue({storeHours:this.storeHoursData.find(x=>x.day == new Date().getDay())})
	}

	ngOnDestroy() {
		this._unsubscribeFromAll();
	}

	private _unsubscribeFromAll() {
		this.nodeObserver.disconnect();
		this.formChangeRef.unsubscribe();
	}
}
