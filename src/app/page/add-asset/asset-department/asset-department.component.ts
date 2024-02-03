import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';

@Component({
  selector: 'app-asset-department',
  templateUrl: './asset-department.component.html',
  styleUrls: ['./asset-department.component.scss'],
})
export class AssetDepartmentComponent  implements OnInit {
  myDepartment: any = [];
  myDepartmentCopy: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpAsset: MyAssetGetService,
    private loadingController: LoadingController,
    private assetSqlite: AssetSqliteService
  ) { }

  ngOnInit() {
    // this.getDepartment();
    this.getDepartmentFromSqlite();
  }

  getDepartmentFromSqlite() {
    this.assetSqlite.getDepartmentFromSqlite().then(res => {
      this.myDepartment = res;
      this.myDepartmentCopy = res;
    })
  }

  closeModal(val: any, status: any) {
    this.modalCtrl.dismiss(val, status);
  }

  getDepartment() {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getDepartment().subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.myDepartment = data.data;
          this.myDepartmentCopy = data.data;
        }
      });
    })

  }

  search(ev: any) {
    let val: any;
    console.log(ev.target.value);
    val = ev.target.value;
    this.myDepartment = this.myDepartmentCopy;
    if (val && val.trim() !== '') {
      this.myDepartment = this.myDepartment.filter((dat: any) => {
        if ((dat.dept_desc.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
          return (dat.dept_desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        return
      });
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }


}
