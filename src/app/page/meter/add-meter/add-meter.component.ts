import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ActionSheetController, NavController } from '@ionic/angular';
// import { AssetPlantComponent } from '../../../components/asset-plant/asset-plant.component';
import { environment } from '../../../../environments/environment';
// import { CommonService } from '../../../providers/common/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MeterService } from '../../../providers/meter/meter.service';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { File, FileEntry } from '@ionic-native/file/ngx';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { MeterService } from 'src/app/provider/meter/meter.service';
import { AssetPlantComponent } from '../../add-asset/asset-plant/asset-plant.component';
import { Camera, CameraResultType } from '@capacitor/camera';
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
  // isCordova!: boolean;
  formData = new FormData();
  img1!: string;
  img2!: string;
  img3!: string;
  constructor(
    private httpAsset: MyAssetGetService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private httpCommon: CommonService,
    private formbuilder: FormBuilder,
    private httpMeter: MeterService,
    private platform: Platform,
    // private camera: Camera,
    private actionSheetController: ActionSheetController,
    // private file: File,
    private navCtrl: NavController
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
      faciity_type: ['', Validators.required],
      site_id_description:[''],
      site_id: ['', Validators.required],
      block_id: ['', Validators.required],
      bldg_id: ['', Validators.required],
      floor_id: ['', Validators.required],
      location_id: ['', Validators.required],
      ext_id: ['', Validators.required],
      is_child_asset:['', Validators.required],
      meter_type_id: ['', Validators.required],
      meter_name: ['', Validators.required],
      uom_id: ['', Validators.required],
      unit_price: ['', Validators.required],
      model: ['', Validators.required],
      s_no: ['', Validators.required],
      read_frequency: ['', Validators.required],
      mnf_details: ['', Validators.required],
      remark: [''],
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
      } else {
      }
    });
    return await modal.present();
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

  changeFloor(ev: any) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getLocation(ev.target.value).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.myLocation = data.data;
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
      })
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

  addMeter() {
    for(let key in this.addAsset.value) {
      this.formData.delete(key);
      this.formData.append(key, this.addAsset.value[key]);
    }
    this.presentLoading().then(preLoad => {
      this.httpMeter.addMeter(this.formData).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.navCtrl.pop();
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
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

  // async presentActionSheet(imageno) {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Choose option',
  //     cssClass: 'my-custom-class',
  //     buttons: [{
  //       text: 'Camera',
  //       icon: 'camera-outline',
  //       handler: () => {
  //         this.photoOption(this.camera.PictureSourceType.CAMERA, imageno);
  //       }
  //     }, {
  //       text: 'Gallery',
  //       icon: 'albums-outline',
  //       handler: () => {
  //         this.photoOption(this.camera.PictureSourceType.PHOTOLIBRARY, imageno);
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  // photoOption(src, imageno) {
  //   const options: CameraOptions = {
  //     quality: 70,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     sourceType: src,
  //     correctOrientation: true
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.convertImageToFile(imageData, imageno);
  //   }, (err) => {
  //     alert(JSON.stringify(err));
  //   });
  // }

  // convertImageToFile(imageData, imageno) {
  //   this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
  //     entry.file(file => {
  //       console.log(file);
  //       if (imageno === 1) {
  //         this.img1 = file.size + '.jpg';
  //       } else if (imageno === 2) {
  //         this.img2 = file.size + '.jpg';
  //       } else if (imageno === 3) {
  //         this.img3 = file.size + '.jpg';
  //       }
  //       setTimeout(() => {
  //         this.read(file, imageno);
  //       }, 500);
  //     });
  //   }, err => {
  //     alert(JSON.stringify(err) + 'File Not Supported');
  //   });
  // }

  // read(file, imageno) {
  //   let random;
  //   random = Math.floor(Math.random() * 90000) + 10000;
  //   const reader = new FileReader();
  //   reader.readAsArrayBuffer(file);
  //   reader.onload = () => {
  //     const blob = new Blob([reader.result], {
  //       type: file.type
  //     });
  //     if (imageno === 1) {
  //       this.formData.delete('photo1');
  //       this.formData.append('photo1', blob, random + '.jpg');
  //       this.presentLoading().then(preLoad => {
  //         this.dismissloading();
  //         return;
  //       });
  //       return;
  //     }
  //     if (imageno === 2) {
  //       this.formData.delete('photo2');
  //       this.formData.append('photo2', blob, random + '.jpg');
  //       this.presentLoading().then(preLoad => {
  //         this.dismissloading();
  //         return;
  //       });
  //       return;
  //     }
  //     if (imageno === 3) {
  //       this.formData.delete('photo3');
  //       this.formData.append('photo3', blob, random + '.jpg');
  //       this.presentLoading().then(preLoad => {
  //         this.dismissloading();
  //         return;
  //       });
  //       return;
  //     }
  //   };
  // }


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

}
