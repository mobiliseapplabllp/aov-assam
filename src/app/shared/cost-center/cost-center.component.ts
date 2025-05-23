import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
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
  // allCostCenterCopy: any = [];
  constructor(
    private loadingController: LoadingController,
    private httpComplaint: ComplaintService,
    private modalCtrl: ModalController,
    private assetSqlite: AssetSqliteService,
    private platform: Platform
  ) { }

  ngOnInit() {
    // this.getCostCenter();
    if(this.platform.is('capacitor')) {
      this.getCostCenterSqlite();
    } else {
      this.allCostCenter = [{
        barcode_prefix : "1100002",
        label : "110002 BPHC,NIZ KAURBAHA",
        pc_desc :  "110002 BPHC,NIZ KAURBAHA",
        pc_ext_id : "1100002",
        pc_id : 2,
        value : 2,
      },{
        pc_ext_id: "1131006",
        pc_desc: "1131006 RNB CIVIL HOSPITAL,KOKRAJHAR",
        value: 783,
        barcode_prefix: "1131006",
        label: "1131006 RNB CIVIL HOSPITAL,KOKRAJHAR",
        pc_id: 783
      },{
        pc_ext_id: "1131041",
        pc_desc: "1131041 RNB SDCH,GOSSAIGAON",
        value: 818,
        barcode_prefix: "1131041",
        label: "1131041 RNB SDCH,GOSSAIGAON",
        pc_id: 818
      }, {
        pc_ext_id: "1131041",
        pc_desc: "1131041 RNB SDCH,GOSSAIGAON",
        value: 818,
        barcode_prefix: "1131041",
        label: "1131041 RNB SDCH,GOSSAIGAON",
        pc_id: 818
      }]
    }

  }

  getCostCenterSqlite() {
    this.assetSqlite.getSiteDetailFromSqlite().then(res => {
      console.log(res);
      this.allCostCenter = res;
      // this.allCostCenterCopy = res
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
          // this.allCostCenterCopy = data.data
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
    // this.allCostCenter = this.allCostCenterCopy;
    // if (ev.target.value && ev.target.value.trim() !== '') {
    //   this.allCostCenter = this.allCostCenter.filter((dat: any) => {
    //     if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
    //       return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
    //     }
    //     return
    //   });
    // }
    let label = ev.target.value;
    if (label) {
      this.getCostCenterBySearch(label);
    } else {
      this.getCostCenterSqlite();
    }

  }

  getCostCenterBySearch(label: string) {
    this.assetSqlite.getSiteDetailBySearch(label).then(res => {
      console.log(res);
      this.allCostCenter = res;
      // this.allCostCenterCopy = res
    })
  }
}
