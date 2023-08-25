import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';
import { CostCenterComponent } from './cost-center/cost-center.component';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.page.html',
  styleUrls: ['./complaint.page.scss'],
})
export class ComplaintPage implements OnInit {
  status = 'not_resolved';
  tickets: any = [];
  ticketsCopy: any = [];
  ticketStages: any = [];
  page = 1;
  isHideInfinite!: boolean;
  ticketStatus = null;
  loading: any;
  timeout = null;
  myTicket: any = [];
  myTicketCopy: any = [];
  latitude: any;
  longitude: any;
  myticketPage = 1;
  searchBy: any;
  searchValue!: string;
  searchValueDesc!: string;
  resolveTicket: any = [];
  constructor(
    private httpCompalint: ComplaintService,
    private httpCommon: CommonService,
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // if (this.platform.is('android') || this.platform.is('ios')) {
    //   this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((res) => {
    //     this.getlocation();
    //   });
    // }
    // return;
  }

  ionViewDidEnter() {
    // this.httpCompalint.getData().subscribe(data => {
    //   console.log(data);
    //   if (data) {
    //     this.tickets = this.tickets.filter(val => val.tkts_id !== data);
    //   }

    // })
  }

  ionViewDidLeave() {
    // this.storage.set('assignStatus', []);
  }

  ionViewWillEnter() {
    this.getTicketStages();
    this.page = 1;
    this.tickets = [];
    this.ticketsCopy = [];
    this.getTicketMaster(this.ticketStatus, this.page);

  }

  getTicketStages() {
    this.httpCompalint.getAllTicketStages().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.ticketStages = data.data;
      }
    });
  }

  changeTickeType(ev:  any) {
    console.log(ev.target.value);
    this.page = 1;
    this.tickets = [];
    this.getTicketMaster(ev.target.value , this.page);
  }

  getTicketMaster(status: any, page: any) {
    this.presentLoading().then(preLoad => {
      this.httpCompalint.getTicketMaster(status, page).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.page = this.page + 1;
          this.tickets = data.data.data;
          this.ticketsCopy = data.data.data;
          this.ticketStatus = status;
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'warning');
      });
    });

  }

  openTicketPage(data: any, ticket_type: any) {
    console.log(data);
    this.router.navigate(['/complaint/ticket-work'], {
      queryParams: {
        data: JSON.stringify(data),
        tkttype: ticket_type
      }
    });
  }

  searchTicketFromServer() {
    if (this.searchBy == 'all') {
      this.getTicketMaster(null, 1);
      return;
    }
    this.presentLoading().then(preLoad => {
      this.httpCompalint.searchTicketFromServer(this.searchBy, this.searchValue).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.page = this.page + 1;
          this.tickets = data.data.data;
          this.ticketsCopy = data.data.data;
        } else {
          this.tickets = [];
          this.ticketsCopy = [];
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      })
    });
  }

  changeSearch() {
    this.searchValue = '';
  }

  loadData(event: any) {
    this.httpCompalint.getTicketMaster(this.ticketStatus, this.page).subscribe(data => {
      event.target.complete();
      if (data.status) {
        let length, ticket_arr;
        ticket_arr = data.data.data;
        length = ticket_arr.length;
        for (var i = 0 ; i < length; i++) {
          console.log(ticket_arr[i]);
          this.tickets.push(ticket_arr[i]);
        }
        this.page = this.page + 1;
      } else {

      }
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
    this.loading.dismiss();
  }
  changeSegment(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value == 'resolved') {
      this.presentLoading().then(preLoad => {
        this.resolveTicket = [];
        this.httpCompalint.getResolvedTicket().subscribe(data => {
          this.dismissloading();
          console.log(data);
          if (data.status) {
            this.resolveTicket = data.data.data;
            // this.myTicketCopy = data.data.data;
            // this.myticketPage = this.myticketPage + 1;
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        }, err => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        });
      });
    }
  }

  loadData1(event: any) {
    this.httpCompalint.getMyTicket(this.myticketPage).subscribe(data => {
      event.target.complete();
      console.log(data);
      if (data.status) {
        let length, ticket_arr;
        ticket_arr = data.data.data;
        length = ticket_arr.length;
        for (var i = 0 ; i < length; i++) {
          console.log(ticket_arr[i]);
          this.myTicket.push(ticket_arr[i]);
        }
        this.myticketPage = this.myticketPage + 1;
      } else {
        this.httpCommon.presentToast(data.msg, 'warning');
      }
    }, err => {
      this.dismissloading();
      this.httpCommon.presentToast(environment.errMsg, 'danger');
    });
  }

  changeMyTickt(ev: any) {
    this.myTicket = this.myTicketCopy;
    console.log(this.tickets);
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.myTicket = this.myTicket.filter((dat: any) => {
        if ((dat.tkts_id.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.tkts_id.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((dat.subcat1_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.subcat1_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((dat.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }

  searchItem(ev: any) {
    this.tickets = this.ticketsCopy;
    console.log(this.tickets);
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.tickets = this.tickets.filter((dat: any) => {
        if ((dat.tkts_id.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.tkts_id.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((dat.subcat1_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.subcat1_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        } else if ((dat.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.pc_desc.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }

  // async openMap(lat, lng) {
  //   const obj = {
  //     lat: lat,
  //     lng: lng
  //   }
  //   console.log('my site');
  //   const modal = await this.modalCtrl.create({
  //     component: GoogleMapComponent,
  //     cssClass: 'my-modal',
  //     componentProps: { data: obj }
  //   });
  //   modal.present();
  // }

  // openGoogleMap(lat, lng) {
  //   console.log(lat);
  //   this.launchNavigator.navigate([parseFloat(lat), parseFloat(lng)], {
  //     start: [this.latitude, this.longitude]
  //   }).catch(err => {
  //     alert(JSON.stringify(err));
  //   });
  // }

  creteTicket() {
    this.router.navigateByUrl('/complaint/create-ticket');
  }

  async openRoName() {
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then(disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.searchValueDesc = disModal.data.label;
        this.searchValue = disModal.data.value;
      }
    });
    return await modal.present();
  }

  myCustom(ev: any) {
    this.page = 1;
    this.tickets = [];
    this.ticketsCopy = [];
    this.getTicketMaster(this.ticketStatus, this.page);
  }

}
