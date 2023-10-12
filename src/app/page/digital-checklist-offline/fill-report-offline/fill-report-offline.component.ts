import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { SignatureComponent } from 'src/app/shared/signature/signature.component';

@Component({
  selector: 'app-fill-report-offline',
  templateUrl: './fill-report-offline.component.html',
  styleUrls: ['./fill-report-offline.component.scss'],
})
export class FillReportOfflineComponent  implements OnInit {
  @ViewChildren("a") private itemlist!: QueryList<ElementRef>;
  allData: any = [];
  allDataNew: any = [];
  remark!: string;
  signatureBase64!: string;
  loading: any;
  isInternet!: boolean;
  constructor(
    private activeRoute: ActivatedRoute,
    private common: CommonService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((res) => {
      this.allData = JSON.parse(res['data']);
      console.log(this.allData);
      setTimeout(() => {
        this.remark = this.allData.remark;
        this.signatureBase64 = this.allData.signatureBase64;
      }, 100);
    });
    this.common.checkInternet().then(res => {
      if (res) {
        this.isInternet = true
      } else {
        this.isInternet = false;
      }
    })
  }

  uploadToServer() {
    if (!this.checkValidation()) {
      return;
    }
    this.allDataNew = JSON.parse(JSON.stringify(this.allData));
    delete this.allDataNew.backgroundColor;
    delete this.allDataNew.barcode;
    delete this.allDataNew.location_desc;
    delete this.allDataNew.chk_cat_name;
    delete this.allDataNew.device_name;
    delete this.allDataNew.schedule_unique_id;
    delete this.allDataNew.schedule_status;
    for (var i = 0 ; i < this.allDataNew.qus.length; i++) {
      delete this.allDataNew.qus[i].critical_desc;
      delete this.allDataNew.qus[i].options;
      delete this.allDataNew.qus[i].q_desc;
      delete this.allDataNew.qus[i].q_max_score;
      delete this.allDataNew.qus[i].q_type;
      delete this.allDataNew.qus[i].question_type;
    }

    const arr = [this.allDataNew];
    console.log(arr);
  }

  async presentActionSheet(val: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      this.readImg(val, image)
    };
    takePicture();
  }

  async readImg(val: any, photo: any) {
    console.log(photo);
    val.attachment2 = 'data:image/png;base64,' + photo.base64String;
    return
  }

  async openSign() {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      cssClass: 'my-modal',
      componentProps: {  }
    });
    modal.onWillDismiss().then(async disModal => {
      if (disModal.role) {
        let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg';
        this.signatureBase64 = disModal.data;
        this.allData.signatureBase64 = this.signatureBase64
      }
    });
    modal.present();
  }

  offlineSaveAction() {
    if (this.checkValidation()) {
      this.saveOffline();
    }
  }

  checkValidation() {
    if (!this.allData.remark) {
      this.common.presentToast('Remark is Mandatory', 'warning');
      return false;
    }
    if (!this.signatureBase64) {
      this.common.presentToast('Please Write Signature', 'warning');
      return false
    }
    this.allData.can_save = true;

    for (let j = 0; j < this.allData.qus.length; j++) {
      if (!this.allData.qus[j].rspns) {
        this.common.presentToastWithOk(`Please add Response for Question No ${ j + 1}`, 'warning');
        this.allData.qus[j].isNotFill = true;
        this.scroll(j);
        this.allData.can_save = false;
        return false;
      } else {
        this.allData.qus[j].isNotFill = false;
      }
    }
    return true;
  }

  saveOffline() {
    this.allData.offlineSave = true;
    let temp = localStorage.getItem('checkListData');
    if (temp) {
      var checklist = JSON.parse(temp);
      for (var i = 0 ; i < checklist.length; i++) {
        if (checklist[i].schedule_id == this.allData.schedule_id) {
          checklist.splice(i, 1, this.allData);
        }
      }
    }

    this.presentLoading().then(preLoad => {
      setTimeout(() => {
        this.dismissloading();
        localStorage.setItem('checkListData', JSON.stringify(checklist));
        this.navCtrl.pop();
      }, 2000);
    })
  }

  changeResponseAction(val: any, ev: any) {
    const obj = val.options.filter((val: any) => val.optn_id === ev.target.value)[0];
    val.isRemarkMandatory = obj.is_rmrk_mandatory;
    val.isDocMandatory = obj.is_doc_mandatory;
  }

  scroll(indexFound: any) {
    setTimeout(() => {
      const userToScrollOn = this.itemlist.toArray();
      userToScrollOn[indexFound].nativeElement.scrollIntoView({
        behavior: 'smooth'
      }, (err: any) => {
        console.log(err);
      });
    }, 500);
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

  viewDocs(url: string) {
    this.common.openDoc(url);
  }

}
