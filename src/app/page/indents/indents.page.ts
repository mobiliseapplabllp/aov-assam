import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { IndentsService } from 'src/app/provider/indents/indents.service';
// import { IndentsService } from '../../providers/indents/indents.service';
// import { CommonService } from '../../providers/common/common.service';
import { environment } from '../../../environments/environment';
import { LoadingController } from '@ionic/angular';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { CommonService } from 'src/app/provider/common/common.service';

@Component({
  selector: 'app-indents',
  templateUrl: './indents.page.html',
  styleUrls: ['./indents.page.scss'],
})
export class IndentsPage implements OnInit {
  status = 'pending';
  page = 1;
  indentView: any = [];
  loading: any;
  constructor(
    public router: Router,
    private httpIndent: IndentsService,
    private common: CommonService,
    private loadingController: LoadingController) {

  }

  ngOnInit() {
    this.getMyIndent();
  }

  getMyIndent() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getMyIndent(this.page, this.status).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.indentView = [...this.indentView, ...data.data.data];
          this.page = this.page + 1;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  changeSegment(ev: any) {

    this.indentView = [];
    this.page = 1;
    this.getMyIndent();
  }

  infiniteScroll(ev: any) {
    ev.target.complete();
    this.getMyIndent();
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

  myCustom(ev: any) {
    console.log(ev);
    this.indentView = this.indentView.filter((val: any) => val.rqst_id !== ev.rqst_id);
  }

}
