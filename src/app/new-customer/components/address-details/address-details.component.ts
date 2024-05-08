import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";

// TODO:: Recent delivery/pickup addresses to be obtained from BE API
import { deliveryAddresses, pickupAddresses } from './../../../../mockdata/addresses.js';
declare let google;

@Component({
	selector: 'app-address-details',
	templateUrl: './address-details.component.html',
	styleUrls: ['./address-details.component.scss'],
})

export class AddressDetailsComponent implements OnInit, AfterViewInit {
	/** Diabling eslint as content is of ElementRef<any> is of type generic  */
	/* eslint-disable */
	@ViewChild('inputfield') inputfield: ElementRef<any>;
	/* eslint-enable */
	private divAdded: boolean;
	public addressDetailsForm: FormGroup
	public deliveryType: string;
	public recentDeliveryAddresses;
	public recentPickupAddresses;
	public autocomplete: google.maps.places.Autocomplete;
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
	]

	constructor(
		public dialog: MatDialog,
		// TODO :: Remove this logic to NgRx Store
		private customerEntryService: CustomerEntryService,
		private formBuilder: FormBuilder,
	) { }

	ngOnInit(): void {
		this.divAdded = false;
		this.addressDetailsForm = this.formBuilder.group({
			autocompleteAddress: [''],
			dwellingType: ['']
		});
		// TODO :: Remove this logic to NgRx Store
		this.deliveryType = 'delivery';
		this.customerEntryService.deliveryType$.subscribe((deliveryType: string) => {
			this.deliveryType = deliveryType;
			this.addressDetailsForm.reset();
		});

		// TODO:: Recent delivery/pickup addresses to be obtained from BE API
		this.recentDeliveryAddresses = deliveryAddresses;
		this.recentPickupAddresses = pickupAddresses;
	}

	ngAfterViewInit(): void {
		const options = {
			componentRestrictions: { country: 'ca' }
		};
		this.autocomplete = new google.maps.places.Autocomplete(this.inputfield.nativeElement, options);
		// this.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
		this.autocomplete.addListener('place_changed', () => {
			const place = this.autocomplete?.getPlace();
			console.log(place);
		})
	}

	onAddressSearch(event) {
		if (event.target.value) {
			const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('pac-container');
			const activePacElement = elements[elements.length - 1];
			if (!this.divAdded) {
				if (activePacElement) {
					const pacItems = activePacElement.querySelectorAll('.pac-item');
					if (pacItems && pacItems.length > 0) {
						const lastPacItem = pacItems[pacItems.length - 1];
						const customDiv = document.createElement('div');
						customDiv.textContent = 'Manual Address Lookup';
						lastPacItem.insertAdjacentElement('afterend', customDiv);
						this.divAdded = true;
					}
				}
			}
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
}
