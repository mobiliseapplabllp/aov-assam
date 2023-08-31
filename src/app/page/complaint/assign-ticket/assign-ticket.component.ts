import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assign-ticket',
  templateUrl: './assign-ticket.component.html',
  styleUrls: ['./assign-ticket.component.scss'],
})
export class AssignTicketComponent  implements OnInit {
  ticket_id: any;
  empList: any = [];
  emp: any = [];
  loading: any;
  userData: any = [];
  loaidng:any;
  constructor(
    private modalCtrl: ModalController,
    private httpCommon: CommonService,
    private httpComplaint: ComplaintService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    console.log(this.ticket_id);
    this.getTeamsMember();
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getTeamsMember() {
    this.httpComplaint.getTeam().subscribe(data => {
      if (data.status) {
        this.empList = data.data
      } else {
        this.httpCommon.presentToast(data.msg, 'warning');
      }
    });
  }

  assign() {
    console.log(this.emp);
    const obj = {
      source: environment.source,
      team: this.emp.value + '-' + this.emp.team_id,
      ticketId: this.ticket_id
    }
    this.presentLoading().then(preLoad => {
      this.httpComplaint.assignedTicket(obj).subscribe(data => {
        this.dismissLoading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.close(null, true);
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissLoading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });

    })

    console.log(obj);
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



}
