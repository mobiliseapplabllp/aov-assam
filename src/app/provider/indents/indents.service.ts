import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
@Injectable({
  providedIn: 'root'
})
export class IndentsService {
  allApproval: any = [];
  constructor(
    private https: HttpClient,
    private common: CommonService
  ) { }

  getWarehousePc(pd_id: any): Observable<any> {
    return this.https.get(environment.url + 'setups/organisation/get_warehouse_by_pc?pc_id=' + pd_id);
  }

  // getPendingData(data): Observable<any> {
  //   let param = new HttpParams();
  //   for (const key in data) {
  //     if (data[key] !== '' && data[key] !== undefined && data[key] !== null) {
  //       param = param.append(key, data[key]);
  //     }
  //   }
  //   return this.http.get<any>(
  //     `${environment.apiUrl}/learning/get_pending_emp`,
  //     {
  //       params: param,
  //     }
  //   );
  // }

  getMaterial(obj: any): Observable<any> {
    let param = new HttpParams();
    for (const key in obj) {
      if (obj[key]) {
        param = param.append(key, obj[key]);
      }
    }
    return this.https.get(environment.url + 'purchase/settings/select_material', { params: param});
  }

  getUom(): Observable<any> {
    return this.https.get(environment.url + 'purchase/settings/select_uom');
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

  getApproval(){
    return new Promise(resolve => {
      this.https.get(environment.url + 'dashboard/get_approvals').subscribe({
        next:(data: any) => {
          if (data.status) {
            this.allApproval = data.data;
          }
        },
        error:() => {
          this.common.presentToast(environment.errMsg, 'danger');
          resolve(false);
        },
        complete:() => {
          resolve(true);
        }
      })
    })
  }

  getLocalApproval(type: string) {
    return this.allApproval[type];
  }

  getIndentHistory(page: number): Observable<any> {
    return this.https.get(environment.url + 'purchase/mtrl_request/get_mtrl_req_appr_hsty?page=' + page +'&limit=10');
  }

  getPOHistory(page: number): Observable<any> {
    return this.https.get(environment.url + 'purchase/pur_order/get_po_appr_hsty?page=' + page +'&limit=10');
  }

  actionIndent(formData: any): Observable<any> {
    return this.https.post(environment.url + 'dashboard/mr_approve_action', formData);
  }

  actionPO(formData: any): Observable<any> {
    return this.https.post(environment.url + 'dashboard/po_approve_action', formData);
  }

  indentQueryAction(formData: any, approvalType: string): Observable<any> {
    let url: string
    if (approvalType == 'MR') {
      url  = environment.url + 'purchase/mtrl_request/add_mtrl_rqst_query';
    } else {
      url =  environment.url + 'purchase/pur_order/add_po_query'
    }
    return this.https.post(url,  formData);
  }

  getHistoryQuery(id: any, approvalType: string): Observable<any> {
    let url: string;
    if (approvalType == 'MR') {
      url  = environment.url + 'purchase/mtrl_request/get_mtrl_rqst_query/' + id;
    } else {
      url = environment.url + 'purchase/pur_order/get_po_query/' + id;
    }
    return this.https.get(url);
  }
}
