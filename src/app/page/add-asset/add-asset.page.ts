import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, LoadingController, ModalController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { environment } from 'src/environments/environment';
import { AssetPlantComponent } from './asset-plant/asset-plant.component';
import { AssetDepartmentComponent } from './asset-department/asset-department.component';
import { AssetDevicenameComponent } from './asset-devicename/asset-devicename.component';
import { AssetManufacturerComponent } from './asset-manufacturer/asset-manufacturer.component';
import { Camera, CameraResultType } from '@capacitor/camera';
@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.page.html',
  styleUrls: ['./add-asset.page.scss'],
})
export class AddAssetPage implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  public addAsset: FormGroup;
  facilityTypeArr: any = [];
  myPlantArr: any = [];
  myBlocks: any = [];
  myBuildingArr: any = [];
  myFloor: any = [];
  myDepartment: any = [];
  mySubDepartment: any = [];
  myDeviceGroup: any = [];
  myDeviceName: any = [];
  myManufacturer: any = [];
  myOwnership: any = [];
  myEquipStatus: any = [];
  myTechnology: any = [];
  myWarranty: any = [];
  loading: any;
  img1: string = '';img2: string= ''; img3: string = '';img4!: string;
  formData = new FormData();
  public errorMessages = {
    input_asset_id: [
      { type: 'required', message: 'Asset ID is Required' },
      { type: 'minlength', message: 'Asset Id should have 6 digits' }
    ],
  };
  parentAssetObj: any = {};
  pendingApi: any;
  clrTiimeOut: any;
  prefixBarcode!: string;
  seats: any = [{
    booked_user: 'Aman',
    xy: '30px 30px',
    is_fixed: '1',
    is_disabled: '0',
    is_flexible_seat: '1',
    is_booked: true,
    is_blocked: 'true'
  }];
  // pinpointStyle: any = {};

  coordinate: any = {
    x: 0,
    y: 0,
    d: 1
  }
  pinpointStyle = {};
  floorImage!: string;
  constructor(
    private formbuilder: FormBuilder,
    private httpAsset: MyAssetGetService,
    private modalController: ModalController,
    private httpCommon: CommonService,
    public loadingController: LoadingController,) {
    this.addAsset = this.formbuilder.group({
      faciity_type: ['', Validators.required],
      site_id_description:[''],
      site_id: ['', Validators.required],
      block_id: [''],
      bldg_id: [''],
      floor_id: [''],
      dept_id: [''],
      dept_id_desc: [''],
      sub_dept_id:[''],
      ext_asset_id_pre: [''],
      input_asset_id: ['',[Validators.required , Validators.minLength(6)]],
      ext_asset_id:[''],
      client_asset_id:['',[Validators.required]],
      is_child_asset:['', Validators.required],
      parent_asset_id: [''],
      grp_id:['', Validators.required],
      subgrp_id:['', Validators.required],
      subgrp_id_desc:['', Validators.required],
      subgrp_class:['', Validators.required],
      device_sub_cate_remark: ['', Validators.required],
      make:[''],
      model :['', Validators.required],
      serial_no:['', Validators.required],
      manufacturer_id:['', Validators.required],
      manufacturer_id_desc: [''],
      accessories:[''],
      ownership_id :['', Validators.required],
      ledger_ref:[''],
      pur_order_no:[''],
      pur_date:[''],
      pur_value:[''],
      install_date:[''],
      is_asset: ['', Validators.required],
      technology_id: [''],
      install_by: [''],
      warranty_id: [''],
      warranty_start_date: [''],
      warranty_end_date: [''],
      vend_code: [''],
      is_insured: [''],
      remark: [''],
      source: [environment.source]

    });
    this.pinPointStyleFun();
    this.getFacilityType();
    this.getDeviceGroup();
    this.getOwnership();
    this.getEquipStatus();
    this.getTechnology();
    this.getWarranty();
  }

  get input_asset_id() {
    if (!this.addAsset.get('input_asset_id')) {
      return this.addAsset.get('input_asset_id');
    }
    return this.addAsset.get('input_asset_id');
  }

  get parent_asset_id() {
    if (!this.addAsset.get('parent_asset_id')) {
      return this.addAsset.get('parent_asset_id');
    }
    return this.addAsset.get('parent_asset_id');
  }

  getImageCoordinates(event: MouseEvent) {
    const scrollContainer = document.querySelector('ion-scroll');
    if (!scrollContainer) {
      return
    }
    const imageElement = scrollContainer.querySelector('img');
    if (!imageElement) {
      return
    }
    const scrollLeft = scrollContainer.scrollLeft;
    const imageOffsetLeft = imageElement.getBoundingClientRect().left;
    const imageOffsetTop = imageElement.getBoundingClientRect().top;
    const clickX = event.clientX;
    const clickY = event.clientY;

    const xCoordinate = scrollLeft + clickX - imageOffsetLeft;
    const yCoordinate = scrollLeft + clickY - imageOffsetTop; // Since we disabled vertical scrolling, the y-coordinate will always be 0

    this.coordinate.x = xCoordinate,
    this.coordinate.y = yCoordinate
    this.coordinate.x = parseInt(this.coordinate.x, 10);
    this.coordinate.y = parseInt(this.coordinate.y, 10);
    console.log('X Coordinate:', xCoordinate);
    console.log('Y Coordinate:', yCoordinate);
    this.pinPointStyleFun();
  }

  handleImageClick(event: MouseEvent) {
    const imageElement: HTMLImageElement = event.target as HTMLImageElement;
    const rect = imageElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.coordinate.x = x;
    this.coordinate.y = y;
    this.pinPointStyleFun();
  }

  pinPointStyleFun() {
    if (this.coordinate.x < 0) {
      this.coordinate.x = 0;
    }
    if (this.coordinate.y < 0) {
      this.coordinate.y = 0
    }
    let x, y;
    x = this.coordinate.x;
    y = this.coordinate.y;
    this.pinpointStyle = {
      left: x + 'px',
      top: y + 'px',
      width: '10px',
      height: '10px',
    };
  }

  action(pos: any, val: any) {
    let d = parseInt(this.coordinate.d, 10);
    if (pos == 'x') {
      if (val == -1) {
        this.coordinate.x = parseInt(this.coordinate.x, 10) - d;
        if (this.coordinate.x < 0) {
          this.coordinate.x = 0;
        }
      } else {
        this.coordinate.x = parseInt(this.coordinate.x, 10) + d;
      }
    } else {
      if (val == -1) {
        this.coordinate.y = parseInt(this.coordinate.y, 10) - d;
        if (this.coordinate.y < 0) {
          this.coordinate.y = 0;
        }
      } else {
        this.coordinate.y = parseInt(this.coordinate.y, 10) + d;
      }
    }
    this.pinPointStyleFun();
  }

  openScanner() {
    // this.barcodeScanner.scan().then(barcodeData => {
    //   console.log('Barcode data', barcodeData);
    //   let barcode = barcodeData.text;
    //   if (barcode.length == 6) {
    //     this.addAsset.get('input_asset_id').setValue(barcode)
    //   } else {
    //     alert(barcode + ' Barcode Should have 6 Digit Only');
    //   }
    // }).catch(err => {
    //   console.log('Error', err);
    // });
  }

  // presentActionSheet(val: any) {

  // }

  async presentActionSheet(val: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image, val)
    };
    takePicture();
  }

  async readImg(photo: any, imageno: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();

    if (imageno === 1) {
      this.img1 = random;
      this.formData.delete('asset_img');
      this.formData.append('asset_img', blob, random);
      this.presentLoading().then(preLoad => {
        this.dismissloading();
        return;
      });
      return;
    }
    if (imageno === 2) {
      this.img2 = random;
      this.formData.delete('asset_img2');
      this.formData.append('asset_img2', blob, random );
      this.presentLoading().then(preLoad => {
        this.dismissloading();
        return;
      });
      return;
    }
    if (imageno === 3) {
      this.img3 = random;
      this.formData.delete('asset_img3');
      this.formData.append('asset_img3', blob, random);
      this.presentLoading().then(preLoad => {
        this.dismissloading();
        return;
      });
      return;
    }
    if (imageno === 4) {
      this.img4 = random;
      this.formData.delete('pur_invoice');
      this.formData.append('pur_invoice', blob, random);
      this.presentLoading().then(preLoad => {
        this.dismissloading();
        return;
      });
      return;
    }
    let barcode, formData
    barcode = this.addAsset.value.unique_no;
    formData = new FormData();
    formData.append('photo', blob, random);
    formData.append('barcodeno', barcode);


    this.presentLoading().then(preLoad => {
      setTimeout(() => {
        this.dismissloading();
      }, 500)
    });
  }


  async openSiteModal() {
    if (!this.addAsset.value.faciity_type) {
      alert('Please Select Facilty Type');
      return;
    }
    const modal = await this.modalController.create({
      component: AssetPlantComponent,
      cssClass: 'my-modal',
      componentProps : { faciity_type: this.addAsset.value.faciity_type}
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        this.addAsset.get('site_id_description')?.setValue(disModal.data.pc_desc);
        this.addAsset.get('site_id')?.setValue(disModal.data.pc_id);
        this.presentLoading().then(preLoad => {
          this.httpAsset.getBlock(disModal.data.pc_id).subscribe(data => {
            console.log(data);
            this.dismissloading();
            if (data.status) {
              this.myBlocks = data.data;
            }
          }, err => {
            this.dismissloading();
            this.httpCommon.presentToast(environment.errMsg + ' Block Err', 'danger');
          });
        })

        this.httpAsset.getPrefixBarcode(disModal.data.pc_id).subscribe(data => {
          console.log(data);
          if (data.status) {
            this.prefixBarcode = data.data.barcode_prefix
            this.addAsset.get('ext_asset_id_pre')?.setValue(this.prefixBarcode);
          }
        });

      } else {
      }
    });
    return await modal.present();
  }

  async openDepartment() {
    const modal = await this.modalController.create({
      component: AssetDepartmentComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.addAsset.get('dept_id_desc')?.setValue(disModal.data.dept_desc);
        this.addAsset.get('dept_id')?.setValue(disModal.data.dept_id);
        this.changeDepartment(disModal.data.dept_id)
      }

    });
    return await modal.present();
  }

  async openDeviceName() {
    if (!this.addAsset.value.grp_id) {
      alert('Please Select Device Group');
      return;
    }

    const modal = await this.modalController.create({
      component: AssetDevicenameComponent,
      cssClass: 'my-modal',
      componentProps : {
        grp_id: this.addAsset.value.grp_id
       }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.addAsset.get('subgrp_id')?.setValue(disModal.data.value);
        this.addAsset.get('subgrp_id_desc')?.setValue(disModal.data.label);
        this.addAsset.get('subgrp_class')?.setValue(disModal.data.subgrp_class);
      }
    });
    return await modal.present();
  }

  async openManufacturer() {
    const modal = await this.modalController.create({
      component: AssetManufacturerComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.addAsset.get('manufacturer_id')?.setValue(disModal.data.mnfctrer_id);
        this.addAsset.get('manufacturer_id_desc')?.setValue(disModal.data.mnfctrer_desc);
      }
    });
    return await modal.present();
  }


  changeBlock(ev: any) {
    console.log(ev.target.value);
    this.presentLoading().then(preLoad => {
      this.httpAsset.getBuildingList(ev.target.value).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.myBuildingArr = data.data;
          this.addAsset.get('bldg_id')?.setValue('');
          this.addAsset.get('floor_id')?.setValue('');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  changeBuilding(ev: any) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getFloorList(ev.target.value).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.myFloor = data.data;
          this.addAsset.get('floor_id')?.setValue('');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  chnageFloor(ev: any) {
    console.log(ev.target.value);
    let obj = this.myFloor.filter((val: any) => val.value === ev.target.value)[0];
    this.floorImage = obj.floor_img;
    console.log(this.floorImage);
  }

  changeClientId() {
    return /^[A-Za-z0-9]*$/.test('str');
    // let a = this.addAsset.value.client_asset_id.replace(/^a-zA-Z0-9 ]/g, '')
    // console.log(a);
  }

  getFacilityType() {
    this.httpAsset.getFacilityType().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.facilityTypeArr = data.data;
        setTimeout(() => {
          if (this.facilityTypeArr.length > 0) {
            this.addAsset.get('faciity_type')?.setValue(this.facilityTypeArr[0].id);
          }
        }, 100);
      }
    });
  }

  changeFacility(ev: any) {
    console.log(ev.target.value);
    this.httpAsset.getPlantByCategory(ev.target.value).subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myPlantArr = data.data
      }
    });
  }

  getBuilding() {
    this.httpAsset.getBuilding().subscribe(data =>{
      console.log(data);
      if (data.status) {
        this.myBuildingArr = data.data;
      }
    });
  }

  getFloor() {
    this.httpAsset.getFloor().subscribe(data => {
      if (data.status) {
        this.myFloor = data.data;
      }
    });
  }

  getDepartment() {
    this.httpAsset.getDepartment().subscribe(data => {
      if (data.status) {
        this.myDepartment = data.data
      }
    });
  }

  changeDepartment(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getSubDepartment(id).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.mySubDepartment = data.data
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })

  }

  getDeviceGroup() {
    this.httpAsset.getDeviceGroup().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myDeviceGroup = data.data;
      }
    });
  }

  changeDeviceGroup(ev: any) {
    // console.log('a');
    // console.log(ev.target.value);
    // if (ev.target.vaue != '') {
    //   this.httpAsset.getDeviceName(ev.target.value).subscribe(data => {
    //     if (data.status) {
    //       this.myDeviceName = data.data
    //     }
    //   })
    // }
  }

  changeDeviceName(ev: any) {
    console.log(ev.target.value);
    console.log(this.myDeviceName);
    if (ev.target.value) {
      let dev_class;
      dev_class = this.myDeviceName.filter((val: any) => val.value == ev.target.value)[0].subgrp_class;
      console.log(dev_class);
      this.addAsset.get('subgrp_class')?.setValue(dev_class);
    }
  }

  changeAssetChild() {
    this.addAsset.get('parent_asset_id')?.setValue('');
  }


  getManufacturer() {
    this.httpAsset.getManufacturer().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myManufacturer = data.data;
      }
    });
  }

  getOwnership() {
    this.httpAsset.getOwnership().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myOwnership = data.data;
      }
    });
  }

  getEquipStatus() {
    this.httpAsset.getEquipmentStatus().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myEquipStatus = data.data
      }
    });
  }

  getTechnology() {
    this.httpAsset.getTechnology().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myTechnology = data.data
      }
    });
  }

  getWarranty() {
    this.httpAsset.getWarranty().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myWarranty = data.data;
      }
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
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  checkWarrantyCondition() {
    if (this.addAsset.value.warranty_id === 1 || this.addAsset.value.warranty_id === 2 || this.addAsset.value.warranty_id === 3) {
      if (!this.addAsset.value.warranty_start_date || !this.addAsset.value.warranty_end_date) {
        alert('Please Select Start Date or End Date');
      } else {
        return true;
      }
    } else {
      return true;
    }
    return
  }

  checkParentCondition() {
    if (this.addAsset.value.is_child_asset === '1') {
      if (this.addAsset.value.parent_asset_id.length == 10) {
        return true;
      } else {
        alert('Asset Parent Id Should have 10 Digit');
      }
    } else {
      return true;
    }
    return
  }

  saveAsset() {
    if (this.checkWarrantyCondition() && this.checkParentCondition()) {
      this.submitAsset();
    }
  }

  submitAsset() {
    let prefix_barcode, barcode, fullbarcode;
    prefix_barcode = this.addAsset.value.ext_asset_id_pre;
    barcode = this.addAsset.value.input_asset_id;
    fullbarcode = prefix_barcode + barcode;
    this.addAsset.get('ext_asset_id')?.setValue(fullbarcode);
    this.stopRequest();
    this.presentLoading().then(preLoad => {
      for(let key in this.addAsset.value) {
        this.formData.delete(key);
        this.formData.append(key, this.addAsset.value[key])
      }
      // x_cor: [''],
      //   y_cor: [''],
      this.formData.delete('x_cor');
      this.formData.delete('y_cor');
      this.formData.append('x_cor', this.coordinate.x)
      this.formData.append('y_cor', this.coordinate.y)
      this.pendingApi = this.httpAsset.submitAsset(this.formData).subscribe(data => {
        this.dismissloading();
        this.pendingApi = null;
        this.clrTime();
        console.log(data);
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.formData = new FormData();
          this.clearField();
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.pendingApi = null;
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  stopRequest() {
    this.clrTime();
    this.clrTiimeOut = setTimeout(() => {
      console.log('clear timeout');
      if (this.pendingApi) {
        this.httpCommon.presentToastWithOk('Session Timeout... Please Submit Data Again', 'danger');
        this.pendingApi.unsubscribe();
        this.dismissloading();
      }
      this.clrTime();
    }, 30000);
  }

  clrTime() {
    if (this.clrTiimeOut) {
      clearTimeout(this.clrTiimeOut);
    }
  }

  searchAssetId() {
    console.log(this.addAsset.value.parent_asset_id);
    if (!this.addAsset.value.parent_asset_id) {
      alert('Please Enter Asset Parent ID');
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpAsset.getAssetParentId(this.addAsset.value.parent_asset_id).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.parentAssetObj = data.data;
        } else {
          alert(data.msg);
        }
      }, err => {
        this.dismissloading();
      });
    })

  }

  clearField() {
    this.addAsset.get('input_asset_id')?.setValue('');
    this.addAsset.get('ext_asset_id')?.setValue('');
    this.addAsset.get('client_asset_id')?.setValue('');
    this.addAsset.get('is_child_asset')?.setValue('');
    this.addAsset.get('client_asset_id')?.setValue('');
    this.addAsset.get('serial_no')?.setValue('');
    this.img1 = '';
    this.img2 = '';
    this.img3 = '';
    this.img4 = '';
  }

  ngOnInit() {
  }

  changeDate() {
    this.popoverDatetime.confirm(true);
  }

}
