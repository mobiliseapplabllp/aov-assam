import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  public assignTickets = new BehaviorSubject('');
  constructor(
    public https: HttpClient
  ) { }

  setData(data: any) {
    this.assignTickets.next(data);
  }

  getData() {
    return this.assignTickets;
  }

  getEmpDetail(): Observable<any> {
    return this.https.get(environment.url + 'get_emp_detail');
  }

  getAllTicketStages(): Observable<any> {
    return this.https.get(environment.url + 'complaints/get_all_ticket_stages');
  }

  getTicketStages(): Observable<any> {
    return this.https.get(environment.url + 'complaints/get_ticket_stages');
  }


  getTicketMaster(status: any, page: any): Observable<any> {
    let url;
    if (!status) {
      url = 'limit=10&page=' + page + '&ticket_type=not_resolved';
    } else {
      url = 'limit=10&page='+ page + '&status='+ status;
    }
    return this.https.get(environment.url + 'complaints/get_assign_ticket_master?' + url);
  }

  getResolvedTicket(): Observable<any> {
    return this.https.get(environment.url + 'complaints/get_assign_ticket_master?limit=40&page=1&status=4')
  }

  searchTicketFromServer(key: any, value: any): Observable<any> {
    let url;
    url = 'limit=40&page=1&' + key + '=' + value;
    return this.https.get(environment.url + 'complaints/get_assign_ticket_master?' + url);
  }

  getSpecificTicket(ticket_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/getSpecificTicket/' + ticket_id);
  }

  changePriority(post: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/change_ticket_priority', post);
  }

  submitTicketTransaction(formData: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/submit_transaction', formData);
  }

  getTeam(): Observable<any> {
    return this.https.get(environment.url + 'setups/teams/get_team_members');
  }

  assignedTicket(formData: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/assigned_ticket', formData);
  }

  getIssueType(): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_issue_type');
  }

  getRequestType(id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_tkt_req_type?issue_id=' + id)
  }

  getQueryCategoryTicket(cat_id: any, pc_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_category/' + cat_id + '?pc_id=' + pc_id);
  }

  getQueryCategory(cat_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_category/' + cat_id);
  }

  getQuerySubCat1(qry_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_tkt_subcategory/' + qry_id);
  }

  getQuerySubCat2(qry_id1: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_tkt_subcategory2/' + qry_id1);
  }

  checkTicketConfirm(ticket_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/check_if_ticket_confirm?ticketId=' + ticket_id)
  }

  createTicketAction(form: any) : Observable<any> {
    return this.https.post(environment.url + 'complaints/add_ticket_action', form);
  }

  createMultipleTicketAction(form: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/add_ticket_multiple_action', form);
  }

  getCostCenter() : Observable<any> {
    return this.https.get(environment.url + 'shared/get-user-pc-code');
  }

  getBuildingList(id: any): Observable<any> {
    return this.https.get(environment.url + 'shared/get-buildings-list/' + id);
  }

  getFloorList(id: any): Observable<any> {
    return this.https.get(environment.url + 'shared/get-floors-list/' + id);
  }

  getLocationList(id: any): Observable<any> {
    return this.https.get(environment.url + 'shared/get-locations-list/' + id);
  }


  getCategory(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/category/get_category');
  }

  getScopeOfWork(): Observable<any> {
    return this.https.get(environment.url + 'complaints/getScopeOfWork')
  }

  getClientIdBarcode(clientId: any): Observable<any> {
    const obj = {
      clientAssetID: clientId
    }
    return this.https.post(environment.url + 'complaints/get_client_asset_id_bar_code', obj);
  }

  complaintTypeConfirm(form: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/complaint_type_cfrm', form)
  }

  otpSend(form: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/send_res_otp', form)
  }

  verify_otp(form: any): Observable<any> {
    return this.https.post(environment.url + 'complaints/verify_res_otp', form)
  }

  getEfsr(ticket_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/getEfsrDetails/' + ticket_id);
  }

  getTicketPriority(ticket_id: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/select_ticket_priority?ticket_id=' + ticket_id)
  }

  downLoadEfsrPdf(postData: any, spareCount: number): Observable<any> {
    const obj = {
      data: postData,
      sparePartsCount: spareCount
    }
    return this.https.post(environment.url + 'complaints/downloadEfsrPDF', obj);
  }

  assignTicket(d: any, ticketStatus: any, start: any, lengt: any) {
    return new Promise(resolve => {
      this.https.get(environment.url + '/assigned_ticket1.php?emp_id=' + d.user_id + '&mix_ticket_status=' + ticketStatus +
      '&start=' + start + '&length=' + lengt + '&searching_method=datatable').subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        resolve(false);
      });
    });
  }

  getTicketHistory(dat: any) {
    console.log(dat.ticket_id);
    return new Promise(resolve => {
      this.https.get(environment.url + 'specific_ticket.php?ticket_id=' + dat.ticket_id +
      '&ticket_type=' + dat.product_type).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        resolve(false);
      });
    });
  }

  getMyTicket(pageno: any): Observable<any> {
    return this.https.get(environment.url + 'complaints/get_my_ticket_master?limit=10&page=' + pageno + '&dateWise=loggedBy');
  }

  ticketTransaction(formdata: any) {
    return new Promise(resolve => {
      this.https.post(environment.url + 'submit_ticket_transaction.php', formdata).subscribe(dat => {
        resolve(dat);
      }, err => {
        resolve(false)
      });
    });
  }



  resolveTicket(data: any) {
    return new Promise(resolve => {
      const url = environment.url + 'submit_ticket_transaction.php';
      const option = new HttpParams({fromObject: data});
      this.https.post(url, option).subscribe( dat => {
        console.log(dat);
        resolve(dat);
      }, err => {
        resolve(false);
      });
    });
  }

  escalateTicket(d: any) {
    return new Promise(resolve => {
      const url = environment.url + 'assign_emp_ticket.php';
      const postdata = new FormData();
      postdata.append('assigned_to', d.assigned_to);
      postdata.append('ticket_id', d.ticket_id);
      postdata.append('logged_by', d.logged_by);
      postdata.append('remark', d.remark);
      this.https.post(url, postdata).subscribe( dat => {
        resolve(dat);
      }, err => {
        resolve(false);
      });
    });
  }

  getTeams(empId: any) {
    return new Promise(resolve => {
      this.https.get(environment.url + '/get_teams_mem.php?ticket_id=' + empId).subscribe(data => {
        resolve(data);
      }, err => {
        resolve(false);
      });
    });
  }

  sentOtp(mobile: any) {
    return new Promise(resolve => {
      this.https.get(environment.url + '/customer_send_otp.php?mobile=' + mobile + '&type=mobile').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  verifyOtp(mobile: any, otp: any) {
    return new Promise(resolve => {
      this.https.get(environment.url + '/customer_verify_otp.php?mobile=' + mobile + '&otp=' + otp).subscribe(data => {
        resolve(data);
      }, err => {
        resolve(false);
      });
    });
  }
}
