import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MeterService {

  constructor(
    private http: HttpClient
  ) { }

  getMeterType() : Observable<any> {
    return this.http.get(environment.url + 'meter/meter-type');
  }

  getUomMeter(): Observable<any> {
    return this.http.get(environment.url + 'meter/meter-uom-all');
  }

  meterPcWiseUser(pc_id: any): Observable<any> {
    return this.http.get(environment.url + 'meter/meter-pc-wise-users/' + pc_id);
  }

  addMeter(formData: any): Observable<any> {
    return this.http.post(environment.url + 'meter/add-meter-aman', formData)
  }

  getPendingWo(): Observable<any> {
    return this.http.get(environment.url + 'meter/ifms/get-pending-work-order');
  }

  getPendingWoBarcode(url: string): Observable<any> {
    return this.http.get('https://hr-access.herokuapp.com/' + url);
  }

  updateReading(formData: any): Observable<any> {
    return this.http.post(environment.url + 'meter/ifms/add-reading', formData);
  }

  getMeterWoHistory(date: any): Observable<any> {
    return this.http.get(environment.url + 'meter/ifms/get-complete-work-order?date=' + date);;
  }
}
