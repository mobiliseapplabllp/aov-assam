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
  requestData1: any = [];
  ticket: any;
  issueType: any = [];
  query: any = [];
  subCategory: any = [];
  subCategory2: any = [];
  allData: any;
  ticketPriority: any = [];
  selectPriorityObj: any = {};
  requestType: any = [];
  buildingArr: any = [];
  floorArr: any = [];
  locationArr: any = [];
  isShowBuilding = false;
  locations: any = [];
  constructor(
    public formbuilder: FormBuilder,
    private httpComplaint: ComplaintService,
    private httpCommon: CommonService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    public navParam: NavParams) {
      this.allData = this.navParam.get('allData');
      console.log(this.allData);
      console.log(this.locations);

      this.ticket = this.allData.tkts_id;
      if ((this.allData.tkts_issue_id == 2) || this.allData.tkts_issue_id == 1 && !this.allData.ext_asset_id) {
        this.isShowBuilding = true;
      }
      this.getBuilding(this.allData.pc_id);
      this.getRequestType(this.allData.tkts_issue_id);
  }

  ngOnInit() {
    this.initForm();
    this.getPriority();
    console.log(this.requestData1);
  }

  getRequestType(id: any) {
    this.httpComplaint.getRequestType(id).subscribe({
      next:(data) => {
        if (data.status) {
        this.requestType = data.data;
          setTimeout(() => {
            this.ticketForm.get('req_type_id')?.setValue(this.allData.req_type_id);
          }, 100);
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      },
      error:() => {
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      },
      complete:() => {

      }
    });
  }

  initForm() {
    this.ticketForm = this.formbuilder.group({
      issue_type: ['', Validators.required],
      req_type_id: [''],
      tkt_tag: [''],
      is_barcode: [''],
      barcode: [''],
      category: [''],
      bldg_id: [''],
      floor_id: [''],
      loc_code: [''],
      subcat1_id: [''],
      subcat2_id: [''],
      barcode_id: [''],
      ticketId: [''],
      tkt_priority: ['', Validators.required]
    });
    setTimeout(() => {
      this.ticketForm.get('ticketId')?.setValue(this.ticket);
      this.ticketForm.get('tkt_tag')?.setValue(this.requestData1.tkt_tag.toString())
    });
    this.getIssueType();
  }

  changeRadio() {
    console.log('change radio')
    this.ticketForm.get('bldg_id')?.setValue('');
    this.ticketForm.get('floor_id')?.setValue('');
    this.ticketForm.get('loc_code')?.setValue('');
    this.isShowBuilding = false
  }

  changeIsBarcode(ev: any) {
    this.ticketForm.get('barcode')?.setValue('');
    this.ticketForm.get('barcode_id')?.setValue('');
    this.barcodeList = [];
    if (ev.target.value == 0) {
      this.isShowBuilding = true;
      setTimeout(() => {
        if (this.locations.length > 0) {
          this.ticketForm.get('bldg_id')?.setValue(this.locations[0].building_id)
        }
      }, 100);
    }
  }

  getBuilding(id: any) {
    this.httpComplaint.getBuildingList(id).subscribe({
      next:(data) => {
        console.log(data);
        if (data.status) {
          this.buildingArr = data.data;
          if (this.locations.length > 0) {
            setTimeout(() => {
              this.ticketForm.get('bldg_id')?.setValue(this.locations[0].building_id)
            }, 100);
          }
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      },
      error:() => {
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      },
      complete:() => {
      }
    })
  }

  changeBuilding(ev: any) {
    let id = ev.target.value;
    if(!id) {
      return;
    }
    this.dismissloading();
    this.getFloorList(id)
  }

  getFloorList(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getFloorList(id).subscribe({
        next:(data) => {
          if (data.status) {
            this.floorArr = data.data;
            if (this.locations.length > 0) {
              setTimeout(() => {
                this.ticketForm.get('floor_id')?.setValue(this.locations[0].floor_id);
              }, 100);
            }
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
    this.dismissloading();
    this.getLocation(id);
  }

  getLocation(id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getLocationList(id).subscribe({
        next:(data) => {
          if (data.status) {
            this.locationArr = data.data;
            setTimeout(() => {
              if (this.locations.length > 0) {
                this.ticketForm.get('loc_code')?.setValue(this.locations[0].id)
              }
            }, 100)
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
              } else {
                this.ticketForm.get('is_barcode')?.setValue('1');
                this.ticketForm.get('barcode')?.setValue(this.allData.ext_asset_id);
                this.searchClientId();
              }
            }, 100)
          }
        }
      });
    })
  }

  getQueryCat() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getQueryCategory(this.ticketForm.value.issue_type).subscribe({
        next:(data) => {
          if (data.status) {
            this.query = data.data;
            setTimeout(() => {
              this.ticketForm.get('category')?.setValue(this.allData.cat_id);
            }, 100)
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

  changeQuery(ev: any) {
    if (!ev.target.value) {
      return
    }
    this.ticketForm.get('subcat1_id')?.setValue('');
    this.ticketForm.get('subcat2_id')?.setValue('');
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getQuerySubCat1(ev.target.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.subCategory = data.data;
            setTimeout(() => {
              this.ticketForm.get('subcat1_id')?.setValue(this.allData.subcat1_id);
            }, 100)
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

  changeSubCat(ev: any) {
    if (!ev.target.value) {
      return;
    }
    this.ticketForm.get('subcat2_id')?.setValue('');
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getQuerySubCat2(ev.target.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.subCategory2 = data.data;
            setTimeout(() => {
              this.ticketForm.get('subcat2_id')?.setValue(this.allData.subcat2_id);
            }, 100)
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

  searchClientId() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getClientIdBarcode(this.ticketForm.value.barcode).subscribe({
        next:(data) => {
          if (data.status === false) {
            this.httpCommon.presentToast(data.msg, 'warning');
          } else {
            this.barcodeList = data.data;
            if (this.allData.ext_asset_id) {
              let obj, asset_id;
              obj = this.barcodeList.filter((val: any) => val.ext_asset_id === this.allData.ext_asset_id);
              console.log(obj);
              if (obj.length > 0) {
                asset_id = obj[0].asset_id;
                console.log(asset_id);
                this.ticketForm.get('barcode_id')?.setValue(asset_id);
              }
            }
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
    });
    console.log(this.ticketForm.value.barcode);

  }
  dismiss(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  saveData() {
    console.log(this.ticketForm.value);
    this.presentLoading().then(preLoad => {
      this.httpComplaint.complaintTypeConfirm(this.ticketForm.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.httpCommon.presentToast(data.msg, 'success');
            this.dismiss(data, true);
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

  getPriority() {
    this.httpComplaint.getTicketPriority(this.ticket).subscribe({
      next:(data) => {
        if (data.status) {
          this.ticketPriority = data.data;
        }
      },
      error:() => {
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      },
      complete:() => {

      }
    })
  }

  changePriority(ev: any) {
    console.log(ev.target.value);
    this.selectPriorityObj = this.ticketPriority.filter((val: any) => val.id == ev.target.value)[0];
    console.log(this.selectPriorityObj);
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

  async presentLoading() {
    this.dismissloading();
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 8000
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

}
