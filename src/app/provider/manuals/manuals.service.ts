import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ManualsService {

  constructor(
    public https: HttpClient
  ) { }

  getManualMaster(forms: any): Observable<any> {
    let param = new HttpParams();
    for (const key in forms) {
      if (forms[key] !== '' && forms[key] !== undefined && forms[key] !== null) {
        param = param.append(key, forms[key]);
      }
    }
    param = param.append('limit', '20');
    param = param.append('page', '1');
    return this.https.get(environment.url + 'setups/master-data/manual-master' , {params: param});
  }

  getCategoryDropdown(): Observable<any> {
    return this.https.get(environment.url + 'setups/master-data/health-safety-cat-dropdown')
  }

  getHns(forms: any): Observable<any> {
    let param = new HttpParams();
    for (const key in forms) {
      if (forms[key] !== '' && forms[key] !== undefined && forms[key] !== null) {
        param = param.append(key, forms[key]);
      }
    }
    param = param.append('limit', '30');
    param = param.append('page', '1');
    return this.https.get(environment.url + 'setups/master-data/health-safety-master', {params: param})
  }
}
