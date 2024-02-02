import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { CostCenterComponent } from 'src/app/shared/cost-center/cost-center.component';
import { environment } from 'src/environments/environment';
import { PmAssignComponent } from './pm-assign/pm-assign.component';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PtwUploadComponent } from './ptw-upload/ptw-upload.component';
import { DigitalChecklistService } from 'src/app/provider/digital-checklist/digital-checklist.service';
import { ClosePmsComponent } from './close-pms/close-pms.component';
@Component({
  selector: 'app-pm-cal',
  templateUrl: './pm-cal.page.html',
  styleUrls: ['./pm-cal.page.scss'],
})
export class PmCalPage implements OnInit {
  status = 'open';
  pmCal: any = [];
  pmCalCopy: any = [];
  resolvedPm: any = [];
  resolvedPmCopy: any = [];
  loading: any;
  userData: any = [];
  pmCalBoolean!: boolean;
  pmCalResBoolean!: boolean;
  counter = 0;
  userInfo: any = [];
  userName!: string;
  openPm: any = [];
  openPmCopy: any = [];
  actionPm: any = [];
  actionPmCopy: any = [];
  closePm: any = [];
  closePmCopy: any = [];
  lastSegment = 1;
  lastPage: any;
  currentPage = 1;
  myWorkOrder: any = [];
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 2.5,
    autoplay: false,
    slideShadows: true,
   };
   selectedPms: any = [];
   searchBy: any;
   searchValue: any;searchValueDesc: any;
   fileName1!: string;
   selectedBarcode: any;
  constructor(
    private loadingController: LoadingController,
    private httpPms: PmCalService,
    private common: CommonService,
    private modalCtrl: ModalController,
    private router: Router,
    private httpDigital: DigitalChecklistService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.common.setBarcode('');
  }

  ionViewDidEnter() {
    let bar = this.common.getBarcode();
    if (bar) {
      let temp, temp1;
      temp = bar;
      temp1 = temp.split('/');
      const obj = {
        sch_id: '',
        wo_id: this.selectedBarcode.wo_id,
        enc_barcode: temp1[5],
        type: 'pms',
      }
      this.verifyBarcode(obj);
      return;
    }
    this.getPm(this.lastSegment);
  }

  verifyBarcode(obj: any){
    this.presentLoading().then(preLoad => {
      this.httpDigital.verifyAssetByQr(obj).subscribe({
        next:(dat: any) => {
          if (dat.status) {
            this.common.setBarcode('');
            this.openPage(this.selectedBarcode);
          } else {
            this.common.presentToast(dat.msg, 'warning');
          }
        }, error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        }, complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  ionViewDidLeave() {
    this.dismissloading();
  }

  getPm(stage_id: any) {
    this.refreshField();
    this.currentPage = 1;
    this.presentLoading().then(() => {
      this.httpPms.getPm(stage_id, this.currentPage).subscribe({
        next:(dat) => {
          if (dat.status) {
            this.pmCal = dat.data.data;
            this.lastPage = dat.data.last_page;
            this.currentPage = this.currentPage + 1;
            if (stage_id == 1) {
              this.openPm = this.pmCal.filter((val: any) => val.stage_id === 1);
              this.openPmCopy = this.pmCal.filter((val: any) => val.stage_id === 1);
            } else if (stage_id == 2) {
              this.actionPm = this.pmCal.filter((val: any) => val.stage_id === 2);
              this.actionPmCopy = this.pmCal.filter((val: any) => val.stage_id === 2);
            } else if (stage_id == 3) {
              this.closePm = this.pmCal.filter((val: any) => val.stage_id == 3)
              this.closePmCopy = this.pmCal.filter((val: any) => val.stage_id == 3)
            }
          } else {
            this.pmCal = [];
            this.common.presentToast(dat.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'warning');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    });
  }

  refreshField() {
    this.pmCal = [];
    this.openPm = [];
    this.openPmCopy = [];
    this.actionPm = [];
    this.actionPmCopy = [];
    this.closePm = [];
    this.closePmCopy = [];
  }

  async closedPms(data: any) {
    const modal = await this.modalCtrl.create({
      component: ClosePmsComponent,
      cssClass: 'my-modal2',
      componentProps : {
        data: data
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.openPm = this.openPm.filter((val: any) => val.wo_id !== disModal.data.wo_id);
      }
    });
    return await modal.present();
  }

  multiAssign() {
    console.log(this.openPm);
    const obj =this.openPm.filter((val: any) => val.isSelect == true);
    console.log(obj);
    this.pmAssign(obj);
  }

  changeCheckbox(val: any) {
    console.log(val);
    setTimeout(() => {
      this.selectedPms = this.openPm.filter((val: any) => val.isSelect == true);
      console.log(this.selectedPms);
    }, 500);
  }

  async pmAssign(dat: any) {
    const modal = await this.modalCtrl.create({
      component: PmAssignComponent,
      cssClass: 'my-modal',
      componentProps: { data: dat }
    });
    modal.onWillDismiss().then(disModal => {
      if (disModal.role) {
        console.log('ff');
        this.httpPms.getData().subscribe((data: any) => {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            this.openPm = this.openPm.filter((val: any) => val.wo_id !== data[i].wo_id);
          }
        });
      }
    });
    modal.present();
  }

  cretePM() {
    // this.router.navigateByUrl('/pm-calibration/create-pm');
  }

  viewAttachment(url: string) {
    this.common.openDoc(url);
  }

  openFillReport(data: any) {
    if (this.platform.is('capacitor')) {
      if (data.ext_asset_id) {
        this.openBarcode(data)
      } else {
        this.openPage(data);
      }
    } else {
      this.openPage(data);
    }

  }

  openBarcode(data: any) {
    this.selectedBarcode = data;
    this.router.navigateByUrl('/barcode');
  }

  openPage(data: any) {
    this.router.navigate(['/pm-calibration/pm-report'], {
      queryParams: {
        data: JSON.stringify(data),
      }
    });
  }

  async openRoName() {
    const modal = await this.modalCtrl.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.searchValueDesc = disModal.data.label;
        this.searchValue = disModal.data.value;
      }
    });
    return await modal.present();
  }

  async uploadPtw(dat: any) {
    const modal = await this.modalCtrl.create({
      component: PtwUploadComponent,
      cssClass: 'my-modal2',
      componentProps : {
        data: dat
      }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        console.log(disModal.data.ptw_attach);
        dat.ptw_attach = disModal.data.ptw_attach
      }
    });
    return await modal.present();
  }



  searchWoFromServer(stage_id: any) {
    if (this.searchBy == 'all') {
      this.getPm(1);
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpPms.searchTicketFromServer(this.searchBy, this.searchValue).subscribe(dat => {
        this.dismissloading();
        this.refreshField();
        if (dat.status) {
          this.pmCal = dat.data.data;
          this.lastPage = dat.data.last_page;
          this.currentPage = this.currentPage + 1;
          if (stage_id == 1) {
            this.openPm = this.pmCal.filter((val: any) => val.stage_id === 1);
            this.openPmCopy = this.pmCal.filter((val: any) => val.stage_id === 1);
          } else if (stage_id == 2) {
            this.actionPm = this.pmCal.filter((val: any) => val.stage_id === 2);
            this.actionPmCopy = this.pmCal.filter((val: any) => val.stage_id === 2);
          } else if (stage_id == 3) {
            this.closePm = this.pmCal.filter((val: any) => val.stage_id == 3)
            this.closePmCopy = this.pmCal.filter((val: any) => val.stage_id == 3)
          }
        } else {
          this.pmCal = [];
        }
      });

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

  changeSeg(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value == 'open') {
      this.lastSegment = 1;
      this.getPm(this.lastSegment);
    } else if (ev.target.value == 'actionable') {
      this.lastSegment = 2;
      this.getPm(this.lastSegment);
    } else if (ev.target.value == 'closed') {
      this.lastSegment = 3;
      this.getPm(this.lastSegment);
    } else if (ev.target.value == 'mywo') {
      console.log('mywo');
    }
  }

  async presentActionSheet(data: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image, data)
    };
    takePicture();
  }

  async readImg(photo: any, data: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    let formData = new FormData();
      formData.append('attach', blob, random);
      formData.append('id', data.id)
      data.imgname_tmp = random;
      data.docname_tmp = '';
      this.presentLoading().then(preLoad => {
        this.httpPms.uploadPtw(formData).subscribe(res => {
          console.log(data);
          this.dismissloading();
          if (res.status) {
            this.common.presentToast(res.msg, 'success');
            data.ptw_attach = res.ptw_attach
            data.showPtw =  false
          } else {
            this.common.presentToast(res.msg, 'warning');
          }
        }, err => {
          data.imgname_tmp = ''
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        });
      })
  }


  changeFile(fileChangeEvent: any, data: any){
    const photo = fileChangeEvent.target.files[0];
    console.log(photo);
    console.log(data);
    let formData = new FormData();
      formData.append('attach', photo, photo.name);
      formData.append('id', data.id)
      data.imgname_tmp = '';
      data.docname_tmp = photo.name
      this.presentLoading().then(preLoad => {
        this.httpPms.uploadPtw(formData).subscribe(res => {
          this.dismissloading();
          console.log(res);
          if (res.status) {
            this.common.presentToast(res.msg, 'success');
            data.ptw_attach = res.ptw_attach
            data.showPtw = false
          } else {
            this.common.presentToast(res.msg, 'warning');
          }
        }, err => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        });
      })
  }

  loadData(event: any, stage_id: any) {
    this.httpPms.getPm(stage_id, this.currentPage).subscribe({
      next:(dat) => {
        if (dat.status) {
          this.pmCal = dat.data.data;
          this.currentPage = this.currentPage + 1;
          if (stage_id == 1) {
            let obj;
            obj = this.pmCal.filter((val: any) => val.stage_id === 1);
            this.openPm = [...this.openPm, ...obj];
            this.openPmCopy = [...this.openPmCopy, ...obj];
          } else if (stage_id == 2) {
            let obj;
            obj = this.pmCal.filter((val: any) => val.stage_id === 2);
            this.actionPm = [...this.actionPm, ...obj];
            this.actionPmCopy = [...this.actionPmCopy, ...obj];
          } else if (stage_id == 3) {
            let obj;
            obj = this.pmCal.filter((val: any) => val.stage_id === 3);
            this.closePm = [...this.closePm, ...obj];
            this.closePmCopy = [...this.closePmCopy, ...obj];
          }
        } else {
          this.common.presentToast(dat.msg, 'warning');
        }
      },
      error:() => {
        event.target.complete();
        this.common.presentToast(environment.errMsg, 'danger');
      },
      complete:() => {
        event.target.complete();
      }
    });
  }

  searchItem(ev: any, val: any) {
    console.log(ev.target.value);
    if (val == 1) {
      this.openPm = this.openPmCopy;
      this.openPm = this.openPm.filter((data: any) => {
        if ((data.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.chklist_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.chklist_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.wo_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.wo_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.ro_cont_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.ro_cont_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }  else if ((data.rgn_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.rgn_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    } else if (val == 2) {
      this.actionPm = this.actionPmCopy;
      this.actionPm = this.openPm.filter((data: any) => {
        if ((data.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.chklist_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.chklist_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.wo_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.wo_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.ro_cont_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.ro_cont_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }  else if ((data.rgn_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.rgn_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    } else if (val == 3) {
      this.closePm = this.closePmCopy;
      this.closePm = this.closePm.filter((data: any) => {
        if ((data.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.chklist_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.chklist_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.wo_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.wo_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((data.ro_cont_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.ro_cont_no.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }  else if ((data.rgn_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.rgn_name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }

  openViewReport(data: any) {
    this.router.navigate(['/pm-calibration/view-report'], {
      queryParams: {
        data: JSON.stringify(data),
      }
    });
  }

}
