export default class strapiEra {
  id: number;
  title: string;
  startyear: number;
  endyear: number;
  events: any;
  timespans: any;

  constructor(
    id: number,
    title: string,
    startyear: number,
    endyear: number,
    events: any,
    timespans: any
  ) {
    this.id = id;
    this.title = title;
    this.startyear = startyear;
    this.endyear = endyear;
    this.events = events;
    this.timespans = timespans;
  }
}
