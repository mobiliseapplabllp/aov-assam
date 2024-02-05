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
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FloorComponent } from 'src/app/shared/floor/floor.component';
import { LocationComponent } from 'src/app/shared/location/location.component';
import { DeviceGroupComponent } from 'src/app/shared/device-group/device-group.component';
import { CostCenterComponent } from 'src/app/shared/cost-center/cost-center.component';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { db } from '../../provider/local-db/local-db.service';
import { liveQuery } from 'dexie';
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
  myLocation: any = [];
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
      { type: 'minlength', message: 'Asset Id should have 4 digits' }
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
  currentDate: any;
  segmentType!: string;
  city!: string;
  sub_segment!: string;
  isOfflineDataAvailable!: boolean;
  isInternet!: boolean;
  constructor(
    private formbuilder: FormBuilder,
    private httpAsset: MyAssetGetService,
    private modalController: ModalController,
    private httpCommon: CommonService,
    private loadingController: LoadingController,
    private router: Router,
    private assetSqlite: AssetSqliteService,
    private platform: Platform) {
    this.addAsset = this.formbuilder.group({
      faciity_type: [''],
      site_id_description:[''],
      site_id: ['', Validators.required],
      block_id: [''],
      bldg_id: [''],
      floor_id: [''],
      floor_id_desc: [''],
      loc_id: [''],
      loc_id_desc: [''],
      dept_id: [''],
      dept_id_desc: [''],
      sub_dept_id:[''],
      ext_asset_id_pre: [''],
      input_asset_id: ['',[Validators.required , Validators.minLength(4)]],
      ext_asset_id:[''],
      client_asset_id:[''],
      is_child_asset:[''],
      parent_asset_id: [''],
      grp_id:['', Validators.required],
      grp_id_desc:['', Validators.required],
      subgrp_id:['', Validators.required],
      subgrp_id_desc:['', Validators.required],
      subgrp_class:['', Validators.required],
      device_sub_cate_remark: [''],
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
      warranty_id: ['', Validators.required],
      warranty_start_date: [''],
      warranty_end_date: [''],
      vend_code: [''],
      is_insured: [''],
      remark: [''],
      source: [environment.source],
      x_cor: [''],
      y_cor: [''],
      pur_invoice: [''],
      asset_img: [''],
      asset_img2: [''],
      asset_img3: ['']

    });
    this.pinPointStyleFun();
    // this.getFacilityType();
    // this.getDeviceGroup();
  }

  ngOnInit() {
    this.httpCommon.setBarcode('');
    this.httpCommon.checkInternet().then(res => {
      if (res) {
        if (this.platform.is('capacitor')) {
          this.isInternet = true;
          this.checkAndUpdateMaster();
        } else {
          this.dummyData();
        }
      } else {
        if (this.platform.is('capacitor')) {
          this.getBasicMaster();
        } else {
          this.dummyData();
        }
      }
    });
  }

  getBasicMaster() {
    this.getOwnership();
    this.getEquipStatus();
    this.getTechnology();
    this.getWarranty();
  }

  async getOffLineAssetList() {
    const friendsObservable = liveQuery (() => db.asset.toArray());
    const sub = friendsObservable.subscribe({
      next:(data) => {
        console.log(data);
        if (data.length > 0) {
          this.isOfflineDataAvailable = true;
        } else {
          this.isOfflineDataAvailable = false;
        }
        setTimeout(() => {
          sub.unsubscribe();
        }, 1000);
      }
    });
  }

  dummyData() {
    this.myOwnership = [{
      id : 1,
      label : "Customer/Client",
      ownership : "Customer/Client",
      value : 1
    },{
      id : 2,
      label : "OEM",
      ownership : "OEM",
      value :  2
    },{
      id : 3,
      label : "AOV",
      ownership : "AOV",
      value :  3
    }],
    this.myEquipStatus = [{
      id : 1,
      label : "Physical Damage",
      status_name : "Physical Damage",
      value : 1
    },{
      id :  2,
      label : "Condemned",
      status_name :  "Condemned",
      value : 2
    }],
    this.myTechnology = [{
      label :  "New",
      value: 1
    },{
      label :  "OLD",
      value: 2
    },{
      label :  "Obsolete",
      value: 3
    }],
    this.myWarranty = [{
      id : 1,
      status : 1,
      warranty : "UNDER WARRANTY"
    },{
      id : 2,
      status : 1,
      warranty : "UNDER AMC"
    },{
      id : 3,
      status : 1,
      warranty : "UNDER CMC"
    }]
  }

  syncMaster() {
    this.presentLoading().then(preLoad => {
      localStorage.setItem('lastAssetTime', '');
      this.assetSqlite.deleteSqlite().then(res => {
        if (res) {
          this.httpCommon.getTableStructureFromJson().then(tableStructure => {
            this.httpCommon.createAllTable(tableStructure).then(resPonse => {
              if (resPonse === true) {
                this.dismissloading();
                this.checkAndUpdateMaster();
              }
            });
          });
        }
      });
    })

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
                this.getBasicMaster();
                this.dismissloading();
              }
            });
          },
          error:() => {
            this.dismissloading();
          }
        })
      });
    } else {
      this.getBasicMaster();
    }
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

  // ionViewDidEnter() {
  //   this.currentDate = moment().format('YYYY-MM-DD');
  //   let bar = this.httpCommon.getBarcode();
  //   if (bar) {
  //     console.log('Your Barcode is ' + bar);
  //     let temp, temp1;
  //     temp = bar;
  //     temp1 = temp.split('/');
  //     this.httpCommon.setBarcode('');
  //     if (temp1.length === 6) {
  //       this.getDecBarcode(temp1[5]);
  //     } else {
  //       this.httpCommon.presentToast('This is invalid QR Code', 'warning');
  //     }
  //     // this.addAsset.get('input_asset_id')?.setValue(bar);
  //     // this.httpCommon.setBarcode('');
  //   }
  // }

  ionViewDidEnter() {
    this.httpCommon.checkInternet().then(res => {
      if (res) {
        this.getOffLineAssetList();
      }
    });

    this.currentDate = moment().format('YYYY-MM-DD');
    let bar = this.httpCommon.getBarcode();
    if (bar) {
      console.log('Your Barcode is ' + bar);
      let myBarcode, first, last
      myBarcode= bar.slice(-11);
      first = myBarcode.slice(0, 7);
      last = myBarcode.slice(-4);
      if (first === this.addAsset.value.ext_asset_id_pre) {
        this.addAsset.get('input_asset_id')?.setValue(last);
      } else {
        this.httpCommon.presentToastWithOk('Incorrect barcode!!  Starting 7 digits of the barcode does not match with the selected site ' + this.addAsset.value.site_id_description + '. The barcodes for the site begin with ' + first + '.' , 'warning');
      }
      // let temp, temp1;
      // temp = bar;
      // temp1 = temp.split('/');
      // this.httpCommon.setBarcode('');
      // if (temp1.length === 6) {
      //   this.getDecBarcode(temp1[5]);
      // } else {
      //   this.httpCommon.presentToast('This is invalid QR Code', 'warning');
      // }
      // this.addAsset.get('input_asset_id')?.setValue(bar);
      // this.httpCommon.setBarcode('');
    }

  }

  getDecBarcode(enc_barcode: string) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getDecBarcode(enc_barcode).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            let temp, firstDigit,lastDigit;
            temp = data.data.text;
            firstDigit = temp.slice(0, 4);
            lastDigit = temp.slice(-4);
            if (firstDigit === this.addAsset.value.ext_asset_id_pre) {
              this.addAsset.get('input_asset_id')?.setValue(lastDigit);
            } else {
              // this.httpCommon.presentToastWithOk('Starting 4 Digit Barcode is not Matched against the selected Site. ' + this.addAsset.value.site_id_description  + ' and 4 digit barcode ' + this.addAsset.value.ext_asset_id_pre + ' and after scan barcode digit is ' + firstDigit , 'warning');
              this.httpCommon.presentToastWithOk('Incorrect barcode!!  Starting 4 digits of the barcode does not match with the selected site ' + this.addAsset.value.site_id_description + '. The barcodes for the site begin with ' + firstDigit + '.' , 'warning');
            }
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

  ionViewDidLeave() {
    this.httpCommon.setBarcode('');
  }

  openScanner() {
    if (!this.addAsset.value.site_id_description) {
      this.httpCommon.presentToast('Please Select Site', 'warning');
      return;
    }
    this.router.navigateByUrl('/barcode');
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

  openPage(url: string) {
    this.router.navigateByUrl(url);
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
      this.addAsset.get('asset_img')?.setValue(blob);
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
      this.addAsset.get('asset_img2')?.setValue(blob);
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
      this.addAsset.get('asset_img3')?.setValue(blob);
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
      console.log(blob);
      this.addAsset.get('pur_invoice')?.setValue(blob);
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
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { faciity_type: this.addAsset.value.faciity_type}
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.data) {
        this.addAsset.get('ext_asset_id_pre')?.setValue(disModal.data.barcode_prefix);
        this.addAsset.get('site_id_description')?.setValue(disModal.data.pc_desc);
        this.addAsset.get('site_id')?.setValue(disModal.data.pc_id);
        this.addAsset.get('block_id')?.setValue('');
        this.addAsset.get('bldg_id')?.setValue('');
        this.addAsset.get('floor_id')?.setValue('');
        this.addAsset.get('floor_id_desc')?.setValue('');
        this.addAsset.get('loc_id')?.setValue('');
        this.addAsset.get('loc_id_desc')?.setValue('');
        // this.addAsset.get('ext_asset_id_pre')?.setValue('');
        this.addAsset.get('input_asset_id')?.setValue('');
        this.getBlockFromSqlite(disModal.data.pc_id);
        // this.presentLoading().then(preLoad => {
        //   this.httpAsset.getBlock(disModal.data.pc_id).subscribe({
        //     next:(data) => {
        //       if (data.status) {
        //         this.myBlocks = data.data;
        //       }
        //     },
        //     error:() => {
        //       this.dismissloading();
        //       this.httpCommon.presentToast(environment.errMsg + ' Block Err', 'danger');
        //     },
        //     complete:() => {
        //       this.dismissloading();
        //     }
        //   });
        // })

        // this.httpAsset.getPrefixBarcode(disModal.data.pc_id).subscribe(data => {
        //   console.log(data);
        //   if (data.status) {
        //     this.prefixBarcode = data.data.barcode_prefix;
        //     this.segmentType = data.data.seg_desc;
        //     this.city = data.data.ct_name;
        //     this.sub_segment = data.data.subseg_desc;
        //     this.addAsset.get('ext_asset_id_pre')?.setValue(this.prefixBarcode);
        //   }
        // });

      }
    });
    return await modal.present();
  }

  getBlockFromSqlite(pc_id: any){
    if (this.platform.is('capacitor')) {
      this.assetSqlite.getBlockFromSqlite(pc_id).then(res => {
        this.myBlocks = res;
      })
    } else {
      this.myBlocks = [{
        label: "NA",
        block_id : 1,
        pc_id: 1
      }]
    }

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
        this.addAsset.get('sub_dept_id')?.setValue('');
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
        this.addAsset.get('subgrp_id')?.setValue(disModal.data.subgrp_id);
        this.addAsset.get('subgrp_id_desc')?.setValue(disModal.data.label);
        setTimeout(() => {
          console.log(disModal.data.subgrp_class);
          this.addAsset.get('subgrp_class')?.setValue(disModal.data.subgrp_class);
        }, 100)

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
    if (!ev.target.value) {
      return;
    }
    let block_id = ev.target.value;
    this.presentLoading().then(preLoad => {
      if (this.platform.is('capacitor')) {
        this.assetSqlite.getBuildingFromSqlite(block_id).then(res => {
          this.myBuildingArr = res;
          this.addAsset.get('bldg_id')?.setValue('');
          this.addAsset.get('floor_id')?.setValue('');
          this.addAsset.get('floor_id_desc')?.setValue('');
          this.addAsset.get('loc_id')?.setValue('');
          this.addAsset.get('loc_id_desc')?.setValue('');
          this.dismissloading();
        }, err => {
          alert(JSON.stringify(err));
          this.dismissloading();
        })
      } else {
        this.dismissloading();
        this.myBuildingArr = [{
          "label": "TPF",
          "building_id": 1,

        },{
          "label": "UNATTI",
          "building_id": 2
        },{
          "label": "CWH",
          "building_id": 3
        }];
      }

      // this.httpAsset.getBuildingList(ev.target.value).subscribe({
      //   next:(data) => {
      //     if (data.status) {
      //       this.myBuildingArr = data.data;
      //       this.addAsset.get('bldg_id')?.setValue('');
      //       this.addAsset.get('floor_id')?.setValue('');
      //       this.addAsset.get('floor_id_desc')?.setValue('');
      //       this.addAsset.get('loc_id')?.setValue('');
      //       this.addAsset.get('loc_id_desc')?.setValue('')

      //     }
      //   },
      //   error:() => {
      //     this.dismissloading();
      //     this.httpCommon.presentToast(environment.errMsg, 'danger');
      //   },
      //   complete:() => {
      //     this.dismissloading();
      //   }
      // });
    })
  }


  async openFloorModal() {
    if (!this.addAsset.value.bldg_id) {
      this.httpCommon.presentToast('Please Select Building', 'warning');
      return;
    }
    const modal = await this.modalController.create({
      component: FloorComponent,
      cssClass: 'my-modal',
      componentProps : {
        bldg_id: this.addAsset.value.bldg_id
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.floorImage = disModal.data.floor_img;
        this.addAsset.get('floor_id_desc')?.setValue(disModal.data.label);
        this.addAsset.get('floor_id')?.setValue(disModal.data.floor_id);
        this.addAsset.get('loc_id')?.setValue('');
        this.addAsset.get('loc_id_desc')?.setValue('')
      }

    });
    return await modal.present();
  }

  async openLocationModal() {
    if (!this.addAsset.value.floor_id) {
      this.httpCommon.presentToast('Please Select Floor', 'warning');
      return;
    }
    const modal = await this.modalController.create({
      component: LocationComponent,
      cssClass: 'my-modal',
      componentProps : {
        floor_id: this.addAsset.value.floor_id
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        // this.floorImage = disModal.data.floor_img;
        this.addAsset.get('loc_id_desc')?.setValue(disModal.data.label);
        this.addAsset.get('loc_id')?.setValue(disModal.data.location_id);
      }

    });
    return await modal.present();
  }


  // chnageFloor(ev: any) {
  //   console.log(ev.target.value);
  //   if (!ev.target.value) {
  //     return;
  //   }
  //   let obj = this.myFloor.filter((val: any) => val.value === ev.target.value)[0];
  //   this.floorImage = obj.floor_img;
  //   console.log(this.floorImage);
  //   this.presentLoading().then(preLoad => {
  //     this.httpAsset.getLocation(ev.target.value).subscribe({
  //       next:(data) => {
  //         if (data.status) {
  //           this.addAsset.get('loc_id')?.setValue('');
  //           this.myLocation = data.data;
  //         } else {
  //           this.httpCommon.presentToast(data.msg, 'warning');
  //         }
  //       },
  //       error:() => {
  //         this.dismissloading();
  //         this.httpCommon.presentToast(environment.errMsg, 'danger');
  //       },
  //       complete:() => {
  //         this.dismissloading();
  //       }
  //     })
  //   })

  // }

  changeClientId() {
    return /^[A-Za-z0-9]*$/.test('str');
    // let a = this.addAsset.value.client_asset_id.replace(/^a-zA-Z0-9 ]/g, '')
    // console.log(a);
  }

  getFacilityType() {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getFacilityType().subscribe({
        next:(data) => {
          if (data.status) {
          this.facilityTypeArr = data.data;
            setTimeout(() => {
              if (this.facilityTypeArr.length > 0) {
                this.addAsset.get('faciity_type')?.setValue(this.facilityTypeArr[0].id);
              }
            }, 100);
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

  changeFacility(ev: any) {
    this.addAsset.get('site_id')?.setValue('');
    this.addAsset.get('site_id_description')?.setValue('');
    this.addAsset.get('block_id')?.setValue('');
    this.addAsset.get('bldg_id')?.setValue('');
    this.addAsset.get('floor_id')?.setValue('');
    this.addAsset.get('floor_id_desc')?.setValue('');
    this.addAsset.get('loc_id')?.setValue('');
    this.addAsset.get('loc_id_desc')?.setValue('');
    // console.log(ev.target.value);
    // this.httpAsset.getPlantByCategory(ev.target.value).subscribe(data => {
    //   console.log(data);
    //   if (data.status) {
    //     this.myPlantArr = data.data
    //   }
    // });
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
    if (this.platform.is('capacitor')) {
      this.presentLoading().then(preLoad => {
        this.assetSqlite.getSubDepartmentFromSqlite(id).then(res => {
          this.mySubDepartment = res;
          this.dismissloading();
        }, err => {
          this.dismissloading();
        })
        // this.httpAsset.getSubDepartment(id).subscribe(data => {
        //   console.log(data);
        //   this.dismissloading();
        //   if (data.status) {
        //     this.mySubDepartment = data.data
        //   }
        // }, err => {
        //   this.dismissloading();
        //   this.httpCommon.presentToast(environment.errMsg, 'danger');
        // });
      })
    } else {
      this.mySubDepartment = [{
        dept_desc :  "ACCONTANT ROOM",
        dept_ext_id :  null,
        dept_id: 1,
        sub_dept_desc : "ACCONTANT ROOM",
        sub_dept_id : 1
      },{
        dept_desc :  "ACCONTANT ROOM2",
        dept_ext_id :  null,
        dept_id: 2,
        sub_dept_desc : "ACCONTANT ROOM2",
        sub_dept_id : 2
      }]
    }

  }

  async openDeviceGroupModal() {
    const modal = await this.modalController.create({
      component: DeviceGroupComponent,
      cssClass: 'my-modal',
      componentProps : {
        bldg_id: this.addAsset.value.bldg_id
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.floorImage = disModal.data.floor_img;
        this.addAsset.get('grp_id_desc')?.setValue(disModal.data.label);
        this.addAsset.get('grp_id')?.setValue(disModal.data.grp_id);
        this.addAsset.get('subgrp_id_desc')?.setValue('');
        this.addAsset.get('subgrp_id')?.setValue('');
      }
    });
    return await modal.present();
  }



  // getDeviceGroup() {
  //   this.httpAsset.getDeviceGroup().subscribe(data => {
  //     console.log(data);
  //     if (data.status) {
  //       this.myDeviceGroup = data.data;
  //     }
  //   });
  // }

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
    // this.httpAsset.getOwnership().subscribe(data => {
    //   console.log(data);
    //   if (data.status) {
    //     this.myOwnership = data.data;
    //   }
    // });
    this.assetSqlite.getOwnerShipFromSqlite().then(res => {
      this.myOwnership = res;
    })
  }

  getEquipStatus() {
    // this.httpAsset.getEquipmentStatus().subscribe(data => {
    //   console.log(data);
    //   if (data.status) {
    //     this.myEquipStatus = data.data
    //   }
    // });

    this.assetSqlite.getEquipStatusFromSqlite().then(res => {
      this.myEquipStatus = res;
    });
  }

  getTechnology() {
    // this.httpAsset.getTechnology().subscribe(data => {
    //   console.log(data);
    //   if (data.status) {
    //     this.myTechnology = data.data
    //   }
    // });
    this.assetSqlite.getTechnologyFromSqlite().then(res => {
      this.myTechnology = res;
    })
  }

  getWarranty() {
    // this.httpAsset.getWarranty().subscribe(data => {
    //   console.log(data);
    //   if (data.status) {
    //     this.myWarranty = data.data;
    //   }
    // });
    this.assetSqlite.getWarrantyFromSqlite().then(res => {
      this.myWarranty = res;
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

  checkWarrantyCondition() {
    if (this.addAsset.value.warranty_id === 1 || this.addAsset.value.warranty_id === 2 || this.addAsset.value.warranty_id === 3) {
      if (!this.addAsset.value.warranty_start_date || !this.addAsset.value.warranty_end_date) {
        alert('Please select start date or end date under warranty information');
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
      if (this.addAsset.value.parent_asset_id.length == 11) {
        return true;
      } else {
        alert('Asset Parent Id Should have 11 Digit');
      }
    } else {
      return true;
    }
    return
  }

  // checkParentCondition() {
  //   if (this.addAsset.value.is_child_asset === '1') {
  //     if (this.addAsset.value.parent_asset_id.length == 10) {
  //       return true;
  //     } else {
  //       alert('Asset Parent Id Should have 10 Digit');
  //     }
  //   } else {
  //     return true;
  //   }
  //   return
  // }

  checkImageCondition() {
    if (this.img1 && this.img2 && this.img3) {
      return true;
    } else {
      this.httpCommon.presentToast('Image 1, Image 2 and Image 3 is Mandatory', 'warning');
      return false
    }
  }

  changeWarranty() {
    this.addAsset.get('warranty_start_date')?.setValue('');
    this.addAsset.get('warranty_end_date')?.setValue('');
  }

  saveAsset() {
    if (this.checkWarrantyCondition() && this.checkParentCondition() && this.checkImageCondition()) {
      this.submitAsset();
    }
  }

  submitAsset() {
    let prefix_barcode, barcode, fullbarcode, pur_date, install_date, warranty_start_date, warranty_end_date;
    pur_date = this.addAsset.value.pur_date;
    install_date! = this.addAsset.value.install_date,
    warranty_start_date = this.addAsset.value.warranty_start_date,
    warranty_end_date = this.addAsset.value.warranty_end_date,
    prefix_barcode = this.addAsset.value.ext_asset_id_pre;
    barcode = this.addAsset.value.input_asset_id;
    fullbarcode = prefix_barcode + barcode;
    if (pur_date) {
      this.addAsset.get('pur_date')?.setValue(moment(pur_date).format('YYYY-MM-DD'));
    }
    if (install_date) {
      this.addAsset.get('install_date')?.setValue(moment(install_date).format('YYYY-MM-DD')!);
    }

    if (warranty_start_date && warranty_end_date) {
      this.addAsset.get('warranty_start_date')?.setValue(moment(warranty_start_date).format('YYYY-MM-DD'));
      this.addAsset.get('warranty_end_date')?.setValue(moment(warranty_end_date).format('YYYY-MM-DD'));
    }

    this.addAsset.get('ext_asset_id')?.setValue(fullbarcode);
    this.addAssetOffline(this.addAsset.value);
    this.httpCommon.checkInternet().then(res => {
      if (res) {
        this.saveAssetServer();
      } else {
        this.httpCommon.presentToast('Asset Saved in Offline Mode', 'tertiary');
        this.parentAssetObj = { };
        this.formData = new FormData();
        this.clearField();
      }
    })

  }

  saveAssetServer() {
    this.stopRequest();
    this.presentLoading().then(preLoad => {
      this.addAsset.get('x_cor')?.setValue(this.coordinate.x);
      this.addAsset.get('y_cor')?.setValue(this.coordinate.y);
      for(let key in this.addAsset.value) {
        // this.formData.delete(key);
        // this.formData.append(key, this.addAsset.value[key])
        let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
        if ((key === 'pur_invoice' || key === 'asset_img' || key === 'asset_img2' || key === 'asset_img3') &&  this.addAsset.value[key]) {
          this.formData.delete(key);
          this.formData.append(key, this.addAsset.value[key], random)
        } else {
          this.formData.delete(key);
          this.formData.append(key, this.addAsset.value[key])
        }
      }
      // this.formData.delete('x_cor');
      // this.formData.delete('y_cor');
      // this.formData.append('x_cor', this.coordinate.x)
      // this.formData.append('y_cor', this.coordinate.y)
      // this.addAssetOffline(this.addAsset.value);
      // this.dismissloading();
      // return;
      this.pendingApi = this.httpAsset.submitAsset(this.formData).subscribe({
        next:(data) => {
          this.pendingApi = null;
          this.clrTime();
          if (data.status) {
            this.deleteAssetOffline(this.addAsset.value.ext_asset_id);
            this.httpCommon.presentToast(data.msg, 'success');
            this.parentAssetObj = { };
            this.formData = new FormData();
            this.clearField();
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          // this.addAssetOffline(this.addAsset.value);
          this.pendingApi = null;
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  async addAssetOffline(assetData: any) {
    console.log(assetData);
    await db.asset.add(assetData)
  }

  async deleteAssetOffline(ext_asset_id: any) {
    await db.asset.where({ext_asset_id: ext_asset_id}).delete();
  }

  stopRequest() {
    this.clrTime();
    this.clrTiimeOut = setTimeout(() => {
      console.log('clear timeout');
      if (this.pendingApi) {
        this.httpCommon.presentToastWithOk('Due to poor internet connectivity, your data submission failed. Please try again when your internet is stronger.', 'danger');
        this.pendingApi.unsubscribe();
        this.dismissloading();
      }
      this.clrTime();
    }, 90000);
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
    if (!this.addAsset.value.site_id) {
      alert('Please Select Site');
      return;
    }


    let firstDigit = this.addAsset.value.parent_asset_id.slice(0, 7);
    if (firstDigit !== this.addAsset.value.ext_asset_id_pre) {
      this.httpCommon.presentToastWithOk('Incorrect barcode!!  Starting 7 digits of the barcode does not match with the selected site ' + this.addAsset.value.site_id_description + '. The barcodes for the site begin with ' + firstDigit + '.' , 'warning');
      return;
    }
    // lastDigit = temp.slice(-6);

    this.parentAssetObj = {};
    this.presentLoading().then(preLoad => {
      this.httpAsset.getAssetParentId(this.addAsset.value.parent_asset_id, this.addAsset.value.site_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.parentAssetObj = data.data;
          } else {
            alert(data.msg);
          }
        },
        error:() => {
          this.dismissloading();
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })

  }

  // searchAssetId() {
  //   console.log(this.addAsset.value.parent_asset_id);
  //   if (!this.addAsset.value.parent_asset_id) {
  //     alert('Please Enter Asset Parent ID');
  //     return;
  //   }
  //   if (!this.addAsset.value.site_id) {
  //     alert('Please Select Site');
  //     return;
  //   }


  //   let firstDigit = this.addAsset.value.parent_asset_id.slice(0, 7);
  //   if (firstDigit !== this.addAsset.value.ext_asset_id_pre) {
  //     this.httpCommon.presentToastWithOk('Incorrect barcode!!  Starting 7 digits of the barcode does not match with the selected site ' + this.addAsset.value.site_id_description + '. The barcodes for the site begin with ' + firstDigit + '.' , 'warning');
  //     return;
  //   }
  //   // lastDigit = temp.slice(-6);

  //   this.parentAssetObj = {};
  //   this.presentLoading().then(preLoad => {
  //     this.httpAsset.getAssetParentId(this.addAsset.value.parent_asset_id, this.addAsset.value.site_id).subscribe({
  //       next:(data) => {
  //         if (data.status) {
  //           this.parentAssetObj = data.data;
  //         } else {
  //           alert(data.msg);
  //         }
  //       },
  //       error:() => {
  //         this.dismissloading();
  //       },
  //       complete:() => {
  //         this.dismissloading();
  //       }
  //     });
  //   })

  // }

  changeAssetParent() {
    this.parentAssetObj = {};
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



  changeDate(val?: string) {
    if (val === 'from') {
      this.addAsset.get('warranty_end_date')?.setValue('');
    }
    this.popoverDatetime.confirm(true);
  }

}
