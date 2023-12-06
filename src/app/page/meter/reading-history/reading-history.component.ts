import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reading-history',
  templateUrl: './reading-history.component.html',
  styleUrls: ['./reading-history.component.scss'],
})
export class ReadingHistoryComponent implements OnInit {
  requestedData: any = [];
  readingHistory: any = [{
    date: '01-01-2023',
    reading: 1200
  },{
    date: '02-01-2023',
    reading: 1230
  },{
    date: '03-01-2023',
    reading: 1270
  },{
    date: '04-01-2023',
    reading: 1310
  }];
  constructor(
    public activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((res) => {
      this.requestedData = JSON.parse(res['data']);
      console.log(this.requestedData);
    });
  }

}
