import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { MealCheckinService } from 'src/app/provider/meal-checkin/meal-checkin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-roaster',
  templateUrl: './menu-roaster.page.html',
  styleUrls: ['./menu-roaster.page.scss'],
})
export class MenuRoasterPage implements OnInit {
  @ViewChild('popoverDatetime')  popoverDatetime!: IonDatetime;
  public menuRoaster!: FormGroup;
  loading: any;
  allRoName: any = [];
  location: any = [];
  mealType: any = [];
  roasterArr: any = [];
  constructor(
    private formbuilder: FormBuilder,
    private httpComplaint: ComplaintService,
    private httpCommon: CommonService,
    private loadingController: LoadingController,
    private httpMeal: MealCheckinService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getPcCode();
  }

  initForm() {
    this.menuRoaster = this.formbuilder.group({
      pc_code: ['', Validators.required],
      location: ['', Validators.required],
      meal_type: [''],
      date_from: [moment().format('YYYY-MM-DD')]
    });
  }

  getPcCode() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getCostCenter().subscribe({
        next:(data) => {
          if (data.status) {
            this.allRoName = data.data
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
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

  changeRo(ev: any) {
    if (!ev.target.value) {
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpMeal.getPcLocation(ev.target.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.location = data.data;
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.httpCommon.presentToast(environment.errMsg, 'danger');
          this.dismissloading();
        },
        complete:() => {
          this.dismissloading();
        }
      });

      this.httpMeal.getMealType(ev.target.value).subscribe(data => {
        if (data.status) {
          this.mealType = data.data;
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      })
    });
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

  changeDate() {
    this.popoverDatetime.confirm(true);
  }

  reset() {
    this.menuRoaster.reset();
  }

  search() {
    this.presentLoading().then(preLoad => {
      this.httpMeal.getRoaster(this.menuRoaster.value).subscribe({
        next:(data) => {
          if (data.status) {
            this.roasterArr = data.data.res;
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
    });
  }

}
