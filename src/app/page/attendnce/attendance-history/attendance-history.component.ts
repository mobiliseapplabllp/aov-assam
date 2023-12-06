import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AttendanceService } from 'src/app/provider/attendance/attendance.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { CostCenterComponent } from 'src/app/shared/cost-center/cost-center.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss'],
})
export class AttendanceHistoryComponent  implements OnInit {
  currentMonth: any;
  myAttendance: any = [];
  months: any = [
    {month: 'January', value: '01'},
    {month: 'February', value: '02'},
    {month: 'March', value: '03'},
    {month: 'April', value: '04'},
    {month: 'May', value: '05'},
    {month: 'June', value: '06'},
    {month: 'July', value: '07'},
    {month: 'August', value: '08'},
    {month: 'September', value: '09'},
    {month: 'October', value: '10'},
    {month: 'November', value: '11'},
    {month: 'December', value: '12'},
  ];
  loading: any;
  result: any = [];
  costCenter: any;
  pc_id: any;
  constructor(
    private httpAttendance: AttendanceService,
    private httpCommon: CommonService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  ionViewDidLeave() {
    this.dismissloading();
  }

  ionViewDidEnter() {
    // this.getAttendance(this.currentMonth);
  }

  getAttendance() {
    if (!this.pc_id || !this.currentMonth) {
      return;
    }
    this.presentLoading().then(load => {
      this.httpAttendance.getAttendanceHistory(this.currentMonth, this.pc_id).subscribe(data => {
        this.dismissloading();
        this.result = data;
        if (this.result.status == true) {
          this.myAttendance = this.result.data;
          if (this.myAttendance.length === 0) {
            this.httpCommon.presentToast('No Data Found', 'warning');
          }
        } else if (this.result.status == false) {
          this.httpCommon.presentToast(this.result.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissloading() {
    this.loading.dismiss();
  }

  expand(data: any, index: any) {
    data.isView = !data.isView ;
  }

  viewDoc(img: any) {
    this.httpCommon.openDoc(img);
  }

  async openRoName() {
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.costCenter = disModal.data.label;
        this.pc_id = disModal.data.value;
        this.getAttendance();
      }
    });
    return await modal.present();
  }

}
