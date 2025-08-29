import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as moment from 'moment';

@Component({
  selector: 'app-ind-ack',
  templateUrl: './ind-ack.component.html',
  styleUrls: ['./ind-ack.component.scss'],
})
export class IndAckComponent implements OnInit {
  @ViewChild('popoverDatetime') popoverDatetime!: IonDatetime;
  req_data: any;
  formObj: any = {};
  isImageUpload!: boolean;
  formData = new FormData();
  constructor(
    private modalCtrl: ModalController,
    private httpIndent: IndentsService,
    private common: CommonService
  ) { }

  ngOnInit() {
    console.log(this.req_data);
    this.formObj.faulty_received = 'Yes';
    this.formObj.fau_date = moment().format('YYYY-MM-DD');
    this.formObj.mtrl_id = this.req_data.mtrl_id;
    this.formObj.rqst_id = this.req_data.rqst_id;
    this.formObj.status = this.req_data.status_desc;
    this.formObj.status_id = this.req_data.status_id;
    this.formObj.asset_id = this.req_data.asset_id;

    this.getFaultyFormDetails();
  }

  getFaultyFormDetails() {
    this.common.presentLoading().then(preLoad => {
      this.httpIndent.getFaultyFormDetails(this.req_data.rqst_id).subscribe({
        next: (data: any) => {
          if (data.status) {
            let val = data.data
            this.formObj.ext_asset_id = val.ext_asset_id;
            this.formObj.item_code = val.sku;
            this.formObj.mtrl_desc = val.mtrl_desc;
            this.formObj.fau_qty = val.qty;
            this.formObj.rqst_no = val.rqst_no;
            this.formObj.pc_desc = val.pc_desc;
          }
        },
        error: () => {
          this.common.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete: () => {
          this.common.dismissloading();
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
    this.isImageUpload = true;
    this.formData.delete('fau_file');
    this.formData.append('fau_file', blob, random);
  }

  close(data: any, status: string) {
    this.modalCtrl.dismiss(data, status);
  }

  changeDate() {
    this.popoverDatetime.confirm(true);
  }

  submit() {    
    for (var key in this.formObj) {
      this.formData.delete(key);
      this.formData.append(key, this.formObj[key] || '');
    }
    this.common.presentLoading().then(preLoad => {
      this.httpIndent.submitFaultyItem(this.formData).subscribe({
        next: (data: any) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.close(null, 'true');
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error: () => {
          this.common.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete: () => {
          this.common.dismissloading();
        }
      });
    })

  }

}
