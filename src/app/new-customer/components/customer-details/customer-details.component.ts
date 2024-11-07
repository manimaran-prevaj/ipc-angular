import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { select, Store } from '@ngrx/store';
import { loadCustomerDetails, loadCustomerDetailsSuccess } from "../../../common/store/actions/customer-details.actions";
import { ApiResponse } from "../../models/customer-details";
import { DeliveryModeService } from '../../../common/services/delivey-mode.service';

import { OrderDateTime } from "../../models/customer-entry.model";
import { selectCustomerProfile, selectOrderDateTime } from '../../../common/store';
import { Observable } from "rxjs";


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
	public filteredTimes: string[] = [];
	public orderDateTimeData: OrderDateTime[] = [];
	public currenDate = new Date().toDateString().split(' ').splice(1).join(' ');
	public customerResponse: ApiResponse;
	public showEmailOptDate = false;
	public customerRequested = false;
	private deliveryModeService: DeliveryModeService
	public customerData$: Observable<ApiResponse>;
	public orderDateTime$: Observable<OrderDateTime[]>;

	constructor(
		private formBuilder: FormBuilder,
		public dialog: MatDialog,
		private customerEntryService: CustomerEntryService,
		private store: Store
	) {
		// Initialize customerData$ observable by selecting customer profile
		this.customerData$ = this.store.select(selectCustomerProfile);

		// Initialize orderDateTime$ observable
		this.orderDateTime$ = this.store.select(selectOrderDateTime);
	}

	ngOnInit() {
		this.customerDetailsForm = this.formBuilder.group({
			cellNumber: [false],
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]], // Ensure email control is initialized
			phone: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
			phoneExt: [''],
			datePicker: ['', [Validators.required]],
			modeOfDelivery: ['delivery', [Validators.required]],
			emailOptIn: [false],
			emailOptOut: [false],
		});

		// Initialize the dateTimeForm
		this.dateTimeForm = this.formBuilder.group({
			date: ['Today', [Validators.required]], // Ensure the 'date' control is initialized
			time: ['Now', [Validators.required]]    // Ensure the 'time' control is initialized
		});

		// Subscribe to phone field value changes
		// Listen for changes in the phone field
		this.customerDetailsForm.get('phone').valueChanges.subscribe(value => {
			if (!value || value.trim() === '') { // Check if the phone field is empty or only contains whitespace
				this.resetCustomerDetailsForm();
			}
		});

		this.store.pipe(select(selectCustomerProfile)).subscribe((customerProfile: ApiResponse) => {
			if (customerProfile?.customer_data) {
					this.customerDetailsForm.patchValue({
						firstName: customerProfile.customer_data.first_name || '',
						lastName: customerProfile.customer_data.last_name || '',
						email: customerProfile.customer_data.email || '',
						emailOptIn: false,
						emailOptOut: true,
					});

					// Email field should be required for existing customers
					this.customerDetailsForm.get('email').setValidators([Validators.required, Validators.email]);

				} else {
					// New customer logic
					this.customerDetailsForm.patchValue({
						firstName: '',
						lastName: '',
						email: '',  // Leave email empty
						emailOptOut: true,  // Opt-Out checked by default for new customers
						emailOptIn: false  // Default behavior for new customers
					});
		
				// Email should not be required for new customers, remove validators
				this.customerDetailsForm.get('email').clearValidators();
			}

			// Ensure that validation updates are applied immediately
			this.customerDetailsForm.get('email').updateValueAndValidity();
		});
		// Subscribe to future times
    this.store.pipe(select(selectOrderDateTime)).subscribe((times: OrderDateTime[]) => {		
			this.orderDateTimeData = []; // Clear previous data
			this.orderDateTimeData = times;
			this.mapOrderDateTime(this.orderDateTimeData);
			this.onDateChange();
		});
		this.selectedOption = '';
		// this.mapOrderDateTime(orderDateTime as []);
		this.dateTimeForm = this.formBuilder.group({
			date: ['Today', [Validators.required]],
			time: [this.selectedTime || 'Now', [Validators.required]] // Ensure the default time is set
		});
		const todayDateTime = `${this.getTodayDate()} - Today - ${this.selectedTime || 'Now'}`;
		this.customerDetailsForm.patchValue({ datePicker: todayDateTime });
		this.customerDetailsForm = this.formBuilder.group({
			cellNumber: [false],
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			phone: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
			phoneExt: [''],
			datePicker: [todayDateTime, [Validators.required]],
			modeOfDelivery: ['delivery', [Validators.required]],
			emailOptIn: [false],
			emailOptOut: [this.customerRequested],
		});

		this.customerDetailsForm.controls['modeOfDelivery'].valueChanges.subscribe(value => {
			this.deliveryModeService.setDeliveryMode(value);
		});

	}

	// Handle keydown event on phone input field
	onPhoneKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const value = this.customerDetailsForm.controls['phone'].value;
			//eslint-disable-next-line
			const sanitizedValue = value.replace(/[\(\)\-\s]/g, '');
			if (sanitizedValue.length === 10) {
				this.store.dispatch(loadCustomerDetails({ phone: sanitizedValue }));
				this.showEmailOptDate = false;
			}
		} else if (event.key === 'Backspace' || event.key === 'Delete') {
			this.store.dispatch(loadCustomerDetailsSuccess({ customerProfile: {} as unknown as ApiResponse }));
		}
	}

	onSelectionChange(option: string) {
		const controls = this.customerDetailsForm.controls;
		if (option === 'emailOptIn') {
			controls['emailOptOut'].setValue(false);
		} else if (option === 'emailOptOut') {
			controls['emailOptIn'].setValue(false);
		}
		this.setEmailValidator();
	}

	mapOrderDateTime(data: OrderDateTime[]) {
		if (!data || !Array.isArray(data)) {
			// If data is null, undefined, or not an array, return early or handle it accordingly
			console.warn('Order date-time data is not available or is invalid');
			return;
		}
	
		const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format
		const todayData = data.find((item: OrderDateTime) => item.date === today);
	
		this.orderDateTimeData = []; // Clear previous data
	
		// If today's data is found, add it with "Today" label
		if (todayData) {
			this.orderDateTimeData.push({
				date: "Today",
				times: todayData.times
			});
			this.selectedDate = "Today";
			this.filteredTimes = todayData.times;
			this.selectedTime = this.filteredTimes[0]; // Set the first available time for today
		} else {
			// If today's date is not present, take the first available date
			const firstDate = data[0];
			if (firstDate) {
				this.orderDateTimeData.push({
					date: firstDate.date,
					times: firstDate.times
				});
				this.selectedDate = firstDate.date;
				this.filteredTimes = firstDate.times;
				this.selectedTime = this.filteredTimes[0]; // Set the first available time for the first date
			}
		}
	
		// Map remaining dates, skipping the one already added
		data.forEach((item: OrderDateTime) => {
			if (item.date !== today) {
				const [year, month, day] = item.date.split('-');
				const formattedDate = `${day}/${month}/${year}`;
				this.orderDateTimeData.push({
					date: item.date === today ? "Today" : formattedDate,
					times: item.times
				});
			}
		});
	}
	onDateChange() {
		const selectedDate = this.dateTimeForm.controls['date'].value;
	
		// Ensure orderDateTimeData is an array before calling find()
		if (Array.isArray(this.orderDateTimeData)) {
			const selectedData = this.orderDateTimeData.find(item => item.date === selectedDate);
			
			if (selectedData) {
				this.filteredTimes = selectedData.times;
				this.selectedTime = this.filteredTimes[0]; // Set the first available time
				this.dateTimeForm.controls['time'].setValue(this.selectedTime); // Update form control
			} else {
				this.filteredTimes = []; // Clear if no times found
			}
		} else {
			console.error('orderDateTimeData is not an array or is undefined');
			this.filteredTimes = []; // Clear if orderDateTimeData is not available
		}
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
				// Check if both date and time are selected
				const selectedDate = this.dateTimeForm.controls['date'].value;
				const selectedTime = this.dateTimeForm.controls['time'].value;
				if (selectedDate && selectedTime) {
					// Set the display value correctly with the selected date and time
					this.customerDetailsForm.controls['datePicker'].setValue(`${selectedDate} - ${selectedTime}`);
				} else {
					// If the user cancels or does not select both date and time, reset or keep the existing value
					this.customerDetailsForm.controls['datePicker'].setValue('');
				}
			}
		});
	}

	/* eslint-enable */

	onDeliveryTypeChange() {
		this.customerEntryService.setDeliveryType(this.customerDetailsForm.controls['modeOfDelivery'].value);
	}

	get modeOfDeliveryValue(): string {
        return this.customerDetailsForm.controls['modeOfDelivery'].value;
    }

	// emailFocusOut() {
	// 	if (!this.customerResponse?.customer_data) {
	// 		this.showEmailOptDate = this.customerDetailsForm.get('email').value ? true: false;
	// 		this.customerDetailsForm.patchValue({ emailOptIn: this.showEmailOptDate, emailOptOut: !this.showEmailOptDate });
	// 	} else {
	// 		this.showEmailOptDate = (this.customerDetailsForm.get('email').value && (this.customerResponse?.customer_data?.email != this.customerDetailsForm.get('email').value));
	// 		this.customerDetailsForm.patchValue({ emailOptIn: this.showEmailOptDate, emailOptOut: !this.showEmailOptDate });
	// 	}
		
	// }

	emailFocusOut() {
		this.setEmailValidator(); 
	}

	private setEmailValidator() {
		if (!this.customerResponse?.customer_data) {
			if (this.customerDetailsForm.get('emailOptOut').value) {
				this.customerDetailsForm.get('email').setValidators(null);
				this.customerDetailsForm.get('email').updateValueAndValidity();
			} else {
				this.customerDetailsForm.get('email').setValidators([Validators.required, Validators.email]);
				this.customerDetailsForm.get('email').updateValueAndValidity();
			}
		}
	}

// Function to reset all fields in the form
resetCustomerDetailsForm() {
	this.customerDetailsForm.patchValue({
		cellNumber: false,
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		phoneExt: '',
		// datePicker: '',
		modeOfDelivery: 'delivery',
		emailOptIn: false,
		emailOptOut: false
	}, { emitEvent: false }); // Do not trigger value changes while resetting
}

}
