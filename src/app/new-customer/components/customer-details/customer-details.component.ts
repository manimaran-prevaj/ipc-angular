import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CCCModalComponent } from "../../../common/ccc-modal/ccc-modal.component";
import { CustomerEntryService } from "../../services/customer-entry.service";
import { select, Store } from '@ngrx/store';
import { loadCustomerDetails } from "../../../common/store/actions/customer-details.actions";
import { ApiResponse} from "../../models/customer-details";


// TODO:: Order date and time to be obtained from BE API
import { orderDateTime } from '../../../../mockdata/future-datetime.js';
import { OrderDateTime } from "../../models/customer-entry.model";
import { selectCustomerProfile } from "../../../common/store";


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
	public currenDate = new Date().toDateString().split(' ').splice(1).join(' ');
	public customerResponse: ApiResponse;
	public showEmailOptDate = false;
	

	constructor(
		private formBuilder: FormBuilder,
		public dialog: MatDialog,
		private customerEntryService: CustomerEntryService,
		private store: Store
	) { }

	ngOnInit() {
		this.store.pipe(select(selectCustomerProfile)).subscribe(x=>{
			const data: any = x;
			this.customerResponse = data?.customerDetails?.customerProfile as ApiResponse;
			if (this.customerResponse) {
				this.customerDetailsForm.patchValue({firstName:this.customerResponse.customer_data.first_name,
					lastName : this.customerResponse.customer_data.last_name,
					email:this.customerResponse.customer_data.email,
					emailOptIn: this.customerResponse.customer_data.email?true:false
				})
		}
			
		});

		this.selectedOption = '';
		this.mapOrderDateTime(orderDateTime as []);
		this.dateTimeForm = this.formBuilder.group({
			date: ['Today', [Validators.required]],
			time: ['Now', [Validators.required]]
		});
		const todayDateTime = `${this.getTodayDate()} - Today - Now`;
		this.customerDetailsForm = this.formBuilder.group({
			cellNumber: [false],
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

		
		// this.customerDetailsForm.controls['phone'].valueChanges
		// .pipe(debounceTime(300))
		// .subscribe(value => {
		// 	if (value) {
		// 		// Remove brackets, hyphens, and other non-numeric characters
		// 		//eslint-disable-next-line
		// 		const sanitizedValue = value.replace(/[\(\)\-\s]/g, '');
		// 		if (sanitizedValue.length === 10) {
		// 			this.store.dispatch(loadCustomerDetails({ phone: sanitizedValue }));
		// 			this.showEmailOptDate = false;
		// 			this.customerDetailsForm.patchValue({
		// 				firstName: '', lastName: '', email: '', emailOptIn: false,
		// 				emailOptOut: false, modeOfDelivery: 'delivery', cellNumber: false, phoneExt: '', datePicker: todayDateTime
		// 			});
		// 		}
		// 	}
		// });
	}

		// Handle keydown event on phone input field
		onPhoneKeyDown(event: KeyboardEvent) {
			if (event.key === 'Tab' || event.key === 'Enter') {
				const value = this.customerDetailsForm.controls['phone'].value;
				//eslint-disable-next-line
				const sanitizedValue = value.replace(/[\(\)\-\s]/g, '');
				if (sanitizedValue.length === 10) {
					this.store.dispatch(loadCustomerDetails({ phone: sanitizedValue }));
					this.showEmailOptDate = false;
					this.customerDetailsForm.patchValue({
						firstName: '', lastName: '', email: '', emailOptIn: false,
						emailOptOut: false, modeOfDelivery: 'delivery', cellNumber: false, phoneExt: '', datePicker: this.getTodayDate()
					});
				}
			}
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
		this.customerEntryService.setDeliveryType(this.customerDetailsForm.controls['modeOfDelivery'].value);
	}

	emailFocusOut() {
		if (!this.customerResponse?.customer_data) {
			this.showEmailOptDate = this.customerDetailsForm.get('email').value;
			this.customerDetailsForm.patchValue({ emailOptIn: this.showEmailOptDate });
		} else {
			this.showEmailOptDate = (this.customerResponse?.customer_data?.email != this.customerDetailsForm.get('email').value);
			this.customerDetailsForm.patchValue({ emailOptIn: true });
		}
		
	}

}
