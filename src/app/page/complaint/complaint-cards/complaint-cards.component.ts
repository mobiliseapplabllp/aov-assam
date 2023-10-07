import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { TicketHistoryComponent } from '../ticket-history/ticket-history.component';
import { TicketTypeComponent } from '../ticket-type/ticket-type.component';

@Component({
  selector: 'app-complaint-cards',
  templateUrl: './complaint-cards.component.html',
  styleUrls: ['./complaint-cards.component.scss'],
})
export class ComplaintCardsComponent  implements OnInit {
  @Input() data: any;
  @Input() ticketType: any;
  @Output() greetEvent = new EventEmitter();
  paramsData: any = {
    id: 1,
    pagename: 'Create Indent',
    hide: false,
    disabl: true,
  };
  userData: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpComplaint: ComplaintService,
    private common: CommonService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    console.log(this.ticketType);
    console.log(this.data);

  }

  isHidden(data: any) {
    data.hide = !data.hide;
  }

  async openSite() {
    console.log('my site');
    const modal = await this.modalCtrl.create({
      component: SiteDetailComponent,
      cssClass: 'my-modal2',
      componentProps: { ticketData: this.data }
    });
    modal.present();
  }

  async history() {
    const modal = await this.modalCtrl.create({
      component: TicketHistoryComponent,
      cssClass: 'my-modal',
      componentProps: { ticket_id: this.data.tkts_id }
    });
    modal.present();
  }

  async work_now() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.checkTicketConfirm(this.data.tkts_id).subscribe(data => {
        this.dismissLoading();
        if (data.status) {
          this.openTicketWork();
        } else {
          this.openTicketTypeModal();
        }
      }, err => {
        this.dismissLoading();
        this.common.presentToast(environment.errMsg, 'danger');
      });
    });

    // if(!this.data.ext_asset_id && this.data.complaint_type_cfrm==0){
    //   this.openTicketTypeModal();
    // }else{
    //   this.openTicketWork();
    // }
  }

  async openTicketTypeModal() {
    console.log(this.data);
    const modal = await this.modalCtrl.create({
      component: TicketTypeComponent,
      cssClass: 'my-modal',
      componentProps: { requestedData: this.data.tkts_id, allData:  this.data }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.greetEvent.emit(true);
      }
    });
    modal.present();
  }

  openTicketWork() {
    this.router.navigate(['complaint/ticket-work'], {
      queryParams: {
        data: JSON.stringify(this.data),
      }
    });
  }

  // async openWorkDetailModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: WorkdetailsComponent,
  //     cssClass: 'my-modal',
  //     componentProps: { ticketId: this.data.ticket_id, phone: this.data.customer_mobile,
  //       resolveable: this.data.resolveable, resolveablemsg: this.data.resolveable_msg, data: this.data }
  //   });
  //   modal.onWillDismiss().then(disModal => {
  //     console.log(disModal);
  //     if (disModal.data == null ) {

  //     } else {
  //       this.greetEvent.emit(this.data);
  //     }
  //   });
  //   modal.present();
  // }

  fsr(efsr: any) {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getEfsr(efsr).subscribe(data => {
        console.log(data);
        this.dismissLoading();
        if (data.status) {
          let spareCount = data.data.reqIndent.length;
          this.downLoadEfsr(data.data, parseInt(spareCount, 10) + 1);
        }
      }, err => {
        this.dismissLoading();
        this.common.presentToast(environment.errMsg, 'danger');
      });
    })

  }

  downLoadEfsr(data: any, spareCount: number) {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.downLoadEfsrPdf(data, spareCount).subscribe({
        next:(data) => {
          this.dismissLoading();
          if (data.status) {
            this.common.openDoc(data.url)
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissLoading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissLoading();
        }
      })
    })
  }

  async presentAlertConfirm(tkts_id: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Re-Open Ticket ?',
      message: 'Are you Sure Want to Re-Open Ticket No ' + tkts_id,
      mode: 'ios',
      inputs: [{
        name: 'remark',
        type:'textarea',
        placeholder: 'Enter Remarks',
      }],
      buttons: [{
        text: 'Cancel',
          handler: (data) => {
            console.log("Cancel");
          }
        },{
          text: 'YES',
          handler: (data) => {
            if(data.remark){
              const obj = {
                tktId : tkts_id,
                reopenRemark: data.remark,
                source: environment.source
              }
              this.reOpenTicket(obj);
            } else {
              this.errMsg('Please Enter Remark');
            }
          }
        }]
    });
    await alert.present();
  }

  errMsg(msg: string) {
    alert(msg)
  }

  reOpenTicket(data: any) {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.reOpenTicket(data).subscribe({
        next:(data: any) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.navCtrl.pop();
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissLoading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissLoading();
        }
      });
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  indent() {
    this.paramsData.ticket_id = this.data.ticket_id;
    this.router.navigate(['create-indent'], {
      queryParams: {
        data: JSON.stringify(this.paramsData),
      }
    });
  }

}
