export default class strapiMeta {
  id: number;
  title: string;
  content: string;
  events: any;

  constructor(
    id: number,
    title: string,
    content: string,
    events: any
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.events = events;
  }
}