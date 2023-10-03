import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DigitalChecklistService {
  baseurl = environment.url;
  constructor(
    private http: HttpClient
  ) { }

  getSchedule(): Observable<any> {
    return this.http.get(this.baseurl + 'digicheck/get_scheduled_calender?limit=10&page=1');
  }

  getScheduleHistory(date: any): Observable<any> {
    return this.http.get(this.baseurl + 'digicheck/get_scheduled_calender?date=' + date);
  }

  verifyAssetByQr(obj: any): Observable<any> {
    return this.http.post(this.baseurl + 'digicheck/verifyAssetDcByQr', obj);
  }

  getSceduleMissed(loc_id: any): Observable<any> {
    return this.http.get(this.baseurl + 'digicheck/get_scheduled_calender?qr_loc_id=' + loc_id +  '&on_behalf=1')
  }

  getScheduleQuestion(schedule_id: any): Observable<any> {
    return this.http.get(this.baseurl + 'digicheck/get_schedule_questions/' + schedule_id)
  }

  scheduleResponseAction(formData: any): Observable<any> {
    return this.http.post(this.baseurl + 'digicheck/schedule_response_action', formData);
  }

  schuleRemarkAction(formData: any): Observable<any> {
    return this.http.post(this.baseurl + 'digicheck/schedule_response_action_rem', formData);
  }

  scheduleDocAction(formData: any): Observable<any> {
    return this.http.post(this.baseurl + 'digicheck/schedule_response_action_doc', formData)
  }

  finalSubmitCheckList(formData: any): Observable<any> {
    return this.http.post(this.baseurl + 'digicheck/update_schedule_status', formData)
  }
}
