import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.scss'],
})
export class SiteDetailComponent  implements OnInit {
  ticketData: any;
  constructor(
    public modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.ticketData);
  }

  closeModal() {
    this.modalCtrl.dismiss({ dismiss : true});
  }

  calling() {
    // this.callNumber.callNumber(this.ticketData.contact, true) .then(res => {
    //   console.log('calling');
    // } , err => {
    //   alert(JSON.stringify(err));
    // });
  }
}
