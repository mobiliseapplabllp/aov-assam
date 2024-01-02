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
  // https://dialogflow.googleapis.com/v2/projects/orderpizza-cobx/agent/sessions
  private baseURL = 'https://dialogflow.googleapis.com/v2/projects/orderpizza-cobx/agent/sessions/1234:detectIntent';
  private token = 'AIzaSyDJjHphpheVQM7CRYNqHHdJqMqAgt0IY70';
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

  sendMessage(message: string) {
    const data = {
      queryInput: {
        text: {
          text: message,
          languageCode: 'en',
        },
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    return this.https.post(this.baseURL, data , {headers});
  }


}
