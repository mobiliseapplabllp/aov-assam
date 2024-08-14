import { Component, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonDatetime, LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-close-pms',
  templateUrl: './close-pms.component.html',
  styleUrls: ['./close-pms.component.scss'],
})
export class ClosePmsComponent  implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  data: any;
  remark!: string;
  formData = new FormData();
  loading: any;
  imageName!: string;
  date: any;
  type: any;
  optionArr: any = [{
    label: 'Not Accessible'
  },{
    label: 'RBER'
  },{
    label: 'Successfully Completed'
  },{
    label: 'Under Warranty'
  }];
  tkt_closed_remark: any;
  constructor(
    private loadingController: LoadingController,
    private common: CommonService,
    private httpPms: PmCalService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // this.getPmsStages();
  }

  // getPmsStages() {
  //   this.presentLoading().then(preLoad => {
  //     this.httpPms.getPmsStage().subscribe({
  //       next:(data: any) => {
  //         console.log(data);
  //         if (data.status) {
  //           this.optionArr = data.data;
  //         } else {
  //           this.common.presentToast(data.msg, 'warning');
  //         }
  //       },
  //       error:() => {
  //         this.common.presentToast(environment.source, 'warning');
  //         this.dismissLoading();
  //       },
  //       complete:() => {
  //         this.dismissLoading();
  //       }
  //     })
  //   })

  // }

  submit() {
    if (!this.tkt_closed_remark) {
      this.common.presentToast('Closure Remark is Compulsory', 'warning');
      return;
    }
    if (!this.date) {
      this.common.presentToast('Please Select Date', 'warning');
      return;
    }
    let date = moment(this.date).format('YYYY-MM-DD');
    this.formData.delete('id');
    this.formData.delete('tkt_closed_remark');
    this.formData.delete('tkt_closed_date');
    this.formData.delete('source');

    this.formData.append('id', this.data.id);
    this.formData.append('tkt_closed_remark', this.tkt_closed_remark);
    this.formData.append('tkt_closed_date', date);
    this.formData.append('source', environment.source);

    // this.formData.delete('tkt_closed_remark');
    // this.formData.delete('source');
    // this.formData.delete('id');

    // this.formData.append('tkt_closed_remark', this.remark);
    // this.formData.append('source', environment.source);
    // this.formData.append('id', this.data.id);
    this.presentLoading().then(preLoad => {
      this.httpPms.closeAction(this.formData, this.type).subscribe({
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

  changeDate(ev: any) {
    this.popoverDatetime.confirm(true);
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
    this.formData.delete('tkt_closed_attach');
    this.formData.append('tkt_closed_attach', blob, random);
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
