import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { provinceOptions } from "./../../../../mockdata/static-copy.js";
import { ManualLocation, ProvinceOptions } from "../models/customer-entry.model";

@Component({
  selector: 'app-manual-address-details',
  templateUrl: './manual-address-details.component.html',
  styleUrl: './manual-address-details.component.scss',
})


export class ManualAddressDetailsComponent  implements OnInit{
   
  public addressDetailsForm: FormGroup;
  public provinceOptions: ProvinceOptions[] = provinceOptions;
  public locations : ManualLocation[] = []; 
  public showAddressInfo = false;
  public selectedRestaurant: ManualLocation ; 
  public checkedIndex =-1;

  @Input() deliveryType = 'delivery';

  
  constructor(
		private formBuilder: FormBuilder
	) {
    this.addressDetailsForm = this.formBuilder.group({
			streetNumumber: '',
			StreetExt: '',
      streetName: '',
      city:'',
      province:'',
      postalCode:'',
      aptNumber:'',
      roomNumber:'',
      securityCode:''
		});
  }

  ngOnInit(): void {
    const location: ManualLocation = new ManualLocation();
    location.rAdd = 'Store #232 woodbrodge, 7694 Islington Avenue1';
    location.rLoc = 'Islington Avenuȩ, west of medowvale at Dean park1';
    location. rIntersection = 'Morningside drive and medowvale road1';
    location.rAddHelp = 'The hasty market is in the same place at store1';
    this.locations.push(location);
    this.locations.push(location);
    this.locations.push(location);
  }

  onProvinceChange(event){
console.log(event);
  }
  onLocationChange(event, location, index:number){
if(event.checked){
this.showAddressInfo = true;
this.selectedRestaurant = location;
this.checkedIndex = index;
} else {
  this.showAddressInfo = false;
  this.selectedRestaurant = new ManualLocation();
this.checkedIndex =-1
}
  }
}
