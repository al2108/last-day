import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  public hoursLongTermInitial = 500;
  public lastDayCalculated: string;

  constructor() {
    let lastDay;
    let hoursLongTerm = this.hoursLongTermInitial;
    lastDay = moment('2023.09.30');
    while (hoursLongTerm > 0) {
      hoursLongTerm -= 7;
      lastDay.add(-1, 'days');
    }
    this.lastDayCalculated = lastDay.format('DD.MM.YYYY');
  }
}
