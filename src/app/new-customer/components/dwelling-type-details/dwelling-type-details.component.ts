import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Instructions } from "../models/customer-entry.model";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
	selector: 'app-dwelling-type-details',
	templateUrl: './dwelling-type-details.component.html',
	styleUrls: ['./dwelling-type-details.component.scss']
})

export class DwellingTypeDetailsComponent implements OnChanges {
	@Input() selectedDwellingType: string;

	public dwellingTypeDetailsForm: FormGroup;
	public instructionsOptions: Instructions[] = [
		{
			text: 'Front Door',
			value: 'frontDoor'
		},
		{
			text: 'Back Door',
			value: 'backDoor'
		}
	]

	constructor(
		private formBuilder: FormBuilder
	) {
		this.dwellingTypeDetailsForm = this.formBuilder.group({
			type: [''],
			instructions: ['']
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.dwellingTypeDetailsForm.reset();
		this.createForm(changes['selectedDwellingType']?.currentValue);
	}

	createForm(dwellingType: string) {
		this.dwellingTypeDetailsForm = this.formBuilder.group({
			type: [dwellingType],
			instructions: ['']
		});

		const controlConfigurations: Record<string, string[]> = {
			'apartment': ['aptNumber', 'buzzerNumber'],
			'condo': ['aptNumber', 'buzzerNumber'],
			'townHouse': ['unitNumber'],
			'plex': ['unitNumber'],
			'mobilePark': ['siteNumber'],
			'hotel': ['roomNumber', 'guestName', 'alternativeNumber'],
			'hospital': ['wingName', 'floorNumber'],
			'business': ['businessName', 'alternativePhoneNumber'],
			'university': ['hallName'],
			'college': ['hallName']
		};

		const controlsToAdd = controlConfigurations[dwellingType] || [];

		controlsToAdd.forEach(controlName => {
			this.dwellingTypeDetailsForm.addControl(controlName, this.formBuilder.control(''));
		});
	}


	onlyNumber(event) {
		const ASCIICode = (event.which) ? event.which : event.keyCode
		if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
			return false;
		}
		return true;
	}


	onInstructionsChange(event) {
		console.log(event);
		console.log(this.dwellingTypeDetailsForm.value);
	}

}
