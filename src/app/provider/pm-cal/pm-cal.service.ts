import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PmCalService {
  insDataTemp: any = [];
  data: any;
  public assignPmCal = new BehaviorSubject([]);
  constructor(
    public https: HttpClient,
  ) { }

  setData(data: any) {
    this.assignPmCal.next(data);
  }

  getData() {
    return this.assignPmCal;
  }


  getPm(stage_id: any, current_page: any): Observable<any> {
    return this.https.get(environment.url + 'pmscal/get_work_order?limit=20&page=' + current_page + '&stage_id=' + stage_id + '&shource_from=app');
  }

  searchTicketFromServer(key: any, value: any): Observable<any> {
    let url;
    url = 'limit=40&page=1&' + key + '=' + value + '&shource_from=app';
    return this.https.get(environment.url + 'pmscal/get_work_order?' + url);
  }


  getScheduleQuestion(wo_id: any): Observable<any> {
    return this.https.get(environment.url + 'pmscal/schedule/get_schedule_questions/' + wo_id);
  }

  getScheduleUser(wo_id: any): Observable<any> {
    return this.https.get(environment.url + 'pmscal/schedule/get_schedule_details_usr/' + wo_id)
  }

  updateUserAction(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/update_user_action', formData)
  }

  verifyBarcode(barcode: any, sid: any) {
    return this.https.get(environment.url + 'verify_pms_barcode_sales.php?barcode_no=' + barcode + '&schedule_id=' + sid);
  }

  getAllEmployee(): Observable<any> {
    return this.https.get(environment.url + 'setups/teams/get_team_members');
  }

  getAssets(wo_id: any): Observable<any> {
    return this.https.get(environment.url + 'pmscal/schedule/get_assets/' + wo_id);
  }

  assignPm(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/assign_work_order_to_team', formData);
  }

  getPmsConfig(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/get_pms_config?id=1');
  }

  getCostCenter(): Observable<any> {
    return this.https.get(environment.url + 'shared/get-user-pc-code');
  }

  getChecklist(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/checklist_dropdown');
  }

  workOrderAction(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/create_work_order_action', formData);
  }

  myWo(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/get_My_work_order?limit=10&page=1');
  }

  uploadPtw(formdata: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/uploadPTW', formdata);
  }
  // assignPmCal(teamMem, scheduleID, empID) {
  //   return new Promise(resolve => {
  //     const url = environment.url + 'assign_pm_cal.php';
  //     const postdata = new FormData();
  //     postdata.append('team_member', teamMem);
  //     postdata.append('schedule_id', scheduleID);
  //     postdata.append('emp_id', empID);
  //     this.https.post(url, postdata).subscribe(data => {
  //       resolve(data);
  //     }, err => {
  //       alert(JSON.stringify(err));
  //       resolve(false);
  //     });
  //   });
  // }

  resolvePmCal(remarks: any, ticketInfo: any, empID: any, img: any, completionDate: any) {
    return new Promise(resolve => {
      const url = environment.url + 'update_pm_callibration_status.php';
      const postdata = new FormData();
      postdata.append('emp_id', empID.user_id);
      postdata.append('schedule_id', ticketInfo.schedule_id);
      postdata.append('completion_date', completionDate);
      postdata.append('status', remarks.status);
      postdata.append('remark', remarks.remark);
      postdata.append('img', img);
      this.https.post(url, postdata).subscribe(data => {
        resolve(data);
      }, err => {
        resolve(false);
      });
    });
  }

  getPmReportCategory(): Observable<any> {
    return this.https.get(environment.url + 'pmsMainCategory.php')
  }

  getPmReportQuestion(cat_id: any, emp_id: any, work_order_id: any) {
    return this.https.get(environment.url + 'pmsCategoryQuestion.php?category_id=' + cat_id + '&loggedin_user=' + emp_id + '&work_order_id=' + work_order_id);
  }

  scheduleResponseAction(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/schedule_response_action', formData);
  }

  scheduleResponseActionRem(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/schedule_response_action_rem', formData);
  }

  scheduleResponseActionDoc(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/schedule_response_action_doc', formData);
  }

  checkListCategoryStatus(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/chklist_catgry_status', formData);
  }

  updateCheckListAsset(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/update_chklist_asset', formData);
  }

  finalSubmitCheckList(formData: any): Observable<any> {
    return this.https.post(environment.url + 'pmscal/schedule/update_schedule_status', formData);
  }




  // savePmsQuestion(data, wo, emp_id, questionAttachment) {
  //   return new Promise(resolve=>{
  //     var url = environment.url + "/pmsSaveQuestion.php";
  //     let postdata = new FormData();
  //     postdata.append('workorderid', wo);
  //     postdata.append('loggedin_user', emp_id);
  //     postdata.append('data',JSON.stringify(data));
  //     postdata.append('attachment',questionAttachment);
  //     // postdata.append('data', data);
  //     this.https.post(url,postdata).subscribe(data=>{
  //       resolve(data);
  //     },err=>{
  //       console.log(err);
  //       resolve(false);
  //     })
  //   })
  // }

  getOtherCategory() : Observable<any> {
    return this.https.get(environment.url + 'otherCategory.php')
  }

  saveOtherWork(data: any): Observable<any> {
    var url = environment.url + "/saveOtherCategory.php";
    let postdata = new FormData();
    for (let key in data) {
      postdata.append(key, data[key]);
    }
    return this.https.post(url,postdata);
  }

  submitFinalPmsReport(emp_id: any, workorder: any){
    return new Promise(resolve => {
      var url = environment.url + '/final_pms_fill_report.php';
      let postdata = new FormData();
      postdata.append('loggedin_user', emp_id);
      postdata.append('work_order_id', workorder);
      this.https.post(url, postdata).subscribe(dat => {
        resolve(dat);
      }, err => {
        resolve(false);
      });
    });
  }
}
