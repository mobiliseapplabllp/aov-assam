import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';

@Component({
  selector: 'app-stand-by-release',
  templateUrl: './stand-by-release.component.html',
  styleUrls: ['./stand-by-release.component.scss'],
})
export class StandByReleaseComponent  implements OnInit {
  ticketRemarkArr: any  = [];
  loading: any;
  public forms!: FormGroup;
  isImgUpload!: boolean
  formData = new FormData();
  tkts_id: any;
  constructor(
    private formbuilder: FormBuilder,
    private common: CommonService,
    private loadingController: LoadingController,
    private httpComplaint: ComplaintService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.initForm();
    // this.getTicketRemark();
  }

  initForm() {
    this.forms = this.formbuilder.group({
      // ticket_remark: ['', Validators.required],
      problem_reported: ['', Validators.required],
      action_taken: ['', Validators.required],
      ticketId: [this.tkts_id],
      source: [environment.source]
    });
  }

  getTicketRemark() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getTicketRemark(this.tkts_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.ticketRemarkArr = data.data;
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
    this.formData.delete('img[]');
    this.formData.append('img[]', blob, random);
    this.isImgUpload = true;
    this.presentLoading().then(preLoad => {
      this.dismissloading();
    })
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

  submitAction() {
    for (var key in this.forms.value) {
      this.formData.delete(key);
      this.formData.append(key, this.forms.value[key]);
    }
    this.presentLoading().then(preLoad => {
      this.httpComplaint.standByActionRelease(this.formData).subscribe({
        next:(data) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.close(null, true);
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

}
