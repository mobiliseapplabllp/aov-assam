import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonDatetime, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { CostCenterComponent } from 'src/app/shared/cost-center/cost-center.component';
import { environment } from 'src/environments/environment';
import { MaterialComponent } from '../material/material.component';
import { UomComponent } from '../uom/uom.component';
import { Camera, CameraResultType } from '@capacitor/camera';
import { EmpSearchComponent } from 'src/app/shared/emp-search/emp-search.component';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import * as moment from 'moment';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
@Component({
  selector: 'app-cr-indent',
  templateUrl: './cr-indent.component.html',
  styleUrls: ['./cr-indent.component.scss'],
})
export class CrIndentComponent  implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  @ViewChild(IonContent, {static: true}) content!: IonContent;
  public forms!: FormGroup;
  myWarehouse: any = [];
  loading: any;
  materialArr: any = [];
  requestedData: any= [];
  isDisabled = true;
  assetObj: any = {};
  isSearch = false;
  MRTypeArr: any = [];
  constructor(
    private formbuilder: FormBuilder,
    private modalController: ModalController,
    private httpIndent: IndentsService,
    private common: CommonService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private activeRoute: ActivatedRoute,
    private httpComplaint: ComplaintService,
    private httpAsset: MyAssetGetService,
    private httpCommon: CommonService,
    private platform: Platform) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((res) => {
      if (res['status']) {
        this.requestedData = JSON.parse(res['data']);
      }
      console.log(this.requestedData);
    });
    this.initForm();
    this.materialArr.push({});
    if (this.platform.is('capacitor')) {
      this.checkAndUpdateMaster();
    }
    this.getMRType();
  }

  ionViewDidLeave() {
    this.dismissloading();
  }

  checkAndUpdateMaster() {
    let lastAssetTime = localStorage.getItem('lastAssetTime');
    if (!lastAssetTime) {
      this.presentLoading().then(preLoad => {
        this.httpAsset.getAssetMasterData('0000-00-00 00:00:00').subscribe({
          next:(data) => {
            this.httpAsset.insertAssetAction(data.data).then(insRes => {
              if (insRes) {
                this.httpCommon.presentToast('All Master Saved Successfully', 'success');
                localStorage.setItem('lastAssetTime', moment().format('YYYY-MM-DD H:mm:ss'));
                this.dismissloading();
              }
            });
          },
          error:() => {
            this.dismissloading();
          }
        })
      });
    }
  }

  getMRType() {
    this.httpIndent.getMrType().subscribe({
      next:(data) => {
        if (data.status) {
          this.MRTypeArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {
        this.common.presentToast(environment.errMsg + ' MR Type', 'danger');
      },
      complete:() => {

      }
    })
  }

  initForm() {
    this.forms = this.formbuilder.group({
      pc_id: ['', Validators.required],
      pc_id_desc: [''],
      wh_id: ['', Validators.required],
      prop1: [''],
      is_ticket: ['',Validators.required],
      ticket_id: [''],
      asset_id: [''],
      type_id: ['', Validators.required]
    });
    if(this.requestedData.pc_id) {
      this.forms.get('pc_id')?.setValue(this.requestedData.pc_id);
      this.forms.get('pc_id_desc')?.setValue(this.requestedData.pc_desc);
      this.forms.get('is_ticket')?.setValue('Yes');
      this.forms.get('ticket_id')?.setValue(this.requestedData.tkts_id);
      this.forms.get('asset_id')?.setValue(this.requestedData.pc_ext_id);
      this.getWarehousePc(this.requestedData.pc_id);
    }
  }

  changeIsTicket() {
    this.forms.get('ticket_id')?.setValue('');
    this.forms.get('asset_id')?.setValue('');
    this.forms.get('pc_id')?.setValue('');
    this.forms.get('pc_id_desc')?.setValue('');
    this.forms.get('wh_id')?.setValue('');
    this.myWarehouse = [];
    this.assetObj = {};
    this.isSearch = false;
  }

  getSpecificTicket() {
    this.presentLoading().then(preLoad => {
      this.isSearch = false;
      this.httpComplaint.getSpecificTicket(this.forms.value.ticket_id).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.forms.get('asset_id')?.setValue(data.data?.ext_asset_id);
          this.forms.get('pc_id_desc')?.setValue(data.data?.pc_ext_id + data.data?.pc_desc);
          this.forms.get('pc_id')?.setValue(data.data?.pc_id);
          this.assetObj.dev_name = data.data?.subgrp_desc;
          this.assetObj.dev_model = data.data?.model_id;
          this.isSearch = true;
          if (data.data?.pc_id) {
            this.getWarehousePc(data.data.pc_id);
          }
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      });
    })
  }

  getAssetDetail() {
    this.presentLoading().then(preLoad => {
      this.isSearch = false;
      this.httpComplaint.getAssetDetail(this.forms.value.asset_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.forms.get('pc_id_desc')?.setValue(data.data?.pc_ext_id + data.data?.pc_desc);
            this.forms.get('pc_id')?.setValue(data.data?.pc_id);
            this.assetObj.dev_name = data.data?.subgrp_desc;
            this.assetObj.dev_model = data.data?.model_id;
            this.isSearch = true;
            if (data.data?.pc_id) {
              this.getWarehousePc(data.data.pc_id);
            }
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
      })
    });
  }

  addMore() {
    this.materialArr.push({});
    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 300);
  }

  delete(i: any) {
    this.common.presentToast('Index ' + i+1 + ' Removed', 'warning')
    this.materialArr.splice(i, 1);
  }

  async openSiteModal() {
    if(this.requestedData.pc_id || this.isSearch) {
      return;
    }
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        this.forms.get('pc_id_desc')?.setValue(disModal.data.pc_desc);
        this.forms.get('pc_id')?.setValue(disModal.data.pc_id);
        this.getWarehousePc(disModal.data.pc_id);
      }
    });
    return await modal.present();
  }

  async openMaterialModal(index: any) {
    const modal = await this.modalController.create({
      component: MaterialComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        this.materialArr[index].mtrl_desc = disModal.data.label;
        this.materialArr[index].mtrl_id = disModal.data.value;
        this.materialArr[index].uom_id_desc = disModal.data.uom_desc;
        this.materialArr[index].uom_id = disModal.data.uom_id;
      }
    });
    return await modal.present();
  }

  async openUomModal(index: any) {
    const modal = await this.modalController.create({
      component: UomComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        this.materialArr[index].uom_id_desc = disModal.data.label;
        this.materialArr[index].uom_id = disModal.data.value;
      }
    });
    return await modal.present();
  }

  async openEmpModal(index: any) {
    const modal = await this.modalController.create({
      component: EmpSearchComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        this.materialArr[index].user_id_desc = disModal.data.name;
        this.materialArr[index].user_id = disModal.data.id;
      }
    });
    return await modal.present();
  }

  getWarehousePc(pc_id: any) {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getWarehousePc(pc_id).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.myWarehouse = data.data;
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
      })
    });
  }

  changeDate(val?: string) {
    this.popoverDatetime.confirm(true);
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

  submit() {
    if (!this.ticketCondition()) {
      return;
    }
    const formData = new FormData();
    for (var key in this.forms.value) {
      formData.append(key, this.forms.value[key]);
    }
    for (var i = 0; i < this.materialArr.length; i++) {
      if (!this.materialArr[i].qty || this.materialArr[i].qty == 0) {
        this.common.presentToast(`Qty Can't be less than 1 at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].mtrl_desc) {
        this.common.presentToast(`Please Select Material at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].make) {
        this.common.presentToast(`Please Select Make at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].model) {
        this.common.presentToast(`Please Select Model at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].reqd_by_date) {
        this.common.presentToast(`Please Select Reqd By Date at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].remark) {
        this.common.presentToast(`Please Select Remark at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].user_id_desc) {
        this.common.presentToast(`Please Select Requestee at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].priority) {
        this.common.presentToast(`Please Select Priority at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].uom_id_desc) {
        this.common.presentToast(`Please Select Unit at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].dimension) {
        this.common.presentToast(`Please Dimension at index ${i+1}`, 'warning');
        return;
      }

      if (!this.materialArr[i].del_loc) {
        this.common.presentToast(`Please Select Delivery Location at index ${i+1}`, 'warning');
        return;
      }

      let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
      formData.append(`material[${i}][del_loc]`, this.materialArr[i].del_loc);
      formData.append(`material[${i}][dimension]`, this.materialArr[i].dimension);
      formData.append(`material[${i}][make]`, this.materialArr[i].make);
      formData.append(`material[${i}][model]`, this.materialArr[i].model);
      formData.append(`material[${i}][mtrl_desc]`, this.materialArr[i].mtrl_desc);
      formData.append(`material[${i}][mtrl_id]`, this.materialArr[i].mtrl_id);
      formData.append(`material[${i}][priority]`, this.materialArr[i].priority);
      formData.append(`material[${i}][qty]`, this.materialArr[i].qty);
      formData.append(`material[${i}][remark]`, this.materialArr[i].remark);
      formData.append(`material[${i}][reqd_by_date]`, this.materialArr[i].reqd_by_date);
      formData.append(`material[${i}][uom_id]`, this.materialArr[i].uom_id);
      formData.append(`material[${i}][uom_id_desc]`, this.materialArr[i].uom_id_desc);
      formData.append(`material[${i}][user_id]`, this.materialArr[i].user_id);
      if (this.materialArr[i].attachment1) {
        formData.append(`material[${i}][attachment1]`, this.materialArr[i].attachment1 , random);
      }

    }
    this.presentLoading().then(preLoad => {
      this.httpIndent.submitIndent(formData).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.navCtrl.pop();
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
      })
    });
  }

  async presentActionSheet(index: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image, index)
    };
    takePicture();
  }

  async readImg(photo: any, index: any) {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    this.materialArr[index].attachment1 = blob,
    this.materialArr[index].isFile = true
  }

  ticketCondition() {
    if (this.forms.value.is_ticket === 'Yes' && (!this.forms.value.ticket_id || !this.forms.value.asset_id)) {
      this.common.presentToast('Please Enter Ticket Id or Barcode No', 'warning');
      return false;
    } else if(this.forms.value.is_ticket === 'No' && (!this.forms.value.asset_id)) {
      this.common.presentToast('Please Enter Barcode No', 'warning');
      return false;
    }
    else {
      return true;
    }
  }
}
