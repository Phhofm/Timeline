const {
    sanitizeEntity
} = require('strapi-utils');

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.timespan.search(ctx.query);
        } else {
            entities = await strapi.services.timespan.find(ctx.query);
        }

        return entities.map(entity => {
            const timespan = sanitizeEntity(entity, {
                model: strapi.models.timespan,
            });


            // sanitize timespan
            delete timespan.created_by;
            delete timespan.updated_by;
            delete timespan.created_at;
            delete timespan.updated_at;

            // sanitize era
            for (prop in timespan.era) {
                if (prop !== 'id') {
                    delete timespan.era[prop]
                }
            }

            // sanitize event
            for (let event of timespan.events) {
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


            if (!timespan.image) {} // null, no image included
            else {

                // sanitize images
                for (prop in timespan.image) {
                    if (prop !== 'formats') {
                        delete timespan.image[prop]
                    }
                }
                for (prop in timespan.image.formats.thumbnail) {
                    if (prop !== 'url') {
                        delete timespan.image.formats.thumbnail[prop]
                    }
                }
                // thumbnail
                // small
                for (prop in timespan.image.formats.small) {
                    if (prop !== 'url') {
                        delete timespan.image.formats.small[prop]
                    }
                }

                // medium
                for (prop in timespan.image.formats.medium) {
                    if (prop !== 'url') {
                        delete timespan.image.formats.medium[prop]
                    }
                }

                // large
                for (prop in timespan.image.formats.large) {
                    if (prop !== 'url') {
                        delete timespan.image.formats.large[prop]
                    }
                }
            }

            //metaevents
            for (var prop in timespan.metaevent) {
                if (prop !== 'id') {
                    delete timespan.metaevent[prop]
                }
            }

            return timespan;
        });
    },
};