import { Component } from "@angular/core";
const moment = require("moment");

const holidays = [
  moment("2019-11-01T12:00:00+00:00"),
  moment("2019-12-25T12:00:00+00:00"),
  moment("2019-12-26T12:00:00+00:00"),

  moment("2020-01-01T12:00:00+00:00"),
  moment("2020-01-06T12:00:00+00:00"),
  moment("2020-04-10T12:00:00+00:00"),
  moment("2020-04-13T12:00:00+00:00"),
  moment("2020-05-01T12:00:00+00:00"),
  moment("2020-05-21T12:00:00+00:00"),
  moment("2020-06-01T12:00:00+00:00"),
  moment("2020-06-11T12:00:00+00:00"),
  moment("2020-10-03T12:00:00+00:00"),
  moment("2020-11-01T12:00:00+00:00"),
  moment("2020-12-25T12:00:00+00:00"),
  moment("2020-12-26T12:00:00+00:00"),

  moment("2021-01-01T12:00:00+00:00"),
  moment("2021-01-06T12:00:00+00:00"),
  moment("2021-04-02T12:00:00+00:00"),
  moment("2021-04-05T12:00:00+00:00"),
  moment("2021-05-01T12:00:00+00:00"),
  moment("2021-05-13T12:00:00+00:00"),
  moment("2021-05-24T12:00:00+00:00"),
  moment("2021-06-03T12:00:00+00:00"),
  moment("2021-10-03T12:00:00+00:00"),
  moment("2021-11-01T12:00:00+00:00"),
  moment("2021-12-25T12:00:00+00:00"),
  moment("2021-12-26T12:00:00+00:00"),

  moment("2022-01-01T12:00:00+00:00"),
  moment("2022-01-06T12:00:00+00:00"),
  moment("2022-04-15T12:00:00+00:00"),
  moment("2022-04-18T12:00:00+00:00"),
  moment("2022-05-01T12:00:00+00:00"),
  moment("2022-05-26T12:00:00+00:00"),
  moment("2022-06-06T12:00:00+00:00"),
  moment("2022-06-16T12:00:00+00:00"),
  moment("2022-10-03T12:00:00+00:00"),
  moment("2022-11-01T12:00:00+00:00"),
  moment("2022-12-25T12:00:00+00:00"),
  moment("2022-12-26T12:00:00+00:00"),

  moment("2023-01-01T12:00:00+00:00"),
  moment("2023-01-06T12:00:00+00:00"),
  moment("2023-04-07T12:00:00+00:00"),
  moment("2023-04-10T12:00:00+00:00"),
  moment("2023-05-18T12:00:00+00:00"),
  moment("2023-05-29T12:00:00+00:00"),
  moment("2023-06-08T12:00:00+00:00"),
  moment("2023-10-03T12:00:00+00:00"),
  moment("2023-11-01T12:00:00+00:00"),
  moment("2023-12-25T12:00:00+00:00"),
  moment("2023-12-26T12:00:00+00:00")
];

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public hoursLongTermInitial = 500;
  public daysVacation = (30 / 12) * 9;
  public lastDayContract: string;
  public lastDayCalculated: string;
  public daysRemaining: number;
  public now = moment();
  private readonly dateFormat = "DD.MM.YYYY";
  private readonly lastDay = "2023-09-30T12:00:00+00:00";
  private readonly hoursPerDay = 7;

  constructor() {
    let lastDay;
    this.now.utc().hours(12).minutes(0).seconds(0).milliseconds(0);
    lastDay = this.calculateLastDay();
    this.calculateDaysRemaining(lastDay);
  }

  private calculateLastDay() {
    let lastDay;
    let isHoliday: boolean;
    let hoursFree = this.hoursLongTermInitial + this.daysVacation * 7;

    console.log(this.now);
    lastDay = moment(this.lastDay);
    this.lastDayContract = lastDay.format(this.dateFormat);
    while (hoursFree > 0) {
      if (lastDay.day() !== 0 && lastDay.day() !== 6) {
        // this is not a sunday or saturday
        isHoliday = false;
        for (let holiday of holidays) {
          if (lastDay.isSame(holiday, "day")) {
            // this is a holiday
            isHoliday = true;
            console.log("found holiday: ", lastDay);
          }
        }
        if (!isHoliday) {
          hoursFree -= this.hoursPerDay;
        }
      }
      lastDay.add(-1, "days");
      console.log(lastDay, hoursFree);
    }
    this.lastDayCalculated = lastDay.format(this.dateFormat);
    return lastDay;
  }

  private calculateDaysRemaining(lastDay) {
    let currentDay = this.now;
    this.daysRemaining = 0;
    while (currentDay.isBefore(lastDay))
      this.daysRemaining++;
      currentDay.add(1, "days");
  }
}
