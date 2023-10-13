import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pm-assign',
  templateUrl: './pm-assign.component.html',
  styleUrls: ['./pm-assign.component.scss'],
})
export class PmAssignComponent  implements OnInit {
  allTeamMember: any = [];
  user_id!: string;
  data: any;
  work_order: any = [];
  loading: any;
  constructor(
    private httpPms: PmCalService,
    private loadingController: LoadingController,
    private common: CommonService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.length) {
        for (var i = 0 ; i < this.data.length; i++) {
          this.work_order.push(this.data[i]);
        }
      } else {
        this.work_order.push(this.data);
      }
    }
    console.log(this.work_order);

    this.getAllEmp();
  }


  getAllEmp() {
    this.presentLoading().then(preLoad => {
      this.httpPms.getAllEmployee().subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allTeamMember = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
      });
    });

  }

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  submit(dat: any) {
    const obj = {
      user_id: dat.value,
      workorderData: this.work_order,
      source: environment.source
    }
    console.log(obj);
    this.presentLoading().then(preLoad => {
      this.httpPms.assignPm(obj).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.common.presentToast(data.msg, 'success');
          // this.assignPmCal.next(this.work_order);
          this.httpPms.setData(this.work_order);
          this.closeModal(null, true);
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
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
    if (this.loading) {
      this.loading.dismiss();
    }
  }

}
