const {
  sanitizeEntity
} = require('strapi-utils');

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.metaevent.search(ctx.query);
    } else {
      entities = await strapi.services.metaevent.find(ctx.query);
    }

    return entities.map(entity => {
      const metaevent = sanitizeEntity(entity, {
        model: strapi.models.metaevent,
      });

      delete metaevent.created_by;
      delete metaevent.updated_by;
      delete metaevent.created_at;
      delete metaevent.updated_at;

      // sanitize event
      for (let event of metaevent.events) {
        delete event.title;
        delete event.teaser;
        delete event.content;
        delete event.era;
        delete event.timespan;
        delete event.startyear;
        delete event.endyear;
        delete event.type;
        delete event.created_by;
        delete event.updated_by;
        delete event.created_at;
        delete event.updated_at;
        delete event.image;
        delete event.metaevent;
      }

      return metaevent;
    });
  },
};