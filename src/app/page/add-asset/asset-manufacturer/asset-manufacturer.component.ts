import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-manufacturer',
  templateUrl: './asset-manufacturer.component.html',
  styleUrls: ['./asset-manufacturer.component.scss'],
})
export class AssetManufacturerComponent  implements OnInit {
  manufacturer: any = [];
  // manufacturerCopy: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpAsset: MyAssetGetService,
    private loadingController: LoadingController,
    private common: CommonService,
    private assetSqlite: AssetSqliteService,
    private platform: Platform) { }

  ngOnInit() {
    // this.getManufacturer();
    if (this.platform.is('capacitor')) {
      this.getManufacturerFromSqlite();
    } else {
      this.manufacturer = [{
        mnfctrer_desc : "3M HEALTHCARE",
        mnfctrer_ext_id : "",
        mnfctrer_id : 1
      },{
        mnfctrer_desc : "A & D Co Ltd",
        mnfctrer_ext_id : "",
        mnfctrer_id : 1
      }]
    }

  }

  getManufacturerFromSqlite() {
    this.assetSqlite.getManufacturerFromSqlite().then(res => {
      this.manufacturer = res;
      // this.manufacturerCopy = res;
    })
  }

  ionViewDidLeave() {
    this.dismissloading();
  }

  closeModal(val: any, status: any) {
    this.modalCtrl.dismiss(val, status);
  }

  getManufacturer() {
    this.presentLoading().then(preLod => {
      this.httpAsset.getManufacturer().subscribe({
        next:(data) => {
          if (data.status) {
            this.manufacturer = data.data;
            // this.manufacturerCopy = data.data;
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
    // let val: any;
    // console.log(ev.target.value);
    // val = ev.target.value;
    // this.manufacturer = this.manufacturerCopy;
    // if (val && val.trim() !== '') {
    //   this.manufacturer = this.manufacturer.filter((dat: any) => {
    //     if ((dat.mnfctrer_desc.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
    //       return (dat.mnfctrer_desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
    //     }
    //     return
    //   });
    // }
    let label = ev.target.value;
    if (!label) {
      this.getManufacturerFromSqlite();
    } else {
      this.getManufacturerBySearch(label);
    }
  }

  getManufacturerBySearch(label: string) {
    this.assetSqlite.getManufacturerBySearch(label).then(res => {
      console.log(res);
      this.manufacturer = res;
      // this.allCostCenterCopy = res
    })
  }
}
