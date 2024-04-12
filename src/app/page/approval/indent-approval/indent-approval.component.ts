import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';
import { QueryModalComponent } from '../query-modal/query-modal.component';

@Component({
  selector: 'app-indent-approval',
  templateUrl: './indent-approval.component.html',
  styleUrls: ['./indent-approval.component.scss'],
})
export class IndentApprovalComponent  implements OnInit {
  segmentStatus = 'pending';
  pendingIndent: any = [];
  loading: any;
  indentHistory: any = [];
  page = 1;
  constructor(
    private httpIndent: IndentsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private common: CommonService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getApprovalList();
  }

  async presentAlertConfirm(type: number, msg: string, data: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: msg + '?',
      message: 'are you sure want to ' + msg + ' this Indent?',
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
            this.actionIndent(data)
          }
        }]
    });
    await alert.present();
  }

  actionIndent(data: any) {
    console.log(data);
    if (!data.remark) {
      this.common.presentToast('Please Enter Remark', 'warning');
      return;
    }
    const formData = new FormData();
    formData.append('approver_remark' ,data.remark);
    formData.append('status' ,data.status);
    formData.append('rel_id' ,data.rel_id);
    this.presentLoading().then(preLoad => {
      this.httpIndent.actionIndent(formData).subscribe({
        next:(res) => {
          if (res.status) {
            this.pendingIndent = this.pendingIndent.filter((val: any) => val.rqst_id != data.rqst_id);
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

  getApprovalList() {
    this.pendingIndent = this.httpIndent.getLocalApproval('mr_approvals');
    console.log(this.pendingIndent);
  }

  changeSegment(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value === 'completed' && this.indentHistory.length === 0) {
      this.getIndentHistory();
    }
  }

  getIndentHistory() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getIndentHistory(this.page).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.indentHistory = [...this.indentHistory, ...data.data.data];
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
    this.getIndentHistory();
  }

  openDoc(url: string) {
    this.common.openDoc(url);
  }

  async openModal(data: any) {
    const modal = await this.modalCtrl.create({
      component: QueryModalComponent,
      cssClass: 'my-modal2',
      componentProps: {
        approvalType: 'MR',
        data: data

      }
    });
    modal.present();
  }

}
