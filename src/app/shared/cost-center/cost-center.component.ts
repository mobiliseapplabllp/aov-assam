import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss'],
})
export class CostCenterComponent  implements OnInit {
  loading: any;
  allCostCenter: any = [];
  allCostCenterCopy: any = [];
  constructor(
    private loadingController: LoadingController,
    private httpComplaint: ComplaintService,
    private modalCtrl: ModalController,
    private assetSqlite: AssetSqliteService
  ) { }

  ngOnInit() {
    // this.getCostCenter();
    this.getCostCenterSqlite();
  }

  getCostCenterSqlite() {
    this.assetSqlite.getSiteDetailFromSqlite().then(res => {
      console.log(res);
      this.allCostCenter = res;
      this.allCostCenterCopy = res
    })
  }

  closeModal(val: any, status: any) {
    this.modalCtrl.dismiss(val, status);
  }

  getCostCenter() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getCostCenter().subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.allCostCenter = data.data;
          this.allCostCenterCopy = data.data
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
    this.allCostCenter = this.allCostCenterCopy;
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.allCostCenter = this.allCostCenter.filter((dat: any) => {
        if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }

}
