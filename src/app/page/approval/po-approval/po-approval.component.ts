import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';
import { QueryModalComponent } from '../query-modal/query-modal.component';

@Component({
  selector: 'app-po-approval',
  templateUrl: './po-approval.component.html',
  styleUrls: ['./po-approval.component.scss'],
})
export class PoApprovalComponent  implements OnInit {
  pendingPO: any = [];
  segmentStatus = 'pending';
  loading: any;
  page = 1;
  PoHistory: any = [];
  constructor(
    private httpIndent: IndentsService,
    private alertController: AlertController,
    private common: CommonService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getApprovalList();
  }

  getApprovalList() {
    this.pendingPO = this.httpIndent.getLocalApproval('po_approvals');
  }

  changeSegment(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value === 'completed' && this.PoHistory.length === 0) {
      this.getPoHistory();
    }
  }

  getPoHistory() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getPOHistory(this.page).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.PoHistory = [...this.PoHistory, ...data.data.data];
            this.page = this.page + 1;
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  loadData(event: any) {
    event.target.complete();
    this.getPoHistory();
  }

  async presentAlertConfirm(type: number, msg: string, data: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: msg + '?',
      message: 'are you sure want to ' + msg + ' this PO?',
      mode: 'ios',
      inputs: [{
        name: 'remark',
        type:'textarea',
        placeholder: 'Enter Remarks',
      }],
      buttons: [{
        text: 'Cancel',
          handler: (data) => {
            console.log("Cancel");
          }
        },{
          text: 'YES',
          handler: (app) => {
            data.remark = app.remark;
            data.status = type;
            this.actionPO(data)
          }
        }]
    });
    await alert.present();
  }

  actionPO(data: any) {
    if (!data.remark) {
      this.common.presentToast('Please Enter Remark', 'warning');
      return;
    }
    const formData = new FormData();
    formData.append('remark' ,data.remark);
    formData.append('rel_id' ,data.rel_id);
    formData.append('status' ,data.status);
    this.presentLoading().then(res => {
      this.httpIndent.actionPO(formData).subscribe({
        next:(res) => {
          if (res.status) {
            this.pendingPO = this.pendingPO.filter((val: any) => val.rel_id != data.rel_id);
            this.common.presentToast(res.msg, 'success');
          } else {
            this.common.presentToast(res.msg, 'warning');
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
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  openDoc(url: string) {
    this.common.openDoc(url);
  }

  async openModal(data: any) {
    const modal = await this.modalCtrl.create({
      component: QueryModalComponent,
      cssClass: 'my-modal2',
      componentProps: {
        approvalType: 'PO',
        data: data
      }
    });
    modal.present();
  }
}
