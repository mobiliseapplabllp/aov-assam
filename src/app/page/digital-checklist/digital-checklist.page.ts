import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, LoadingController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { CommonService } from 'src/app/provider/common/common.service';
import { DigitalChecklistService } from 'src/app/provider/digital-checklist/digital-checklist.service';
import { environment } from 'src/environments/environment';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-digital-checklist',
  templateUrl: './digital-checklist.page.html',
  styleUrls: ['./digital-checklist.page.scss'],
})
export class DigitalChecklistPage implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  allChecklist: any = [];
  loading: any;
  selectedDate = moment().format('YYYY-MM-DD');
  scanBarcode: any;
  isOnBehalf = 0;
  constructor(
    private common: CommonService,
    private router: Router,
    private httpDigital: DigitalChecklistService,
    private loadingController: LoadingController,
    private platform: Platform,
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
  }

  ionViewDidLeave() {
    this.dismissloading();
  }

  ionViewDidEnter() {
    if (!this.scanBarcode) {
      this.getSchedule(this.selectedDate);
    } else {
      this.getScheduleUsingBarcode(this.scanBarcode);
    }
  }

  getSchedule(date: any) {
    this.allChecklist = [];
    this.isOnBehalf = 0;
    this.presentLoading().then(preLoad => {
      this.httpDigital.getScheduleHistory(date).subscribe({
        next:(data: any) => {
          console.log(data);
          if (data.status) {
            this.allChecklist = data.data;
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
    this.presentLoading().then(preLoad => {
      this.httpDigital.getSceduleMissed(loc_id).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.isOnBehalf = 1;
          this.allChecklist = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
      })
    })
  }

  openPage(url: any) {
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
    this.selectedDate = moment(ev.detail.value).format('YYYY-MM-DD');
    this.popoverDatetime.confirm(true);
    this.getSchedule(this.selectedDate);
  }

  openFillReport(schedule_id: any) {
    this.router.navigateByUrl('/digital-checklist/fill-report/' + schedule_id + '/' + this.isOnBehalf);
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
    if (this.platform.is('capacitor')) {
      this.barcodeScanner.scan().then(barcodeData => {
        let temp, temp1;
        temp = barcodeData.text;
        temp1 = temp.split('/');
        this.scanBarcode = temp1[5];
        this.getScheduleUsingBarcode(this.scanBarcode);
      }, err => {
        alert(JSON.stringify(err));
      })
    } else {
      this.scanBarcode = 5
      this.getScheduleUsingBarcode(this.scanBarcode);
    }
  }

}
