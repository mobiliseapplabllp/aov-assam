import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { MealCheckinService } from 'src/app/provider/meal-checkin/meal-checkin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meal-checkin',
  templateUrl: './meal-checkin.page.html',
  styleUrls: ['./meal-checkin.page.scss'],
})
export class MealCheckinPage implements OnInit {
  public checkinMeal!: FormGroup;
  allRoName: any = [];
  allLocation: any = [];
  itemList: any = [];
  allRoaster: any = [];
  loading: any;
  constructor(
    private formbuilder: FormBuilder,
    private common: CommonService,
    private httpComplaint: ComplaintService,
    private loadingController: LoadingController,
    private httpMeal: MealCheckinService,
    private router: Router
  ) { }

  ngOnInit() {
    this.common.setBarcode('');
    this.initForm();
    this.getPcCode();
  }

  ionViewDidEnter() {
    let bar = this.common.getBarcode();
    if (bar) {
      console.log(bar);
      this.submit(bar);
      this.common.setBarcode('');
    }
  }

  initForm() {
    this.checkinMeal = this.formbuilder.group({
      pc_id: ['', Validators.required],
      loc_id: ['', Validators.required],
      roaster_id: ['', Validators.required]

    });
  }

  getPcCode() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getCostCenter().subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allRoName = data.data
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.common.presentToast(environment.errMsg, 'danger');
        this.dismissloading();
      });
    })
  }

  changeRo(ev: any) {
    this.presentLoading().then(preLoad => {
      this.httpMeal.getFoodYou(ev.target.value).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allLocation = data.data
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
      })
    })
  }

  changeLocation(ev: any) {
    console.log(ev.target.value);
    this.httpMeal.mealLocation(8, ev.target.value).subscribe(data => {
      if (data.status) {
        this.allRoaster = data.data;
      } else {
        this.common.presentToast(data.msg, 'warning');
      }
    }, err => {
      this.common.presentToast(environment.errMsg, 'danger');
    });
  }

  changeRoster(ev: any) {
    console.log(ev.target.value);
    this.itemList = this.allRoaster.filter((val: any) => val.meal_type_id === ev.target.value)[0];

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissloading() {
    this.loading.dismiss();
  }

  openQrScanner() {
    this.router.navigateByUrl('/barcode');
    // this.barcodeScanner.scan().then(barcodeData => {
    //   console.log('Barcode data', barcodeData);
    //   // this.barcode = barcodeData.text;
    //   if (barcodeData.text) {
    //     this.submit(barcodeData.text);
    //   }

    // }, err => {
    //   let msg = JSON.stringify(err);
    //   if (msg == 'Illegal access') {
    //     this.common.presentToast('You Need to allow the Permission', 'warning');
    //   } else {
    //     this.common.presentToast(JSON.stringify(err), 'warning');
    //   }
    // })
  }

  submit(encryptionId: any) {
    this.itemList = this.allRoaster.filter((val: any) => val.meal_type_id === this.checkinMeal.value.roaster_id)[0];
    const obj = {
      pc_id: this.itemList.pc_id,
      loc_id: this.itemList.loc_id,
      roaster_id: this.itemList.roaster_id,
      meal_type_id: this.itemList.meal_type_id,
      curr_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      scan_by:'engineer'
    }
    this.presentLoading().then(preLoad => {
      this.httpMeal.checkInMeal(obj, encryptionId).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.common.presentToast(data.msg, 'success');
          this.openQrScanner();
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
      });
    })

  }

}
