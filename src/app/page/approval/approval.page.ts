import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.page.html',
  styleUrls: ['./approval.page.scss'],
})
export class ApprovalPage implements OnInit {
  approvalList: any = [{
    mnu_name: 'MR',
    id:1,
    url: '/approval/indent-approval'
  },{
    mnu_name: 'PO',
    id:2,
    url: '/approval/po-approval'
  }];
  loading: any;
  constructor(
    private router: Router,
    private httpIndent: IndentsService,
    private loadingController: LoadingController,
    private common: CommonService
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.getApproval();
  }

  openPage(dat: any) {
    this.router.navigateByUrl(dat.url);
  }

  getApproval() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getApproval().then(res => {
        this.dismissloading();
      }, err => {
        this.common.presentToast(environment.errMsg, 'danger');
        this.dismissloading();
      })
    })

  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
