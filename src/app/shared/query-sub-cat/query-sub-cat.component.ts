import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-query-sub-cat',
  templateUrl: './query-sub-cat.component.html',
  styleUrls: ['./query-sub-cat.component.scss'],
})
export class QuerySubCatComponent  implements OnInit {
  qry_id: any;
  loading: any;
  allSubCat1: any = [];
  allSubCat1Copy: any = [];
  allData: any = [];
  constructor(
    private httpComp: ComplaintService,
    private loadingController: LoadingController,
    private common: CommonService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.qry_id);
    if (this.allData.length > 0) {
      this.allSubCat1 = this.allData;
      this.allSubCat1Copy = this.allData;
    } else {
      this.getQuerySubCat();
    }
  }

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getQuerySubCat() {
    this.presentLoading().then(preLoad => {
      this.httpComp.getQuerySubCat1(this.qry_id).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.allSubCat1 = data.data;
          this.allSubCat1Copy = data.data;
        }
      }, err => {
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
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

  search(ev: any) {
    this.allSubCat1 = this.allSubCat1Copy;
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.allSubCat1 = this.allSubCat1.filter((dat: any) => {
        if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return;
      });
    }
  }


}
