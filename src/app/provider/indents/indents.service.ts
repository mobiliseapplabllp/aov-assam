import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IndentsService {

  constructor(
    private https: HttpClient
  ) { }

  getWarehousePc(pd_id: any): Observable<any> {
    return this.https.get(environment.url + 'setups/organisation/get_warehouse_by_pc?pc_id=' + pd_id);
  }

  getMaterial(): Observable<any> {
    return this.https.get(environment.url + 'purchase/settings/select_material');
  }

  getPartCode() {
    return new Promise(resolve => {
      this.https.get(environment.url + 'get_item_master.php').subscribe({
        next:(data) => {
          resolve(data)
        },
        error:() => {
          resolve(false);
        }
      });
    });
  }

  submitIndent(formData: any): Observable<any> {
    return this.https.post(environment.url + 'purchase/mtrl_request/add_mtrl_request', formData);
  }

  getEmpSearch(emp_id: any): Observable<any> {
    const obj = {
      key: emp_id
    }
    return this.https.post(environment.url + 'emp_search', obj);
  }

  getMyIndent(page: any, status: any): Observable<any> {
    let posturl;
    posturl = 'limit=10&page=' + page + '&is_excel=0&type=my-indent&status=' + status
    return this.https.get(environment.url + 'purchase/mtrl_request/get_mtrl_request_master?' + posturl)
  }

  cancelIndent(data: any): Observable<any> {
    return this.https.post(environment.url + 'purchase/mtrl_request/cancel_mtrl_request', data);
  }
}
