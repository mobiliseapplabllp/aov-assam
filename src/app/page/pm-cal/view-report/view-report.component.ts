import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { environment } from 'src/environments/environment';
import { AddResponseComponent } from '../add-response/add-response.component';
@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss'],
})
export class ViewReportComponent  implements OnInit {
  loading: any;
  requestedData: any = [];
  fillReport: any = [];
  @ViewChildren("a") private itemlist!: QueryList<ElementRef>;
  constructor(
    private activeroute: ActivatedRoute,
    private httpPms: PmCalService,
    private common: CommonService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((res: any) => {
      this.requestedData = JSON.parse(res.data);
      console.log(this.requestedData);
    });
    this.getScheduleUser();
  }

  getScheduleUser() {
    this.presentLoading().then(preLoad => {
      this.httpPms.getScheduleUser(this.requestedData.wo_id).subscribe(data => {
        this.dismissloading();
        this.fillReport = data.data.categories;
        this.fillReport.forEach((element: any, index: any) => {
          let count = 0;
          element.qus.forEach((el: any) => {
            if (el.isDtlShow && el.status == 0) {
              count = count + 1;
            }
            element.pending_count = count;
          });
        });
      })
    }, err => {
      this.dismissloading();
      this.common.presentToast(environment.errMsg, 'danger');
    });
  }
  expand(data: any, index: any) {
    data.isView = !data.isView;
    for (let i = 0; i < this.fillReport.length; i++) {
      if (i !== index) {
        this.fillReport[i].isView = false;
      } else {
        setTimeout(() => {
          const userToScrollOn = this.itemlist.toArray();
          userToScrollOn[index].nativeElement.scrollIntoView({
            behavior: 'smooth'
          });
        }, 4);
      }
    }
  }

  showMore(val: any) {
    val.showMore = !val.showMore;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissloading() {
    this.loading.dismiss();
  }

  viewDocs(url: string) {
    this.common.openDoc(url)
  }

  async addResponse(data: any, createAt: any) {

    console.log(data, createAt);
    const modal = await this.modalCtrl.create({
      component: AddResponseComponent,
      cssClass: 'my-modal',
      componentProps: { requestedData: data, createAt: createAt }
    });
    modal.onWillDismiss().then((disModal: any) => {
      console.log(disModal);
      if (disModal.role) {
        this.getScheduleUser();
      } else {
        console.log(false);
      }
    });
    modal.present();
  }

}
