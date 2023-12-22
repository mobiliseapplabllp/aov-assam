import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { MeterService } from 'src/app/provider/meter/meter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-escalate-to',
  templateUrl: './escalate-to.component.html',
  styleUrls: ['./escalate-to.component.scss'],
})
export class EscalateToComponent  implements OnInit {
  site_id: any;
  userList: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpMeter: MeterService,
    private common: CommonService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    console.log(this.site_id);
    this.getPcUser();
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
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

  getPcUser() {
    this.presentLoading().then(preLoad => {
      this.httpMeter.meterPcWiseUser(this.site_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.userList = data.data
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.common.presentToast(environment.errMsg, 'danger');
          this.dismissloading();
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  submit() {
    console.log(this.userList);
    var selectedArr = this.userList.filter((val: any) => val.isSelect).map((res: any) => res.id);
    if (selectedArr.length === 0) {
      alert('Please Select At least one Employee');
    } else {
      this.close(selectedArr, true);
    }
  }


}
