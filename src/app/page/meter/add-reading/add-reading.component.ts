import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-reading',
  templateUrl: './add-reading.component.html',
  styleUrls: ['./add-reading.component.scss'],
})
export class AddReadingComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  save() {
    this.close(null, false);
  }

}
