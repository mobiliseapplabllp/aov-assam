import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, LoadingController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { CommonService } from 'src/app/provider/common/common.service';
import { DigitalChecklistService } from 'src/app/provider/digital-checklist/digital-checklist.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-digital-checklist',
  templateUrl: './digital-checklist.page.html',
  styleUrls: ['./digital-checklist.page.scss'],
})
export class DigitalChecklistPage implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  segmentStatus = 'assigned';
  allChecklist: any = [];
  loading: any;
  selectedDate = moment().format('YYYY-MM-DD');
  scanBarcode: any;
  isOnBehalf = 0;
  assignCheckList: any = [];
  attendedCheckList: any = [];
  qrType = 'null';
  constructor(
    private common: CommonService,
    private router: Router,
    private httpDigital: DigitalChecklistService,
    private loadingController: LoadingController,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.common.setBarcode('');
  }

  ionViewDidLeave() {
    this.common.setBarcode('');
    this.dismissloading();
  }

  ionViewDidEnter() {
    let bar = this.common.getBarcode();
    if (bar) {
      if (this.qrType == 'otherbarcode') {
        console.log('Your Barcode is ' + bar);
        this.common.setBarcode('');
        let temp, temp1;
        temp = bar;
        temp1 = temp.split('/');
        this.scanBarcode = temp1[5];
      } else {
        let temp, temp1;
        temp = bar;
        temp1 = temp.split('/');
        console.log(temp1);
        const obj = {
          sch_id: this.qrType,
          enc_barcode: temp1[5],
        }
        this.verifyBarcode(obj);
        return;
      }
    }
    if (!this.scanBarcode) {
      this.getSchedule(this.selectedDate);
    } else {
      this.getScheduleUsingBarcode(this.scanBarcode);
    }
  }

  getSchedule(date: any) {
    this.allChecklist = [];
    this.assignCheckList = [];
    this.attendedCheckList = [];
    this.isOnBehalf = 0;
    this.presentLoading().then(preLoad => {
      this.httpDigital.getScheduleHistory(date).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.allChecklist = data.data;
            this.assignCheckList = this.allChecklist.filter((val: any) => val.schedule_status == 'assigned');
            this.attendedCheckList = this.allChecklist.filter((val: any) => val.schedule_status == 'attended');
            this.isOnBehalf = 0;
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
          // let todayDate = moment().format('YYYY-MM-DD'), lastCheckListDate = localStorage.getItem('lastCheckListDate');
          // if (lastCheckListDate != todayDate) {
          //   localStorage.setItem('lastCheckListDate', '');
          //   localStorage.setItem('checkListData', '');
          //   this.getOfflineCheckListFromServer();
          // }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger')
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  getOfflineCheckListFromServer() {
    this.presentLoading('Checklist save in offline. it may take time').then(preLoad => {
      this.httpDigital.getOfflineCheckListFromServer().subscribe({
        next:(data: any) => {
          localStorage.setItem('lastCheckListDate', moment().format('YYYY-MM-DD'));
          localStorage.setItem('checkListData', JSON.stringify(data));
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg + ' In Saving Checklist Offline Mode', 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  getScheduleUsingBarcode(loc_id: any) {
    this.isOnBehalf = 0;
    this.assignCheckList = [];
    this.attendedCheckList = [];
    this.presentLoading().then(preLoad => {
      this.httpDigital.getSceduleMissed(loc_id).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.isOnBehalf = 1;
          this.allChecklist = data.data;
          this.assignCheckList = this.allChecklist.filter((val: any) => val.schedule_status == 'assigned');
          this.attendedCheckList = this.allChecklist.filter((val: any) => val.schedule_status == 'attended');
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
      })
    })
  }

  openPage(url: string) {
    this.router.navigateByUrl(url);
  }


  async presentLoading(msg?: any) {
    let message;
    if(msg) {
      message = msg
    } else {
      message = 'Please Wait.';
    }
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message,
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  changeDateComponent(ev: any) {
    console.log(ev.detail.value);
    this.popoverDatetime.confirm(true);
    this.selectedDate = moment(ev.detail.value).format('YYYY-MM-DD');
    this.getSchedule(this.selectedDate);
  }

  openFillReport(data: any) {

    if (!data.barcode || data.schedule_status === 'attended') {
      this.router.navigateByUrl('/digital-checklist/fill-report/' + data.schedule_id + '/' + this.isOnBehalf);
    } else {
      this.qrType = data.schedule_id;
      this.router.navigateByUrl('/barcode');
    }
  }

  verifyBarcode(obj: any){
    this.presentLoading().then(preLoad => {
      this.httpDigital.verifyAssetByQr(obj).subscribe({
        next:(dat: any) => {
          if (dat.status) {
            this.common.presentToast(dat.msg, 'success');
            this.router.navigateByUrl('/digital-checklist/fill-report/' + obj.sch_id + '/' + this.isOnBehalf);
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

  changeDate(action: any) {
    if (action == 'next') {
      console.log('nx');
      let next = moment(this.selectedDate).add(1, 'day').format('YYYY-MM-DD');
      this.selectedDate = next;
      this.getSchedule(this.selectedDate);
    } else {
      console.log('pre');
      let prev = moment(this.selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
      this.selectedDate = prev;
      this.getSchedule(this.selectedDate);
    }
  }

  openBarcode() {
    this.allChecklist = [];
    this.qrType = 'otherbarcode';
    this.router.navigateByUrl('/barcode');
  }
}
