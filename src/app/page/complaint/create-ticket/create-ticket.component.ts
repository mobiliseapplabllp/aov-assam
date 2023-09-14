import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';
import { ResponseModalComponent } from '../response-modal/response-modal.component';
import { CostCenterComponent } from '../../../shared/cost-center/cost-center.component';
import { Camera, CameraResultType } from '@capacitor/camera';
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
  loading!: any;
  fileName!: any;
  allIssueType: any = [];
  allRoName: any = [];
  allQueryCat: any = [];
  allSubCat1: any = [];
  allSubCat2: any = [];
  myCategory: any = [];
  userData: any = [];
  userName!: string;
  barcodeList: any = [];
  constructor(
    private platform: Platform,
    private formbuilder: FormBuilder,
    private httpComp: ComplaintService,
    private httpCommon: CommonService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    const isUser = localStorage.getItem('user');
    if (!isUser){
      return
    }
    this.userData = JSON.parse(isUser);
    this.userName = this.userData.user_name
    this.initializeForm();
  }

  initializeForm() {
    this.createForm = this.formbuilder.group({
      usr_name: [''],
      mobile: ['', Validators.required],
      issue_id: ['', Validators.required],
      is_barcode: [''],
      barcode: [''],
      multi_barcode: [''],
      pc_id: [''],
      category: [''],
      subcat1_id: [''],
      subcat2_id: [''],
      priority: ['', Validators.required],
      remark: [''],
      source: [environment.source]
    });
    this.createForm.get('usr_name')?.setValue(this.userName);

    this.getIssueType();
    // this.getCategory();
    this.getCostCenter();
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

  getQueryCategory() {
    if (!this.createForm.value.pc_id) {
      return
    }
    console.log('change');
    console.log(this.createForm.value.issue_id);
    console.log(this.createForm.value.pc_id);
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

  changeIssue() {
    this.createForm.get('pc_id')?.setValue('');
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
    // return;
    this.createForm.get('is_barcode')?.setValue('');
    this.createForm.get('barcode')?.setValue('');
    // this.createForm.get('pc_id').setValue('');
    this.createForm.get('category')?.setValue('');
    this.createForm.get('subcat1_id')?.setValue('');
    this.createForm.get('subcat2_id')?.setValue('');

  }

  changeQuery(ev: any) {
    if (!ev.target.value) {
      console.log('return 1')
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpComp.getQuerySubCat1(ev.target.value).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.allSubCat1 = data.data;
        }
      });
    });
  }

  changeSubCat(ev: any) {
    if (!ev.target.value) {
      console.log('return 2')
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpComp.getQuerySubCat2(ev.target.value).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allSubCat2 = data.data
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
      this.formData.delete(key);
      this.formData.append(key, this.createForm.value[key]);
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
    modal.onWillDismiss().then((disModal: any) => {
      console.log(disModal);
      if (disModal.data) {
        // this.searchValueDesc = disModal.data.cc_desc;
        // this.searchValue = disModal.data.cc_id;
      }
    });
    return await modal.present();
  }

  async openCamera() {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 40,
        allowEditing: false,
        width:700,
        height:700,
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
    // const actionSheet = await this.actionSheetController.create({
    //   header: 'Choose Option  ',
    //   cssClass: 'my-custom-class',
    //   buttons: [{
    //     text: 'Camera',
    //     role: 'destructive',
    //     icon: 'camera-outline',
    //     handler: () => {
    //       console.log('Delete clicked');
    //       this.chosePhotoOption(this.camera.PictureSourceType.CAMERA);
    //     }
    //   }, {
    //     text: 'Gallery',
    //     icon: 'image-outline',
    //     handler: () => {
    //       console.log('Share clicked');
    //       this.chosePhotoOption(this.camera.PictureSourceType.PHOTOLIBRARY);
    //     }
    //   }]
    // });
    // await actionSheet.present();
  }

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
  //     alert(JSON.stringify(err) + src);
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
  //   };
  // }

  // changePhoto(event): void {
  //   if (event.target.files.length > 0) {
  //     let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
  //     const file = event.target.files[0];
  //     console.log(file);
  //     this.formData.delete('img[]');
  //     this.formData.append('img[]', file, random);
  //   }
  // }

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
  //       this.createForm.get('pc_id')?.setValue(disModal.data.value);
  //       this.createForm.get('pc_id_desc')?.setValue(disModal.data.label);
  //     }
  //   });
  //   return await modal.present();
  // }

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
