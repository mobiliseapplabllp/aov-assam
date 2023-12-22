import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss'],
})
export class DaysComponent  implements OnInit {
  days: any = [{
    days: 'Sunday',
    val: 7,
    selected: false
  },{
    days: 'Monday',
    val: 1,
    selected: false
  },{
    days: 'Tuesday',
    val: 2,
    selected: false
  },{
    days: 'Wednesday',
    val: 3,
    selected: false
  },{
    days: 'Thursday',
    val: 4,
    selected: false
  },{
    days: 'Friday',
    val: 5,
    selected: false
  },{
    days: 'Saturday',
    val: 6,
    selected: false
  }];
  selectedDays: any = [];
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  selectDone() {
    this.selectedDays = this.days.filter((val: any) => val.selected);
    if (this.selectedDays.length === 0) {
      alert('Please Select at Least one Day');
    } else {
      this.close(this.days, true)
    }
  }


}
