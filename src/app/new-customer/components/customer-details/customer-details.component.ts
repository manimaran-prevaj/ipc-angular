import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { CustomerEntryService } from "../../services/customer-entry.service";


// TODO:: Order date and time to be obtained from BE API
import { orderDateTime } from '../../../../mockdata/future-datetime.js';

export interface OrderDateTime {
	date: string;
	times: [string];
	day_code?: string;
}

@Component({
	selector: 'app-customer-details',
	templateUrl: './customer-details.component.html',
	styleUrls: ['./customer-details.component.scss'],
})

export class CustomerDetailsComponent implements OnInit {
	public customerDetailsForm: FormGroup;
	public dateTimeForm: FormGroup
	public selectedDate: string;
	public selectedTime: string;
	public selectedOption: string;
	public filteredTimes: string[] = ['Now'];
	public orderDateTimeData: OrderDateTime[] = [];

	constructor(
		private formBuilder: FormBuilder,
		public dialog: MatDialog,
		private customerEntryService: CustomerEntryService
	) { }

	ngOnInit() {
		this.selectedOption = '';
		this.mapOrderDateTime(orderDateTime);
		this.dateTimeForm = this.formBuilder.group({
			date: ['Today', [Validators.required]],
			time: ['Now', [Validators.required]]
		});
		const todayDateTime = `${this.getTodayDate()} - Today - Now`;
		this.customerDetailsForm = this.formBuilder.group({
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			phone: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
			phoneExt: [''],
			datePicker: [todayDateTime, [Validators.required]],
			modeOfDelivery: ['delivery', [Validators.required]],
			emailOptIn: [],
			emailOptOut: [],
		});
	}

	onSelectionChange(option: string) {
		const controls = this.customerDetailsForm.controls;
		if (option === 'emailOptIn') {
			controls['emailOptOut'].setValue(false);
		} else if (option === 'emailOptOut') {
			controls['emailOptIn'].setValue(false);
		}
	}

	mapOrderDateTime(data: []) {
		this.orderDateTimeData.push({
			date: "Today",
			times: ["Now"]
		});

		data.map((item: OrderDateTime) => {
			const [year, month, day] = item.date.split('-');
			const formattedDate = `${day}/${month}/${year}`;
			const option: OrderDateTime = {
				date: formattedDate,
				times: item.times
			}

			this.orderDateTimeData.push(option);
		});
	}

	getTodayDate(): string {
		return new Date().toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	onlyNumber(event) {
		const ASCIICode = (event.which) ? event.which : event.keyCode
		if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
			return false;
		}
		return true;
	}

	onDateChange() {
		const selectedData = this.orderDateTimeData.find(item => item.date === this.selectedDate);
		if (selectedData) {
			this.filteredTimes = selectedData.times;
			this.selectedTime = this.filteredTimes[0];
		}
	}
	/** Diabling eslint as TemplateRef<any> is of type generic  */
	/* eslint-disable */
	openDateTimeModal(content: TemplateRef<any>): void {
		const dialogRef = this.dialog.open(CCCModalComponent, {
			data: {
				title: 'Choose date & time',
				cancelText: 'Cancel',
				confirmText: 'Done',
				content
			}
		});

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm) {
				if (this.dateTimeForm.controls['date'].value === 'Today' && this.dateTimeForm.controls['time'].value === 'Now') {
					this.customerDetailsForm.controls['datePicker'].setValue(`${this.getTodayDate()} - ${this.selectedDate} - ${this.selectedTime}`);
				} else {
					this.customerDetailsForm.controls['datePicker'].setValue(`${this.selectedDate} - ${this.selectedTime}`);
				}
			}
		});
	}
	/* eslint-enable */

	onDeliveryTypeChange() {
		// TODO :: Remove this logic to NgRx Store
		this.customerEntryService.setDeliveryType(this.customerDetailsForm.controls['modeOfDelivery'].value);
	}
}
