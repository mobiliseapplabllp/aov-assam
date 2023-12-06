import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { IonDatetime, LoadingController } from '@ionic/angular';
import { MeterService } from 'src/app/provider/meter/meter.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  selectedDate = moment().format('YYYY-MM-DD');
  customCalendar: any = [];
  history: any = [];
  loading: any;
  constructor(
    private httpMeter: MeterService,
    private common: CommonService,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
   this.getMeterWoHistory(this.selectedDate);
  }

  getMeterWoHistory(date: any) {
    this.history = [];
    this.presentLoading().then(preLoad => {
      this.httpMeter.getMeterWoHistory(date).subscribe({
        next:(data) => {
          if (data.status) {
            this.history = data.data;
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    });
  }

  changeDate(action: any) {
    if (action == 'next') {
      console.log('nx');
      let next = moment(this.selectedDate).add(1, 'day').format('YYYY-MM-DD');
      this.selectedDate = next;
      this.getMeterWoHistory(this.selectedDate);
    } else {
      console.log('pre');
      let prev = moment(this.selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
      this.selectedDate = prev;
      this.getMeterWoHistory(this.selectedDate);
    }
  }

  changeDateComponent(ev: any) {
    console.log(ev.detail.value);
    this.popoverDatetime.confirm(true);
    this.selectedDate = moment(ev.detail.value).format('YYYY-MM-DD');
    this.getMeterWoHistory(this.selectedDate);
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

  openDoc(url: any) {
    this.common.openDoc(url);
  }

  meterReadingHistory(dat: any) {
    this.router.navigate(['meter/reading-history'], {
      queryParams: {
        data: JSON.stringify(dat),
      }
    });
  }
}
