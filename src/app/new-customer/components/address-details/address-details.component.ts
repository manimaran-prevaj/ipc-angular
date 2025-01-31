// Add this reference to use the Google Maps types
/// <reference types="@googlemaps/types" />
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";

// TODO:: Recent delivery/pickup addresses to be obtained from BE API
import { deliveryAddresses, pickupAddresses } from './../../../../mockdata/addresses.js';
import { Observable, Subscription } from "rxjs";
import { DwellingTypeOptions } from "../../models/customer-entry.model";
import { dwellingTypeOptions } from "./../../../../mockdata/static-copy.js";
import { ManualAddressDetailsComponent } from "../manual-address-details/manual-address-details.component";
import { select, Store } from "@ngrx/store";
import { selectAppConfig, selectCustomerProfile } from "../../../common/store";
import { ApiResponse, DefaultDeliveryStoreData } from "../../models/customer-details";
import { environment } from "../../../../environments/environment";
//import { environment } from '../../../../environments/environment';
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
	@ViewChild('storeHoursContainer', { static: false }) storeHoursContainer: ElementRef;
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
	public showStoreHoursPopup = false;
	public customerData$: Observable<ApiResponse>;
	public deliveryStoreData: DefaultDeliveryStoreData | null = null;
	public appConfig$: Observable<any>;
	

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
		/* eslint-disable */
		this.nodeObserver = new MutationObserver(() => {
		});

		this.customerData$ = this.store.select(selectCustomerProfile);
		this.appConfig$ = this.store.select(selectAppConfig);

	}

	private loadGoogleMapsScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (typeof google !== 'undefined') {
				// Google Maps is already loaded
				resolve();
				return;
			}
			// Create the script element
			const script = document.createElement('script');
			script.src = 'https://maps.googleapis.com/maps/api/js?key='+environment["googleServiceKey"]+'&libraries=places';
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = (error) => reject(error);
	
			// Append the script to the document head
			document.head.appendChild(script);
		});
	}


	ngOnInit(): void {
		this.store.pipe(select(selectAppConfig)).subscribe(x => {
			const resp: any = x;
			if (resp) {
			  this.dwellingTypeOptions = resp.appConfig.dwellingType;
			}
		  });
		
		this.customerData$.subscribe((customerProfile : ApiResponse) => {
			this.deliveryStoreData = customerProfile?.default_delivery_store_data
			//this.customerDetails = customerProfile?.default_delivery_store_data
			if (this.deliveryStoreData) {
				this.addressDetailsForm.patchValue({autocompleteAddress:this.deliveryStoreData.address
				})
				
				this.storeHoursData = this.transformOperatingHours(this.deliveryStoreData.operating_hours_details_cache);
				const currentDayStore: any = this.deliveryStoreData.operating_hours_details_cache.find(x => x.day_name == new Date().getDay());
				const currentDate = new  Date();
				//currentDate.setDate(currentDate.getDate()+1);
				const currentTimeDate = Date.parse(new Date().toLocaleString());
				const storeStartTimeDate = Date.parse(new Date(new Date(currentDate).toLocaleDateString() + ' ' + currentDayStore.start_time + " AM").toLocaleString());
				const storeEndTimeDate = Date.parse(new Date(new Date(currentDate).toLocaleDateString() + ' ' + currentDayStore.end_time + " PM").toLocaleString());
				if(currentTimeDate >= storeStartTimeDate && currentTimeDate <= storeEndTimeDate) {
					this.currentStoreStatus = "Open Closes " + this.formatTime(currentDayStore.end_time);
				} else {
					this.currentStoreStatus = "Closed Opens " + this.formatTime(currentDayStore.start_time);
				}
				this.addressDetailsForm.patchValue({storeHours:this.storeHoursData.find(x=>x.day == (new Date().getDay()==0?6:new Date().getDay()-1))});
				this.pickupAvailable = this.deliveryStoreData.pickup_available ? 'Available':'N/A';
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
					autocompleteAddress: this.deliveryStoreData?.address,
					storeHours:this.storeHoursData.find(x=>x.day == new Date().getDay()-1) 
				});
			}
		});

		// TODO:: Recent delivery/pickup addresses to be obtained from BE API
		this.recentDeliveryAddresses = deliveryAddresses;
		this.recentPickupAddresses = pickupAddresses;
		this.isAutoCompleteEmpty = true;
	}

	toggleStoreHoursPopup(): void {
		this.showStoreHoursPopup = !this.showStoreHoursPopup;
	}
	
	onPopupClick(event: MouseEvent): void {
		event.stopPropagation(); // Prevent closing the popup when clicking inside it
	}
	
	onContainerClick(event: MouseEvent): void {
		event.stopPropagation(); // Stop event propagation within the container
	}
	
	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent): void {
		if (this.showStoreHoursPopup && !this.storeHoursContainer.nativeElement.contains(event.target)) {
			this.showStoreHoursPopup = false;
		}
	}


transformOperatingHours(data: any[]): any[] {
    const todayIndex = new Date().getDay();
    const orderedData = data.slice(todayIndex).concat(data.slice(0, todayIndex)); // Reorder starting with today

    return orderedData.map((item, index) => ({
      label: this.getDayName(item.day_name),
      hours: `${this.formatTime(item.start_time)} - ${this.formatTime(item.end_time)}`,
      isToday: (index === 0) // The first item is today
    }));
}

  getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }

  formatTime(time: string): string {
    const [hour] = time.split(':').map(Number);
    const period = hour < 12 ? 'a.m.' : 'p.m.';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour} ${period}`;
}
  
  // Transformed data
  storeHoursData1 = this.transformOperatingHours(this.storeHoursData);

  ngAfterViewInit(): void {
    // Call loadGoogleMapsScript to ensure Google Maps is loaded
    this.loadGoogleMapsScript().then(() => {
        this.initMap(true); // Initialize the map after the script loads
    }).catch(error => {
        console.error('Error loading Google Maps script', error);
    });

    this.onFormChanges();
}

initMap(isInitialLoad: boolean) {
    if (isInitialLoad) {
        if (typeof google !== 'undefined') {
            const options = {
                componentRestrictions: { country: 'ca' }
            };
            this.autocomplete = new google.maps.places.Autocomplete(this.inputfield.nativeElement, options);
            this.autocomplete.addListener('place_changed', () => {
                const place = this.autocomplete?.getPlace();
                this.handleAutoComplete();
                this.isAutoCompleteEmpty = true;
            });
        } else {
            console.error('****GOOGLE map variable not loaded, so autocomplete will not work');
        }
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
