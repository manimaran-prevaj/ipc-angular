import { Component, OnInit, TemplateRef } from "@angular/core";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";

// TODO:: Recent delivery/pickup addresses to be obtained from BE API
import { deliveryAddresses, pickupAddresses } from './../../../../mockdata/addresses.js';

@Component({
	selector: 'app-address-details',
	templateUrl: './address-details.component.html',
	styleUrls: ['./address-details.component.scss'],
})

export class AddressDetailsComponent implements OnInit {
	public deliveryType: string;
	public recentDeliveryAddresses;
	public recentPickupAddresses;

	constructor(
		public dialog: MatDialog,
		// TODO :: Remove this logic to NgRx Store
		private customerEntryService: CustomerEntryService
	) { }

	ngOnInit(): void {
		// TODO :: Remove this logic to NgRx Store
		this.deliveryType = 'delivery';
		this.customerEntryService.deliveryType$.subscribe((deliveryType: string) => {
			this.deliveryType = deliveryType;
		});

		// TODO:: Recent delivery/pickup addresses to be obtained from BE API
		this.recentDeliveryAddresses = deliveryAddresses;
		this.recentPickupAddresses = pickupAddresses;
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

}
