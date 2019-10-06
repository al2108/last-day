import { Component } from '@angular/core';
const moment = require('moment');

const holidays = [
  moment('2023-01-01'),
  moment('2023-01-06'),
  moment('2023-04-07'),
  moment('2023-04-10'),
  moment('2023-05-18'),
  moment('2023-05-29'),
  moment('2023-06-08'),
  moment('2023-10-03'),
  moment('2023-11-01'),
  moment('2023-12-25'),
  moment('2023-12-26'),
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  public hoursLongTermInitial = 500;
  public daysVacation = 30 / 12 * 9;
  public lastDayCalculated: string;


  constructor() {
    let lastDay;
    let isHoliday: boolean;
    let hoursFree = this.hoursLongTermInitial + this.daysVacation * 7;
    lastDay = moment('2023.09.30');
    while (hoursFree > 0) {
      if ((lastDay.day() !== 0) && (lastDay.day() !== 6)) {
        // this is not a sunday or saturday
        isHoliday = false;
        for (let holiday of holidays) {
          if (lastDay.isSame(holiday, 'day')) {
            // this is a holiday
            isHoliday = true;
            console.log('found holiday: ', holiday);
          }
        }
        if (!isHoliday) {
          hoursFree -= 7;
        }
      }
      lastDay.add(-1, 'days');
    }
    this.lastDayCalculated = lastDay.format('DD.MM.YYYY');
  }
}
