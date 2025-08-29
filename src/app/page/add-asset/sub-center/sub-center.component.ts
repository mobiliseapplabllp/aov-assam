import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';

@Component({
  selector: 'app-sub-center',
  templateUrl: './sub-center.component.html',
  styleUrls: ['./sub-center.component.scss'],
})
export class SubCenterComponent  implements OnInit {
  pc_id: any;
  subCenter: any;
  constructor(
    private modalCtrl: ModalController,
    private assetSqlite: AssetSqliteService,
    private platform: Platform
  ) { }

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      this.getSubCenter();
    } else {
      this.subCenter = [{
        sub_centre_desc: "1no. Behali Bagisa",
        pc_id: 1084,
        sub_centre_id: 1
      }, {
        sub_centre_desc: "2no. Boralimora",
        pc_id: 1084,
        sub_centre_id: 2
      }]
    }
  }

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getSubCenter() {
    this.assetSqlite.getSubCenterFromSqlite(this.pc_id).then(res => {
      this.subCenter = res;
    });
  }

}
