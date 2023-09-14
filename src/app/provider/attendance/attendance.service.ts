import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(
    private http: HttpClient,
  ) { }

  punchInOutAction(data: any) {
    return new Promise(resolve => {
      this.http.post(environment.url + 'shared/save-engineer-attendance', data).subscribe(dat => {
        resolve(dat);
      }, err => {
        resolve(false);
      });
    });
  }

  getAttendanceHistory(month: any, pc_id: any): Observable<any> {
    console.log(month);
    let year =  moment().format('YYYY');
    return this.http.get(environment.url + `shared/get-engineer-attendance?month=${month}&year=${year}&pc_id=${pc_id}`);
  }

  checkTodayAttendance(pc_id: any): Observable<any> {
    return this.http.get(environment.url + 'shared/check-engineer-attendance?pc_id=' + pc_id);
  }
}
