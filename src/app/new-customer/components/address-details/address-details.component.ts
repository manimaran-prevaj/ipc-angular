import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";

// TODO:: Recent delivery/pickup addresses to be obtained from BE API
import { deliveryAddresses, pickupAddresses } from './../../../../mockdata/addresses.js';
import { Subscription } from "rxjs";
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
	public dwellingTypeOptions: string[] = [
		'House',
		'Apartment',
		'Condo',
		'Town House',
		'Plex',
		'Hotel',
		'Mobile Park',
		'Hospital',
		'Business',
		'University',
		'College',
		'School'
	];

	public nodeObserver: MutationObserver;
	public formChangeRef: Subscription;

	constructor(
		public dialog: MatDialog,
		// TODO :: Remove this logic to NgRx Store
		private customerEntryService: CustomerEntryService,
		private formBuilder: FormBuilder
	) {
		this.addressDetailsForm = this.formBuilder.group({
			autocompleteAddress: [''],
			dwellingType: ['']
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
		// TODO :: Remove this logic to NgRx Store
		this.deliveryType = 'delivery';
		this.customerEntryService.deliveryType$.subscribe((deliveryType: string) => {
			this.deliveryType = deliveryType;
			this.addressDetailsForm.reset();
		});

		// TODO:: Recent delivery/pickup addresses to be obtained from BE API
		this.recentDeliveryAddresses = deliveryAddresses;
		this.recentPickupAddresses = pickupAddresses;
		this.isAutoCompleteEmpty = true;
	}

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
		console.log(event.value);
	}

	onManualLookup() {
		console.log("Manual Lookup");
	}

	ngOnDestroy() {
		this._unsubscribeFromAll();
	}

	private _unsubscribeFromAll() {
		this.nodeObserver.disconnect();
		this.formChangeRef.unsubscribe();
	}
}
