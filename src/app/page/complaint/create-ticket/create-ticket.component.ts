import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';
import { ResponseModalComponent } from '../response-modal/response-modal.component';
import { CostCenterComponent } from '../../../shared/cost-center/cost-center.component';
import { Camera, CameraResultType } from '@capacitor/camera';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { QueryCatComponent } from 'src/app/shared/query-cat/query-cat.component';
import { QuerySubCatComponent } from 'src/app/shared/query-sub-cat/query-sub-cat.component';
import { QuerySubCat2Component } from 'src/app/shared/query-sub-cat2/query-sub-cat2.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent  implements OnInit {
  createForm!: FormGroup;
  formData = new FormData();
  isSpinner!: boolean;
  isImageUpload = false;
  loading: any;
  fileName: any;
  buildingArr: any = [];
  floorArr: any = [];
  locationArr: any = [];
  allIssueType: any = [];
  allRoName: any = [];
  allQueryCat: any = [];
  allSubCat1: any = [];
  allSubCat2: any = [];
  myCategory: any = [];
  isCordova!: boolean;
  userData: any = [];
  userName!: string;
  barcodeList: any = [];
  requestType: any = [];

  constructor(
    private platform: Platform,
    private formbuilder: FormBuilder,
    private httpComp: ComplaintService,
    private httpCommon: CommonService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private router: Router
    // private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.httpCommon.setBarcode('');
    if (this.platform.is('capacitor')) {
      this.isCordova = true;
    } else {
      this.isCordova = false;
    }
    let temp = localStorage.getItem('user');
    if(temp) {
      this.userData = JSON.parse(temp);
    }
    console.log(this.userData);
    this.userName = this.userData.user_name;
    this.getEmpDetail();
    this.initializeForm();
  }

  initializeForm() {
    this.createForm = this.formbuilder.group({
      usr_name: ['', Validators.required],
      mobile: [''],
      email: ['', Validators.required],
      issue_id: ['', Validators.required],
      req_type_id: ['', Validators.required],
      is_barcode: [''],
      barcode: [''],
      multi_barcode: [''],
      pc_id: [''],
      pc_id_desc: [''],
      bldg_id: [''],
      floor_id: [''],
      loc_code: [''],
      category_desc: [''],
      category: [''],
      subcat1_id_desc: [''],
      subcat1_id: [''],
      subcat2_id_desc: [''],
      subcat2_id: [''],
      priority: ['', Validators.required],
      remark: ['', Validators.required],
      source: [environment.source]
    });
    this.createForm.get('usr_name')?.setValue(this.userName);

    this.getIssueType();
    // this.getRequestType();
    // this.getCategory();
    // this.getCostCenter();
  }

  ionViewDidEnter() {
    let bar = this.httpCommon.getBarcode();
    if (bar) {
      let token, fullurl;
      token = localStorage.getItem('token1');
      fullurl = bar + '?token=' + token;
      this.httpCommon.setBarcode('');
      console.log(fullurl);
      this.httpCommon.openDoc(fullurl);
    }
  }

  getEmpDetail() {
    this.httpComp.getEmpDetail().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.createForm.get('mobile')?.setValue(data.data.mobile);
        this.createForm.get('email')?.setValue(data.data.email);
      }
    });
  }

  getIssueType() {
    this.presentLoading().then(preLoad => {
      this.httpComp.getIssueType().subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.allIssueType = data.data;
          console.log(this.allIssueType);
        }
      });
    });
  }

  getRequestType(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComp.getRequestType(id).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.requestType = data.data;
        } else {
          this.httpCommon.presentToast(data.msg, 'danger');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })

  }

  openScanner() {
    this.router.navigateByUrl('/barcode');
    // if (this.platform.is('capacitor')) {
    //   // this.barcodeScanner.scan().then(barcodeData => {
    //   //   console.log('Barcode data', barcodeData);
    //   //   if (!barcodeData.text) {
    //   //     return
    //   //   }
    //   //   let token, fullurl;
    //   //   token = localStorage.getItem('token1');
    //   //   fullurl = barcodeData.text + '?token=' + token;
    //   //   this.httpCommon.openDoc(fullurl);
    //   //   // this.openWebPage(fullurl);
    //   // }, err => {
    //   //   let msg = JSON.stringify(err);
    //   //   if (msg == 'Illegal access') {
    //   //     this.httpCommon.presentToast('You Need to allow the Permission', 'warning');
    //   //   } else {
    //   //     this.httpCommon.presentToast(JSON.stringify(err), 'warning');
    //   //   }
    //   // })
    // } else {
    //   this.httpCommon.openDoc('https://ifmsuat.mobilisepro.com/#/auth');
    // }

  }

  async openWebPage(url: any) {
    // console.log('my site');
    // const modal = await this.modalCtrl.create({
    //   component: WebPageComponent,
    //   // cssClass: 'my-modal2',
    //   componentProps: { url: url }
    // });
    // modal.present();
  }


  getCategory() {
    this.httpComp.getCategory().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.myCategory = data.data
      } else {
        this.httpCommon.presentToast(data.msg, 'warning');
      }
    });
  }

  getCostCenter() {
    this.httpComp.getCostCenter().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.allRoName = data.data;
      }
    });
  }

  async openCategory() {
    if (!this.createForm.value.pc_id) {
      alert('Please Select Site');
      return;
    }
    const modal = await this.modalController.create({
      component: QueryCatComponent,
      cssClass: 'my-modal',
      componentProps : {
        issue_id: this.createForm.value.issue_id,
        pc_id: this.createForm.value.pc_id
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.createForm.get('category_desc')?.setValue(disModal.data.label);
        this.createForm.get('category')?.setValue(disModal.data.value);
        this.createForm.get('subcat1_id')?.setValue('');
        this.createForm.get('subcat1_id_desc')?.setValue('');
        this.createForm.get('subcat2_id')?.setValue('');
        this.createForm.get('subcat2_id_desc')?.setValue('');
        this.changeQuery(disModal.data.value);
        // this.createForm.get('pc_id_desc').setValue(disModal.data.label);
        // this.createForm.get('pc_id').setValue(disModal.data.value);
        // if (this.createForm.value.issue_id == 2) {
        //   this.getQueryCategory();
        // }
      }
    });
    return await modal.present();
  }

  getQueryCategory() {
    if (!this.createForm.value.pc_id) {
      return
    }
    this.resetField();
    if (this.createForm.value.issue_id == 2 && this.createForm.value.pc_id) {
      this.presentLoading().then(preLoad => {
        this.httpComp.getQueryCategoryTicket(this.createForm.value.issue_id, this.createForm.value.pc_id).subscribe(data => {
          this.dismissloading();
          console.log(data);
          if (data.status) {
            this.allQueryCat = data.data;
          }
        }, err => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        })
      })

    }
  }

  changeIssue(ev: any) {
    console.log(ev.target.value);
    this.createForm.get('pc_id')?.setValue('');
    this.createForm.get('pc_id_desc')?.setValue('');
    this.createForm.get('bldg_id')?.setValue('');
    this.createForm.get('floor_id')?.setValue('');
    this.createForm.get('loc_code')?.setValue('');

    this.createForm.get('pc_id_desc')?.setValue('');
    this.createForm.get('bldg_id')?.setValue('');
    this.createForm.get('floor_id')?.setValue('');
    this.createForm.get('category_desc')?.setValue('');
    this.createForm.get('subcat1_id_desc')?.setValue('');
    this.createForm.get('subcat2_id_desc')?.setValue('');


    this.getRequestType(ev.target.value);

  }

  // changeIssueType(ev) {
  //   console.log(ev.target.value);
  //   this.resetField();
  //   if (ev.target.value == 2) {
  //     this.httpComp.getQueryCategory(ev.target.value).subscribe(data => {
  //       console.log(data);
  //       if (data.status) {
  //         this.allQueryCat = data.data;
  //       }
  //     })
  //   }
  // }

  resetField() {
    this.createForm.get('is_barcode')?.setValue('');
    this.createForm.get('barcode')?.setValue('');
    this.createForm.get('category')?.setValue('');
    this.createForm.get('subcat1_id')?.setValue('');
    this.createForm.get('subcat2_id')?.setValue('');

  }

  async openCategorySubCat() {
    if(!this.createForm.value.category) {
      alert('Please Select Category');
      return;
    }
    const modal = await this.modalController.create({
      component: QuerySubCatComponent,
      cssClass: 'my-modal',
      componentProps : {
        qry_id: this.createForm.value.category,
        allData: this.allSubCat1,
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.createForm.get('subcat1_id_desc')?.setValue(disModal.data.label);
        this.createForm.get('subcat1_id')?.setValue(disModal.data.value);
        this.createForm.get('subcat2_id_desc')?.setValue('');
        this.createForm.get('subcat2_id')?.setValue('');
        this.allSubCat2 = [];
        this.changeSubCat(disModal.data.value);
      }
    });
    return await modal.present();
  }

  changeQuery(ev: any) {
    if (!ev) {
      return;
    }
    this.createForm.get('subcat1_id')?.setValue('');
    this.createForm.get('subcat2_id')?.setValue('');
    this.presentLoading().then(preLoad => {
      this.httpComp.getQuerySubCat1(ev).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.allSubCat1 = data.data;
        }
      });
    });
  }

  async openCategorySubCat2() {
    if(!this.createForm.value.subcat1_id) {
      alert('Please Select Category 1');
      return;
    }
    const modal = await this.modalController.create({
      component: QuerySubCat2Component,
      cssClass: 'my-modal',
      componentProps : {
        qry_id1: this.createForm.value.subcat1_id,
        allData: this.allSubCat2,
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.createForm.get('subcat2_id_desc')?.setValue(disModal.data.label);
        this.createForm.get('subcat2_id')?.setValue(disModal.data.value);
      }
    });
    return await modal.present();
  }

  changeSubCat(ev: any) {
    if (!ev) {
      return;
    }
    this.createForm.get('subcat2_id')?.setValue('');
    this.presentLoading().then(preLoad => {
      this.httpComp.getQuerySubCat2(ev).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allSubCat2 = data.data;
        }
      });
    });
  }

  checkValidation() {
    if (this.createForm.value.issue_id == '1') {
      if (this.createForm.value.is_barcode) {
        if (this.createForm.value.is_barcode == '1') {

        }
      } else {
        alert('Please Select Barocde Yes Or No');
      }
    }
  }

  submit() {
    for (let key in this.createForm.value)  {
      if (!this.createForm.value[key]) {
        this.formData.delete(key);
        this.formData.append(key, '');
      } else {
        this.formData.delete(key);
        this.formData.append(key, this.createForm.value[key]);
      }

    }
    if (this.createForm.value.is_barcode == '1') {
      this.multiBarcodeTicketAction();
    } else {
      this.ticketAction();
    }
  }

  multiBarcodeTicketAction() {
    if (this.barcodeList.length == 0) {
      alert('Please Search Barcode First');
      return;
    }
    const arr = this.barcodeList.filter((val: any) => val.isSelected == true);
    if (arr.length == 0) {
      alert('Please Select at least one Barcode');
      return;
    }
    this.formData.delete('barcodes[]');
    for (var i =0; i < this.barcodeList.length; i++) {
      if (this.barcodeList[i].isSelected) {
        this.formData.append('barcodes[]', this.barcodeList[i].ext_asset_id);
      }
    }
    this.presentLoading().then(preLoad => {
      this.httpComp.createMultipleTicketAction(this.formData).subscribe(data => {
        this.dismissloading();
        if(data.status) {

          this.openResponseModal(data.resData);
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      });
    })

  }

  ticketAction() {
    this.presentLoading().then(preLoad => {
      this.httpComp.createTicketAction(this.formData).subscribe(data => {
        this.dismissloading();
        console.log(data);
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

  async openResponseModal(data: any) {
    const modal = await this.modalController.create({
      component: ResponseModalComponent,
      cssClass: 'my-modal',
      componentProps : {data: JSON.stringify(data)}
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      this.navCtrl.pop();
      if (disModal.data) {
        // this.searchValueDesc = disModal.data.cc_desc;
        // this.searchValue = disModal.data.cc_id;
      }
    });
    return await modal.present();
  }

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Choose Option  ',
  //     cssClass: 'my-custom-class',
  //     buttons: [{
  //       text: 'Camera',
  //       role: 'destructive',
  //       icon: 'camera-outline',
  //       handler: () => {
  //         console.log('Delete clicked');
  //         this.chosePhotoOption(this.camera.PictureSourceType.CAMERA);
  //       }
  //     }, {
  //       text: 'Gallery',
  //       icon: 'image-outline',
  //       handler: () => {
  //         console.log('Share clicked');
  //         this.chosePhotoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  // chosePhotoOption(src) {
  //   const options: CameraOptions = {
  //     quality: 70,
  //     sourceType: src,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     correctOrientation: true
  //   };
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.isSpinner = true;
  //     this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
  //       setTimeout(() => {
  //         this.isSpinner = false;
  //         this.isImageUpload = true;
  //       }, 600);
  //       entry.file(file => {
  //         console.log(file);
  //         this.fileName = file.size + '.jpg';
  //         this.read(file);
  //       });
  //     }, err => {
  //       alert(JSON.stringify(err) + 'File Not Supported');
  //     });
  //   }, (err) => {
  //     // alert(JSON.stringify(err) + src);
  //     let errres = JSON.stringify(err);
  //     if (errres == '20') {
  //       alert('Plese Allow Camera Permission Or Gallery Permission');
  //     } else {
  //       alert(JSON.stringify(err) + src);
  //     }
  //   });
  // }

  // read(file) {
  //   let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
  //   const reader = new FileReader();
  //   reader.readAsArrayBuffer(file);
  //   reader.onload = () => {
  //     const blob = new Blob([reader.result], {
  //       type: file.type
  //     });
  //     this.formData.delete('img[]');
  //     this.formData.append('img[]', blob, random);
  //     this.fileName = file.size + '.png';
  //     this.presentLoading().then(preLoad => {
  //       this.dismissloading();
  //     })
  //   };
  // }

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
    this.fileName = random
    this.presentLoading().then(preLoad => {
      this.dismissloading();
    })
  }
  async presentActionSheet() {

  }

  changePhoto(event: any): void {
    if (event.target.files.length > 0) {
      let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
      const file = event.target.files[0];
      console.log(file);
      this.formData.delete('img[]');
      this.formData.append('img[]', file, random);
      this.fileName = 'a.png';
    }
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

  // async openRoName() {
  //   const modal = await this.modalController.create({
  //     component: CostCenterComponent,
  //     cssClass: 'my-modal',
  //     componentProps : { }
  //   });
  //   modal.onWillDismiss().then(disModal => {
  //     console.log(disModal);
  //     if (disModal.data) {
  //       this.createForm.get('pc_id').setValue(disModal.data.value);
  //       this.createForm.get('pc_id_desc').setValue(disModal.data.label);
  //     }
  //   });
  //   return await modal.present();
  // }

  async openRoName() {
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      if (disModal.role) {
        this.createForm.get('pc_id_desc')?.setValue(disModal.data.label);
        this.createForm.get('pc_id')?.setValue(disModal.data.value);
        this.createForm.get('category_desc')?.setValue('');
        this.createForm.get('category')?.setValue('');
        this.createForm.get('subcat1_id_desc')?.setValue('');
        this.createForm.get('subcat1_id')?.setValue('');
        this.createForm.get('subcat2_id_desc')?.setValue('');
        this.createForm.get('subcat2_id')?.setValue('');
        this.getBuilding(disModal.data.value);
      }
    });
    return await modal.present();
  }

  getBuilding(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComp.getBuildingList(id).subscribe({
        next:(data: any) => {
          console.log(data);
          if (data.status) {
            this.buildingArr = data.data;
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

  changeBuilding(ev: any) {
    let id = ev.target.value;
    if(!id) {
      return;
    }
    this.getFloorList(id)
  }

  getFloorList(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComp.getFloorList(id).subscribe({
        next:(data: any) => {
          if (data.status) {
            this.floorArr = data.data;
          } else {
            this.httpCommon.presentToast(data.msg , 'warning');
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

  changeFloor(ev: any) {
    let id = ev.target.value;
    if (!id) {
      return;
    }
    this.getLocation(id);
  }

  getLocation(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComp.getLocationList(id).subscribe({
        next:(data) => {
          if (data.status) {
            this.locationArr = data.data
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

  searchBarcode() {
    console.log(this.createForm.value.barcode);
    this.presentLoading().then(preLoad => {
      this.httpComp.getClientIdBarcode(this.createForm.value.barcode).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.barcodeList = data.data;
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }


  submitTest() {
    console.log(this.barcodeList);
    for (var i =0; i < this.barcodeList.length; i++) {
      if (this.barcodeList[i].isSelected) {
        this.formData.append('barcodes[]', this.barcodeList[i].ext_asset_id);
      }
      console.log(this.barcodeList[i].isSelected);
    }
  }

  changeHasBarcode() {
    this.barcodeList = [];
  }

}
