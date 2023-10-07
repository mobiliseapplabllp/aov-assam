import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-instruction-modal',
  templateUrl: './instruction-modal.component.html',
  styleUrls: ['./instruction-modal.component.scss'],
})
export class InstructionModalComponent  implements OnInit {
  inst: any = [{
    label: 'instruction 1'
  },{
    label: 'instruction 2'
  },{
    label: 'instruction 3'
  },{
    label: 'instruction 4'
  },{
    label: 'instruction 5'
  },{
    label: 'instruction 6'
  }]
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  changeCheckBox(ev: any) {
    console.log(ev);
    if (ev.detail.checked) {
      this.closeModal(null, 'true');
    }
  }

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }
}
