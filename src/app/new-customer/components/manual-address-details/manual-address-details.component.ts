import { Component, Inject, Input, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { provinceOptions } from "./../../../../mockdata/static-copy.js";
import { ProvinceOptions } from "../models/customer-entry.model";
import { MAT_DIALOG_DATA, MatDialogTitle,MatDialogContent,MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-manual-address-details',
  templateUrl: './manual-address-details.component.html',
  styleUrl: './manual-address-details.component.scss',
})


export class ManualAddressDetailsComponent  implements OnInit{
  
  public addressDetailsForm: FormGroup;
  public provinceOptions: ProvinceOptions[] = provinceOptions;
  public locations = [{rAdd:'Store #232 woodbrodge, 7694 Islington Avenue1',rLoc:'Islington Avenuȩ, west of medowvale at Dean park1',
    rIntersection:'Morningside drive and medowvale road1',rAddHelp:'The hasty market is in the same place at store1'},
    {rAdd:'Store #232 woodbrodge, 7694 Islington Avenue2',rLoc:'Islington Avenuȩ, west of medowvale at Dean park2',
      rIntersection:'Morningside drive and medowvale road2',rAddHelp:'The hasty market is in the same place at store2'},
      {rAdd:'Store #232 woodbrodge, 7694 Islington Avenue3',rLoc:'Islington Avenuȩ, west of medowvale at Dean park3',
        rIntersection:'Morningside drive and medowvale road3',rAddHelp:'The hasty market is in the same place at store3'}];
  public showAddressInfo = false;
  public selectedRestaurant:any = null;
  public checkedIndex =-1;

  @Input() deliveryType = 'delivery';

  
  constructor(
		private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    
console.log(this.data);
  }

  onProvinceChange(event){

  }
  onLocationChange(event: any, location: any, index:any){
if(event.checked){
this.showAddressInfo = true;
this.selectedRestaurant = location;
this.checkedIndex = index;
} else {
  this.showAddressInfo = false;
  this.selectedRestaurant = null;
this.checkedIndex =-1
}
  }
}
