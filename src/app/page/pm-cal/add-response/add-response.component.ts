import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss'],
})
export class AddResponseComponent  implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  public addResponse!: FormGroup;
  correctiveArray: any = [];
  requestedData: any = [];
  attachment: any;
  formData = new FormData();
  loading: any;
  maxDate = moment().format('YYYY-MM-DD');
  isImgUpload!: boolean;
  createAt: any;
  newDate: any;
  constructor(
    private formbuilder: FormBuilder,
    private modalCtrl: ModalController,
    private httpCommon: CommonService,
    private httpPms: PmCalService,
    private loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    this.initializeForm();
    console.log(this.requestedData);
    console.log(this.createAt);
    this.newDate = moment(this.createAt).format('YYYY-MM-DD');
    console.log(this.newDate);
    this.correctiveArray = this.requestedData.options
  }

  initializeForm() {
    this.addResponse = this.formbuilder.group({
      rspns_id: [this.requestedData.rspns_id],
      q_id: [this.requestedData.q_id],
      corrective_action: ['', Validators.required],
      rspns_date: ['' , Validators.required],
      remark: ['', Validators.required],
    });
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  submit() {
    if (!this.isImgUpload) {
      this.httpCommon.presentToast('Attachment is Required', 'warning');
      return;
    }
    for (let key in this.addResponse.value) {
      this.formData.delete(key);
      this.formData.append(key, this.addResponse.value[key]);
    }
    this.presentLoading().then(preLoad => {
      this.httpPms.updateUserAction(this.formData).subscribe(dat => {
        console.log(dat);
        this.dismissloading();
        if (dat.status) {
          this.httpCommon.presentToast(dat.msg, 'success');
          this.close(null, true)
        } else {
          this.httpCommon.presentToast(dat.msg, 'warning');
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

  setDocInQuestion(event: any): void {
    if (event.target.files.length > 0) {
      const file1 = event.target.files[0];
      this.attachment = file1;
    }
  }

  changeDate() {
    this.popoverDatetime.confirm(true);
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
    this.isImgUpload = true;
    this.formData.delete('artifact');
    this.formData.append('artifact', blob, random);
    this.presentLoading().then(preLoad => {
      setTimeout(() => {
        this.dismissloading();
      }, 500);
    })
  }

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Choose option',
  //     cssClass: 'my-custom-class',
  //     buttons: [{
  //       text: 'Camera',
  //       icon: 'camera-outline',
  //       handler: () => {
  //         this.photoOption(this.camera.PictureSourceType.CAMERA);
  //       }
  //     }, {
  //       text: 'Gallery',
  //       icon: 'albums-outline',
  //       handler: () => {
  //         this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  // photoOption(src) {
  //   const options: CameraOptions = {
  //     quality: 60,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     sourceType: src,
  //     correctOrientation: true
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.convertImageToFile(imageData);
  //   }, (err) => {
  //     alert(JSON.stringify(err));
  //   });
  // }

  // convertImageToFile(imageData) {
  //   this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
  //     entry.file(file => {
  //       console.log(file);
  //       setTimeout(() => {
  //         this.read(file);
  //       }, 500);
  //     });
  //   }, err => {
  //     alert(JSON.stringify(err) + 'File Not Supported');
  //   });
  // }

  // read(file) {
  //   let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg';
  //   const reader = new FileReader();
  //   reader.readAsArrayBuffer(file);
  //   reader.onload = () => {
  //     const blob = new Blob([reader.result], {
  //       type: file.type,
  //     });
  //     this.isImgUpload = true;
  //     this.formData.delete('artifact');
  //     this.formData.append('artifact', blob, random);
  //     this.presentLoading().then(preLoad => {
  //       setTimeout(() => {
  //         this.dismissloading();
  //       }, 500);
  //     })
  //   };
  // }


}
