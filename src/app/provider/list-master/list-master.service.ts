import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ListMasterService {
  data: any
  private myMenuTemp = new BehaviorSubject([]);
  constructor(
    public https: HttpClient
  ) { }

  getMenuDetail() {
    return new Promise(resolve => {
      this.https.get(environment.url + 'setups/app-menu/get_mobile_app_mnu').subscribe({
        next:(data) => {
          this.data = data;
          this.myMenuTemp.next(this.data.data[0].submenu);
          resolve(data);
        },
        error:() => {
          resolve(false);
        }
      });
    });
  }

  getData() {
    return this.myMenuTemp;
  }

  getDashboard(): Observable<any> {
    return this.https.get(environment.url + 'complaints/dash/mobile_app_engineer_dashboard');
  }

  getPmsCount(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/getPmsCategoryCount');
  }

  getPmsAcionableCount(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/getPmsActionableCount');
  }

  getPmsResponsibleCount(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/getPmsResponsibleCount');
  }

  getComplaintSummary(): Observable<any> {
    return this.https.get(environment.url + 'complaints/dash/statusCount');
  }
}
