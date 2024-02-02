import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-close-pms',
  templateUrl: './close-pms.component.html',
  styleUrls: ['./close-pms.component.scss'],
})
export class ClosePmsComponent  implements OnInit {
  data: any;
  remark!: string;
  formData = new FormData();
  loading: any;
  imageName!: string;
  constructor(
    private loadingController: LoadingController,
    private common: CommonService,
    private httpPms: PmCalService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  submit() {
    if (!this.remark) {
      this.common.presentToast('Remark is Compulsory', 'warning');
      return;
    }
    this.formData.delete('remark');
    this.formData.append('remark', this.remark);
    this.presentLoading().then(preLoad => {
      this.httpPms.closeAction(this.formData).subscribe({
        next:(dat) => {
          if (dat.status) {
            this.common.presentToast(dat.msg, 'success');
            this.close(this.data, true);
          } else {
            this.common.presentToast(dat.msg, 'warning');
          }
        },
        error:() => {

          this.dismissLoading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissLoading();
        }
      })
    })
  }

  async presentActionSheet() {
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
    this.formData.delete('photo');
    this.formData.append('photo', blob, random);
    this.imageName = random
    this.presentLoading().then(preLoad => {
      this.dismissLoading();
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status)
  }


}
