import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';

@Component({
  selector: 'app-ptw-upload',
  templateUrl: './ptw-upload.component.html',
  styleUrls: ['./ptw-upload.component.scss'],
})
export class PtwUploadComponent  implements OnInit {
  loading: any;
  formData = new FormData();
  data: any;
  img_temp!: string;
  doc_temp!: string;
  remark!: string;
  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private common: CommonService,
    private httpPms: PmCalService
  ) { }

  ngOnInit() {}

  closeModal(data:any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  async presentActionSheet() {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
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
    this.formData.delete('attach');
    this.formData.append('attach', blob, random);
    this.img_temp = random;
    this.doc_temp = '';
  }

  changeFile(fileChangeEvent: any){
    const photo = fileChangeEvent.target.files[0];
    this.formData.delete('attach');
    this.formData.append('attach', photo, photo.name);
    this.img_temp = '';
    this.doc_temp = 'Upload';
  }

  uploadPtw() {
    if (!this.remark) {
      alert('Remark is Mandatory');
    } else if (!this.img_temp && !this.doc_temp) {
      alert('Please upload image or Document');
    } else {
      this.formData.delete('id');
      this.formData.delete('remark');
      this.formData.delete('pc_id');
      this.formData.delete('source');

      this.formData.append('id', this.data.id);
      this.formData.append('remark', this.remark);
      this.formData.append('pc_id', this.data.pc_id);
      this.formData.append('source', environment.source);
      this.presentLoading().then(preLoad => {
        this.httpPms.uploadPtw(this.formData).subscribe({
          next:(res) => {
            if (res.status) {
              this.common.presentToast(res.msg, 'success');
              this.closeModal(res, true);
            } else {
              this.common.presentToast(res.msg, 'warning');
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
      });
    }
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
