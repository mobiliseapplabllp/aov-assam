import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.scss'],
})
export class TicketTypeComponent  implements OnInit {
  loading: any;
  public ticketForm!: FormGroup;
  barcodeList: any = [];
  requestData: any = [];
  ticket: any;
  issueType: any = [];
  query: any = [];
  subCategory: any = [];
  subCategory2: any = [];
  allData: any;
  ticketPriority: any = [];
  constructor(
    public formbuilder: FormBuilder,
    private httpComplaint: ComplaintService,
    private httpCommon: CommonService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    public navParam: NavParams,
  ) {
    this.ticket = this.navParam.get('requestedData');
    this.allData = this.navParam.get('allData');
    console.log(this.allData);
    console.log(this.ticket);
  }

  ngOnInit() {
    this.initForm();
    this.getPriority();
  }

  initForm() {
    this.ticketForm = this.formbuilder.group({
      issue_type: ['', Validators.required],
      is_barcode: [''],
      barcode: [''],
      category: [''],
      subcat1_id: [''],
      subcat2_id: [''],
      barcode_id: [''],
      ticketId: [''],
      tkt_priority: ['', Validators.required]
    });
    setTimeout(() => {
      this.ticketForm.get('ticketId')?.setValue(this.ticket);
    });
    console.log(this.ticket);
    this.getIssueType();
  }

  changeType() {
    this.ticketForm.get('is_barcode')?.setValue('');
    this.ticketForm.get('barcode')?.setValue('');
    this.ticketForm.get('category')?.setValue('');
    this.ticketForm.get('subcat1_id')?.setValue('');
    this.ticketForm.get('subcat2_id')?.setValue('');
    this.barcodeList = [];
    if (this.ticketForm.value.issue_type == 2) {
      this.getQueryCat();
    }
  }

  getIssueType() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getIssueType().subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.issueType = data.data;
          if (this.allData.issue_desc === 'Service') {
            setTimeout(() => {
              this.ticketForm.get('issue_type')?.setValue(2);
            }, 100)
          } else if (this.allData.issue_desc === 'Assets') {
            setTimeout(() => {
              this.ticketForm.get('issue_type')?.setValue(1);
              if (!this.allData.ext_asset_id) {
                this.ticketForm.get('is_barcode')?.setValue('0');

              }
            }, 100)
          }
        }
      });
    })
  }

  getQueryCat() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getQueryCategory(this.ticketForm.value.issue_type).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.query = data.data;
          setTimeout(() => {
            this.ticketForm.get('category')?.setValue(this.allData.cat_id);
          }, 100)
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  changeQuery(ev: any) {
    if (!ev.target.value) {
      return
    }
    this.ticketForm.get('subcat1_id')?.setValue('');
    this.ticketForm.get('subcat2_id')?.setValue('');
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getQuerySubCat1(ev.target.value).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.subCategory = data.data;
          setTimeout(() => {
            this.ticketForm.get('subcat1_id')?.setValue(this.allData.subcat1_id);
          }, 100)
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  changeSubCat(ev: any) {
    if (!ev.target.value) {
      return;
    }
    this.ticketForm.get('subcat2_id')?.setValue('');
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getQuerySubCat2(ev.target.value).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.subCategory2 = data.data;
          setTimeout(() => {
            this.ticketForm.get('subcat2_id')?.setValue(this.allData.subcat2_id);
          }, 100)
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      })
    })
  }

  searchClientId() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getClientIdBarcode(this.ticketForm.value.barcode).subscribe(data => {
        this.dismissloading();
        if (data.status === false) {
          this.httpCommon.presentToast(data.msg, 'warning');
        } else {
          this.barcodeList = data.data
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });

    });
    console.log(this.ticketForm.value.barcode);

  }
  dismiss(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  saveData() {
    console.log(this.ticketForm.value);
    this.presentLoading().then(preLoad => {
      this.httpComplaint.complaintTypeConfirm(this.ticketForm.value).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.dismiss(data, true);
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  getPriority() {
    this.httpComplaint.getTicketPriority(this.ticket).subscribe(data => {
      console.log(data);
      if (data.status) {
        this.ticketPriority = data.data;
      }

    }, err => {
      this.httpCommon.presentToast(environment.errMsg, 'danger');
    })
  }

  verify() {
    // if (!this.barcode) {
    //   this.presentToast('Enter Barcode No');
    // } else {
    //   this.presentLoading().then(loadres => {
    //     this.myAsset.verifyAsset(this.barcode, this.ticket).then(res => {
    //       this.dismissloading();
    //       if (res === false) {
    //         console.log('something went wrong');
    //       } else {
    //         this.getBarcodeResponse = res;
    //         if (this.getBarcodeResponse.status === false) {
    //           Swal.fire('OOPS....', this.getBarcodeResponse.info, 'info');
    //         } else if (this.getBarcodeResponse.status === true) {
    //           Swal.fire('Success', this.getBarcodeResponse.info, 'success').then(subres => {
    //             this.modalCtrl.dismiss(true);
    //           });
    //         }
    //       }
    //     });
    //   });
    // }
  }

  // submit() {
  //   if (this.ticketType === 'asset') {
  //     if (!this.barcode) {
  //         alert('Enter Barcode no');
  //     } else {
  //       if (this.barcode === 123) {
  //         this.modalCtrl.dismiss(null);
  //         this.router.navigate(['add-asset'], {
  //           queryParams: {
  //             data: JSON.stringify(this.paramsData),
  //           }
  //         });
  //       } else {
  //         Swal.fire('Verified', 'Alread Added ', 'success').then(res => {
  //           this.modalCtrl.dismiss(true);
  //         });
  //       }
  //     }
  //   } else if (this.ticketType === 'service') {
  //     this.modalCtrl.dismiss(true);
  //   } else {
  //     alert('Please Select Ticket Type');
  //   }
  // }

  // add_asset() {
  //   this.modalCtrl.dismiss(null);
  //   this.router.navigate(['add-asset'], {
  //     queryParams: {
  //       data: JSON.stringify(this.paramsData),
  //     }
  //   });
  // }

  // async presentToast(msg) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: 3000
  //   });
  //   toast.present();
  // }

  // openScanner() {
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     console.log('Barcode data', barcodeData);
  //     this.barcode = barcodeData.text;
  //   }).catch(err => {
  //     console.log('Error', err);
  //   });
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

}
