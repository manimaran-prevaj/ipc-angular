import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryModeService {
  private deliveryModeSource = new BehaviorSubject<string>('delivery');
  deliveryMode$ = this.deliveryModeSource.asObservable();

  setDeliveryMode(mode: string) {
    this.deliveryModeSource.next(mode);
  }
}