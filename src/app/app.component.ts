import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import moment from 'moment';

const holidays = [
  moment('2021-04-02T12:00:00+00:00'),
  moment('2021-04-05T12:00:00+00:00'),
  moment('2021-05-01T12:00:00+00:00'),
  moment('2021-05-13T12:00:00+00:00'),
  moment('2021-05-24T12:00:00+00:00'),
  moment('2021-06-03T12:00:00+00:00'),
  moment('2021-10-03T12:00:00+00:00'),
  moment('2021-11-01T12:00:00+00:00'),
  moment('2021-12-25T12:00:00+00:00'),
  moment('2021-12-26T12:00:00+00:00'),

  moment('2022-01-01T12:00:00+00:00'),
  moment('2022-01-06T12:00:00+00:00'),
  moment('2022-04-15T12:00:00+00:00'),
  moment('2022-04-18T12:00:00+00:00'),
  moment('2022-05-01T12:00:00+00:00'),
  moment('2022-05-26T12:00:00+00:00'),
  moment('2022-06-06T12:00:00+00:00'),
  moment('2022-06-16T12:00:00+00:00'),
  moment('2022-10-03T12:00:00+00:00'),
  moment('2022-11-01T12:00:00+00:00'),
  moment('2022-12-25T12:00:00+00:00'),
  moment('2022-12-26T12:00:00+00:00'),

  moment('2023-01-01T12:00:00+00:00'),
  moment('2023-01-06T12:00:00+00:00'),
  moment('2023-04-07T12:00:00+00:00'),
  moment('2023-04-10T12:00:00+00:00'),
  moment('2023-05-18T12:00:00+00:00'),
  moment('2023-05-29T12:00:00+00:00'),
  moment('2023-06-08T12:00:00+00:00'),
  moment('2023-10-03T12:00:00+00:00'),
  moment('2023-11-01T12:00:00+00:00'),
  moment('2023-12-25T12:00:00+00:00'),
  moment('2023-12-26T12:00:00+00:00'),
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public hoursShortTermInitial: number;
  public hoursLongTermInitial: number;
  public daysVacation2023: number;
  public daysVacationBefore2023: number;
  public lastDayContract: string;
  public lastDayCalculated: string;
  public today: string;
  public daysRemaining: number;
  public lastDayWorkingHours: number;
  private now;
  private modelChanged: Subject<any>;
  private readonly dateFormat = 'ddd DD.MM.YYYY';
  private readonly lastDay = '2023-09-30T12:00:00+00:00';
  private readonly hoursPerDay = 7;

  constructor() {
    this.onReset();
    this.modelChanged = new Subject();
    this.modelChanged.pipe(debounceTime(500)).subscribe(() => {
      this.recalculate();
    });
  }

  public onReset() {
    this.hoursShortTermInitial = 30;
    this.hoursLongTermInitial = 530;
    this.daysVacation2023 = 23;
    this.daysVacationBefore2023 = 1;
    this.recalculate();
  }

  public onModelChange() {
    this.modelChanged.next(null);
  }

  private recalculate() {
    let lastDay;
    this.now = moment().utc().hours(12).minutes(0).seconds(0).milliseconds(0);
    this.today = this.now.format(this.dateFormat);
    lastDay = this.calculateLastDay();
    this.lastDayCalculated = lastDay.format(this.dateFormat);
    this.calculateDaysRemaining(lastDay);
  }

  private calculateLastDay() {
    let lastDay;
    let isHoliday: boolean;
    let hoursFree = this.hoursLongTermInitial + this.daysVacation2023 * 7;

    lastDay = moment(this.lastDay);
    this.lastDayContract = lastDay.format(this.dateFormat);
    while (hoursFree > 0) {
      if (lastDay.day() !== 0 && lastDay.day() !== 6) {
        // this is not a sunday or saturday
        isHoliday = false;
        for (let holiday of holidays) {
          if (lastDay.isSame(holiday, 'day')) {
            // this is a holiday
            isHoliday = true;
            // console.log("found holiday: ", lastDay);
          }
        }
        if (!isHoliday) {
          hoursFree -= this.hoursPerDay;
        }
      }
      if (hoursFree >= 0) {
        lastDay.add(-1, 'days');
      }
      this.lastDayWorkingHours = this.hoursPerDay + hoursFree;
    }
    console.log('hoursFree', hoursFree);
    while (lastDay.day() === 0 || lastDay.day() === 6) {
      lastDay.add(-1, 'days');
    }

    return lastDay;
  }

  private calculateDaysRemaining(lastDay) {
    let isFreeDay: boolean;
    let currentDay = moment(this.now);
    let shortTermDaysOff = Math.floor(
      this.hoursShortTermInitial / this.hoursPerDay
    );
    let shortTermHoursRest =
      this.hoursShortTermInitial -
      Math.floor(this.hoursShortTermInitial / this.hoursPerDay) *
        this.hoursPerDay;
    let vacation = this.daysVacationBefore2023 + shortTermDaysOff;
    this.lastDayWorkingHours -= shortTermHoursRest;
    console.log('shortTermDaysOff: ', shortTermDaysOff);
    console.log('shortTermHoursRest: ', shortTermHoursRest);

    this.daysRemaining = 0;
    // console.log(currentDay, ' -> ', lastDay);
    while (currentDay.isBefore(lastDay)) {
      isFreeDay = false;
      if (currentDay.day() === 0 || currentDay.day() === 6) {
        isFreeDay = true;
      }
      if (!isFreeDay) {
        for (let holiday of holidays) {
          if (currentDay.isSame(holiday, 'day')) {
            // this is a holiday
            isFreeDay = true;
            // console.log("found holiday: ", currentDay);
          }
        }
      }
      if (!isFreeDay) {
        if (vacation > 0) {
          vacation--;
          isFreeDay = true;
        }
      }
      if (!isFreeDay) {
        this.daysRemaining++;
      }
      currentDay.add(1, 'days');
    }
    // console.log(currentDay, lastDay, currentDay.isBefore(lastDay));
  }
}
