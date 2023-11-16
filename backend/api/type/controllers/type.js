const {
    sanitizeEntity
} = require('strapi-utils');

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.type.search(ctx.query);
        } else {
            entities = await strapi.services.type.find(ctx.query);
        }

        return entities.map(entity => {
            const type = sanitizeEntity(entity, {
                model: strapi.models.type,
            });

            // sanitize type
            delete type.created_by;
            delete type.updated_by;
            delete type.created_at;
            delete type.updated_at;

            // sanitize event
            for (let event of type.events) {
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

            return type;
        });
    },
};