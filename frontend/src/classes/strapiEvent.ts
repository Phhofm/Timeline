export default class strapiEvent {
  id: number;
  title: string;
  startyear: number;
  endyear: number;
  teaser: string;
  content: string;
  type: number;
  image: string;
  era: number;
  timespans: any;
  metaevents: any;
  events: any;
  //@ts-ignore
  _correspondingMesh: THREE.Mesh;
  _relatedCurves: THREE.Line[] = []; //we store curves in object so we can remove them from the scene when event dismissed

  constructor(
    id: number,
    title: string,
    startyear: number,
    endyear: number,
    teaser: string,
    content: string,
    type: number,
    image: string,
    era: number,
    timespans: any,
    metaevents: any,
    events: any
  ) {
    this.id = id;
    this.title = title;
    this.startyear = startyear;
    this.endyear = endyear;
    this.teaser = teaser;
    this.content = content;
    this.type = type;
    this.image = image;
    this.era = era;
    this.timespans = timespans;
    this.metaevents = metaevents;
    this.events = events;
  }
}
