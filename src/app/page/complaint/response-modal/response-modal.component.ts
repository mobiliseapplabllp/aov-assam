import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrls: ['./response-modal.component.scss'],
})
export class ResponseModalComponent  implements OnInit {
  data: any;
  dataView: any = [];
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(JSON.parse(this.data));
    this.dataView = JSON.parse(this.data);
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }
}
