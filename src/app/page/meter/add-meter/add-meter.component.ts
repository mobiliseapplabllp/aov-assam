import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { MeterService } from 'src/app/provider/meter/meter.service';
import { AssetPlantComponent } from '../../add-asset/asset-plant/asset-plant.component';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DaysComponent } from '../days/days.component';
import * as moment from 'moment';
import { CostCenterComponent } from 'src/app/shared/cost-center/cost-center.component';
import { AssignToComponent } from '../assign-to/assign-to.component';
import { EscalateToComponent } from '../escalate-to/escalate-to.component';
@Component({
  selector: 'app-add-meter',
  templateUrl: './add-meter.component.html',
  styleUrls: ['./add-meter.component.scss'],
})
export class AddMeterComponent implements OnInit {
  loading: any;
  facilityTypeArr: any = [];
  myBlocks: any = [];
  myBuildingArr: any = [];
  myFloor: any = [];
  myLocation: any = [];
  myEquipStatus: any = [];
  public addAsset!: FormGroup;
  meterType: any = [];
  uomMeter: any = [];
  formData = new FormData();
  img1!: string;
  img2!: string;
  img3!: string;
  days: any = [];
  daysLength: any = [];
  timeArr: any = [{
    from_date: '',
    to_date: ''
  }];
  usr: any = [];
  escalate_to: any = [];
  remark!: string;
  parentAssetObj: any = {};
  fromDate: any;
  toDate: any;

  constructor(
    private httpAsset: MyAssetGetService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private httpCommon: CommonService,
    private formbuilder: FormBuilder,
    private httpMeter: MeterService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.initForm();
    this.getFacilityType();
    this.getEquipStatus();
    this.getMeterType();
    this.getUomMeter();
  }

  initForm() {
    this.addAsset = this.formbuilder.group({
      faciity_type: [''],
      site_id_description:[''],
      site_id: ['', Validators.required],
      block_id: ['', Validators.required],
      bldg_id: ['', Validators.required],
      floor_id: ['', Validators.required],
      location_id: ['', Validators.required],
      ext_asset_id: [''],
      ext_asset_id_pre: [''],
      ext_id_temp: ['',[Validators.required , Validators.minLength(6)]],
      ext_id: ['', Validators.required],
      is_child_asset:['', Validators.required],
      parent_asset_id: ['',[Validators.required , Validators.minLength(10)]],
      meter_type_id: ['', Validators.required],
      meter_name: ['', Validators.required],
      uom_id: ['', Validators.required],
      unit_price: ['', Validators.required],
      model: ['', Validators.required],
      s_no: ['', Validators.required],
      ideal_reading: ['', Validators.required],
      mnf_details: ['', Validators.required],
      is_consumption: ['', Validators.required],
      cuns_min: [''],
      cuns_max: [''],
      is_generation: ['', Validators.required],
      gen_min: [''],
      gen_max: [''],
      oth_read: ['', Validators.required],
      oth_min: [''],
      oth_max: [''],

      mult_fact: ['', Validators.required],
      mult_fact_val: [''],
      inc: ['', Validators.required],
      back_date: ['', Validators.required],
      back_days: [''],
      edit_allow: ['', Validators.required],
      edit_allow_days: [''],
      img_req: ['', Validators.required],
      remark_req: ['', Validators.required],
      can_upld_gallery: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],

      // from_date: [''],
      // from_date_temp: [''],
      // to_date: [''],
      // to_date_temp: [''],
      source: [environment.source]

    });
  }

  getFacilityType() {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getFacilityType().subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.facilityTypeArr = data.data;
          }
        },
        error:() => {

        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  async openSiteModal() {
    // if (!this.addAsset.value.faciity_type) {
    //   alert('Please Select Facilty Type');
    //   return;
    // }
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { faciity_type: this.addAsset.value.faciity_type}
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        let prefix = 'M'+disModal.data.barcode_prefix;
        this.addAsset.get('site_id_description')?.setValue(disModal.data.pc_desc);
        this.addAsset.get('site_id')?.setValue(disModal.data.pc_id);
        this.addAsset.get('ext_asset_id')?.setValue(prefix);
        this.addAsset.get('ext_asset_id_pre')?.setValue(prefix);
        this.presentLoading().then(preLoad => {
          this.httpAsset.getBlock(disModal.data.pc_id).subscribe({
            next:(data) => {
              if (data.status) {
                this.myBlocks = data.data;
              }
            },
            error:() => {
              this.dismissloading();
              this.httpCommon.presentToast(environment.errMsg + ' Block Err', 'danger');
            },
            complete:() => {
              this.dismissloading();
            }
          });
        })
      } else {
      }
    });
    return await modal.present();
  }

  changeFromDate(index: any, type: string) {
    console.log(index);
    if (type === 'from') {
      let date = moment(this.timeArr[index].from_date).format('H:mm');
      this.timeArr[index].from_date_temp = date;
    } else {
      let date = moment(this.timeArr[index].to_date).format('H:mm');
      this.timeArr[index].to_date_temp = date;
    }
    console.log(this.timeArr);
  }

  addMoreSlot() {
    this.timeArr.push({from_date: '', to_date: ''});
  }

  removeTimeArr(index: number) {
    this.timeArr.splice(index, 1);
  }


  getMeterType() {
    this.httpMeter.getMeterType().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.meterType = data.data.data
      } else {
        this.httpCommon.presentToast(data.msg, 'warning');
      }
    });
  }

  getUomMeter() {
    this.httpMeter.getUomMeter().subscribe(data => {
      if (data.status) {
        this.uomMeter = data.data;
      } else {
        this.httpCommon.presentToast(data.msg, 'warning');
      }
    });
  }

  changeBlock(ev: any) {
    console.log(ev.target.value);
    this.presentLoading().then(preLoad => {
      this.httpAsset.getBuildingList(ev.target.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.myBuildingArr = data.data;
            this.addAsset.get('bldg_id')?.setValue('');
            this.addAsset.get('floor_id')?.setValue('');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  changeBuilding(ev: any) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getFloorList(ev.target.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.myFloor = data.data;
            this.addAsset.get('floor_id')?.setValue('');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  changeFloor(ev: any) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getLocation(ev.target.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.myLocation = data.data;
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  getEquipStatus() {
    this.httpAsset.getEquipmentStatus().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myEquipStatus = data.data
      }
    });
  }

  changeAssetChild() {
    this.addAsset.get('parent_asset_id')?.setValue('');
  }

  searchParentId() {
    var length = this.addAsset.value.parent_asset_id.length;
    console.log(length);
    if (length !== 10) {
      alert('Parent Id Should be 10 Digit');
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpAsset.getAssetParentId(this.addAsset.value.parent_asset_id, '').subscribe({
        next:(data) => {
          if (data.status) {
            this.parentAssetObj = data.data
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })

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

  changeMeterId() {
    console.log('abc');
    let prefix = this.addAsset.value.ext_asset_id;
    let id = this.addAsset.value.ext_id_temp;
    this.addAsset.get('ext_id')?.setValue(prefix + id);
  }

  addMeter() {
    console.log(this.timeArr);
    if (this.addAsset.value.is_child_asset == '1' && !this.parentAssetObj.isExists) {
      this.httpCommon.presentToast('Please Verify Parent Asset Id', 'warning');
      return;
    }
    var timeslots = this.timeArr.map((res: any) => res.from_date_temp);
    var totimeslots = this.timeArr.map((res: any) => res.to_date_temp);
    for(let key in this.addAsset.value) {
      this.formData.delete(key);
      this.formData.append(key, this.addAsset.value[key]);
    }
    this.formData.delete('daysSlots');
    this.formData.delete('escalate_to');
    this.formData.delete('usr');
    this.formData.delete('timeslots');
    this.formData.delete('totimeslots');
    this.formData.delete('remark');
    this.formData.delete('assets');
    this.formData.delete('fromDate')
    this.formData.delete('toDate')

    this.formData.append('daysSlots', JSON.stringify(this.days));
    this.formData.append('escalate_to',JSON.stringify(this.escalate_to));
    this.formData.append('usr', JSON.stringify(this.usr));
    this.formData.append('timeslots', JSON.stringify(timeslots));
    this.formData.append('totimeslots', JSON.stringify(totimeslots));
    this.formData.append('remark', this.remark);
    this.formData.append('assets', JSON.stringify(this.parentAssetObj));
    this.formData.append('fromDate', this.fromDate)
    this.formData.append('toDate', this.toDate);

    this.presentLoading().then(preLoad => {
      this.httpMeter.addMeter(this.formData).subscribe({
        next:(data) => {
          if (data.status) {
            this.httpCommon.presentToast(data.msg, 'success');
            this.navCtrl.pop();
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  async presentActionSheet(imageno: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image, imageno);
    };
    takePicture();
  }

  async readImg(photo: any, imageno: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    if (imageno === 1) {
      this.formData.delete('photo1');
      this.formData.append('photo1', blob, random + '.jpg');
      this.img1 = random;
    } else  if (imageno === 2) {
      this.formData.delete('photo2');
      this.formData.append('photo2', blob, random + '.jpg');
      this.img2 = random;
    } else if (imageno === 3) {
      this.formData.delete('photo3');
      this.formData.append('photo3', blob, random + '.jpg');
      this.img3 = random;
    }
    this.presentLoading().then(preLoad => {
      this.dismissloading();
    });
  }

  changePhoto(event: any, index: any): void {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (index == 1) {
        this.formData.delete('photo1');
        this.formData.append('photo1' , file, random)
      } else if (index == 2) {
        this.formData.delete('photo2');
        this.formData.append('photo2' , file, random)
      } else if (index == 3) {
        this.formData.delete('photo3');
        this.formData.append('photo3' , file, random)
      }
      console.log(file);
    }
  }

  async openDays() {
    console.log('my site');
    const modal = await this.modalCtrl.create({
      component: DaysComponent,
      cssClass: 'my-modal2',
      componentProps: { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {

        this.days = disModal.data;
        this.daysLength = this.days.filter((val: any) => val.selected);
        console.log(this.daysLength);
        // this.greetEvent.emit(true);
      }
    });
    modal.present();
  }

  async assignToModal() {
    if (!this.addAsset.value.site_id) {
      alert('Please Select Site');
      return;
    }
    const modal = await this.modalCtrl.create({
      component: AssignToComponent,
      cssClass: 'my-modal',
      componentProps: {
        site_id: this.addAsset.value.site_id
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.usr = disModal.data;
      }
    });
    modal.present();
  }

  async escalateToModal() {
    if (!this.addAsset.value.site_id) {
      alert('Please Select Site');
      return;
    }
    const modal = await this.modalCtrl.create({
      component: EscalateToComponent,
      cssClass: 'my-modal',
      componentProps: {
        site_id: this.addAsset.value.site_id
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.escalate_to = disModal.data;
      }
    });
    modal.present();
  }



}
