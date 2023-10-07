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
        temp1 = temp.split('qr=');
        const obj = {
          sch_id: this.qrType,
          enc_barcode: temp1[1],
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


  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
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
    // this.qrType = data.schedule_id;
    // this.router.navigateByUrl('/barcode');
    // return;
    if (!data.barcode) {
      this.router.navigateByUrl('/digital-checklist/fill-report/' + data.schedule_id + '/' + this.isOnBehalf);
    } else {
      this.qrType = data.schedule_id;
      this.router.navigateByUrl('/barcode');
      // if (this.platform.is('capacitor')) {
      //   this.barcodeScanner.scan().then(barcodeData => {
      //     let temp, temp1;
      //     temp = barcodeData.text;
      //     temp1 = temp.split('qr=');
      //     const obj = {
      //       sch_id: data.schedule_id,
      //       enc_barcode: temp1[1],
      //     }
      //     this.verifyBarcode(obj);
      //   }, err => {
      //     let msg = JSON.stringify(err);
      //     if (msg == 'Illegal access') {
      //       this.common.presentToast('You Need to allow the Permission', 'warning');
      //     } else {
      //       this.common.presentToast(JSON.stringify(err), 'warning');
      //     }
      //   })
      // } else {
      //   let temp, temp1;
      //   temp = 'https://ifmsuat.mobilisepro.com/#/complaint-qr-code/eyJpdiI6Ik1USXpORFUyTnpnNU1UQXhNVEV5TVE9PSIsInZhbHVlIjoiLytUMkk0L3BURGFyUmxJck9VR2F4Zz09IiwibWFjIjoiZDVlYjg4MjVlZjRkZDMxMzI5MDgyYzhhMWM5NmE1NDkzZmY0ZGJlMDAwMDc2OTA2MzQ4MTdmNTMzYzkxZjI4MSJ9?qr=eyJpdiI6Ik1USXpORFUyTnpnNU1UQXhNVEV5TVE9PSIsInZhbHVlIjoicmtzNUxERVlRTzlYcGYyNXNRN0N6eVp5cjZhS0sxMDJYSlNHRS9mU2RkRT0iLCJtYWMiOiJjNDRjMmQwMDIxOTMxNWMxNmMwOGRjMjhmYzJhZjhiN2EzNGFkMTk1MDU3MWU3MTgyNzZlYTU2ZDQwZjM4ZThjIn0';
      //   temp1 = temp.split('qr=');
      //   const obj = {
      //     sch_id: data.schedule_id,
      //     enc_barcode: temp1[1],
      //   }
      //   this.verifyBarcode(obj);
      // }
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
    // if (this.platform.is('capacitor')) {
    //   // this.barcodeScanner.scan().then(barcodeData => {
    //   //   let temp, temp1;
    //   //   temp = barcodeData.text;
    //   //   temp1 = temp.split('/');
    //   //   this.scanBarcode = temp1[5];
    //   //   this.getScheduleUsingBarcode(this.scanBarcode);
    //   // }, err => {
    //   //   let msg = JSON.stringify(err);
    //   //   if (msg == 'Illegal access') {
    //   //     this.common.presentToast('You Need to allow the Permission', 'warning');
    //   //   } else {
    //   //     this.common.presentToast(JSON.stringify(err), 'warning');
    //   //   }
    //   // })
    // } else {
    //   this.scanBarcode = 5
    //   this.getScheduleUsingBarcode(this.scanBarcode);
    // }
  }
}
