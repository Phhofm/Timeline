const {
    sanitizeEntity
} = require('strapi-utils');

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.era.search(ctx.query);
        } else {
            entities = await strapi.services.era.find(ctx.query);
        }

        return entities.map(entity => {
            const era = sanitizeEntity(entity, {
                model: strapi.models.era,
            });
            // sanitize era
            delete era.created_by;
            delete era.updated_by;
            delete era.created_at;
            delete era.updated_at;

            // sanitize event
            for (let event of era.events) {
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

            // sanitize timespans
            for (let timespan of era.timespans) {
                delete timespan.title;
                delete timespan.teaser;
                delete timespan.content;
                delete timespan.era;
                delete timespan.timespan;
                delete timespan.startyear;
                delete timespan.endyear;
                delete timespan.type;
                delete timespan.created_by;
                delete timespan.updated_by;
                delete timespan.created_at;
                delete timespan.updated_at;
                delete timespan.image;
                delete timespan.metaevent;
            }

            return era;
        });
    },
};