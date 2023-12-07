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
  empListCopy: any = [];
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
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getTeam().subscribe({
        next:(data) => {
          if (data.status) {
            this.empList = data.data;
            this.empListCopy = data.data;
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissLoading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissLoading();
        }
      });
    })

  }

  search(ev: any) {
    let val: any;
    console.log(ev.target.value);
    val = ev.target.value;
    this.empList = this.empListCopy;
    if (val && val.trim() !== '') {
      this.empList = this.empList.filter((dat: any) => {
        if ((dat.label.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
          return (dat.label.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        return
      });
    }
  }

  assign(data: any) {
    const obj = {
      source: environment.source,
      team: data.value + '-' + data.team_id,
      ticketId: this.ticket_id
    }
    this.presentLoading().then(preLoad => {
      this.httpComplaint.assignedTicket(obj).subscribe({
        next:(data) => {
          if (data.status) {
            this.httpCommon.presentToast(data.msg, 'success');
            this.close(null, true);
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissLoading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissLoading();
        }
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
