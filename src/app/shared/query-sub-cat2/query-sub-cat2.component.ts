import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
@Component({
  selector: 'app-query-sub-cat2',
  templateUrl: './query-sub-cat2.component.html',
  styleUrls: ['./query-sub-cat2.component.scss'],
})
export class QuerySubCat2Component  implements OnInit {
  qry_id1: any;
  allSubCat2: any = [];
  allSubCat2Copy: any = [];
  loading: any;
  allData: any = [];
  constructor(
    private loadingController: LoadingController,
    private httpComp: ComplaintService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.allData);
    if (this.allData.length > 0) {
      this.allSubCat2 = this.allData;
      this.allSubCat2Copy = this.allData;
    } else {
      this.getSubCat2();
    }

  }

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getSubCat2() {
    this.presentLoading().then(preLoad => {
      this.httpComp.getQuerySubCat2(this.qry_id1).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allSubCat2 = data.data;
          this.allSubCat2Copy = data.data;

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

  search(ev: any) {
    this.allSubCat2 = this.allSubCat2Copy;
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.allSubCat2 = this.allSubCat2.filter((dat: any) => {
        if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }
}
