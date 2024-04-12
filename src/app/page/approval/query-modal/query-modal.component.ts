import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-query-modal',
  templateUrl: './query-modal.component.html',
  styleUrls: ['./query-modal.component.scss'],
})
export class QueryModalComponent  implements OnInit {
  remark!: string;
  isImgUpload!: boolean;
  loading: any;
  formData = new FormData();
  history: any = [];
  approvalType!: string;
  data: any;
  id: any;
  constructor(
    private modalCtrl: ModalController,
    private common: CommonService,
    private httpIndent: IndentsService,
    private loadingController: LoadingController
  ) {

  }

  ngOnInit() {
    if (this.approvalType === 'MR') {
      this.id = this.data.rqst_id;
      this.formData.delete('rqst_id');
      this.formData.append('rqst_id', this.id)
    } else if (this.approvalType === 'PO') {
      this.id = this.data.po_id;
      this.formData.delete('po_id');
      this.formData.append('po_id', this.id)
    } else {
      this.common.presentToast('Invalid Approval Type', 'warning');
    }
    this.getQueryHistory();
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getQueryHistory() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getHistoryQuery(this.id, this.approvalType).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.history = data.data;
          }
        },
        error:() => {
          this.dismissloading();
        },
        complete:() => {
          this.dismissloading();
        }
      })
    });
  }

  submit() {
    if (!this.remark) {
      this.common.presentToast('Remark is Mandatory', 'warning');
      return;
    }
    this.formData.delete('qry_desc');
    this.formData.delete('type');
    this.formData.delete('source');

    this.formData.append('qry_desc', this.remark);
    this.formData.append('type', 'central');
    this.formData.append('source', environment.source);

    this.presentLoading().then(preLoad => {
      this.httpIndent.indentQueryAction(this.formData, this.approvalType).subscribe({
        next:(data) => {
          if (data.status) {
            alert(data.msg);
            this.close(null, true);
          } else {
            alert(data.msg);
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    });
  }

  async openCamera() {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image)
    };
    takePicture();
  }

  async readImg(photo: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    this.formData.delete('document');
    this.formData.append('document', blob, random);
    this.isImgUpload = true;
    this.presentLoading().then(preLoad => {
      this.dismissloading();
    })
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
}
