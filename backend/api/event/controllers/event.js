const {
    sanitizeEntity
} = require('strapi-utils');

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.event.search(ctx.query);
        } else {
            entities = await strapi.services.event.find(ctx.query);
        }

        return entities.map(entity => {
            const event = sanitizeEntity(entity, {
                model: strapi.models.event,
            });

            // sanitize event
            delete event.created_by;
            delete event.updated_by;
            delete event.created_at;
            delete event.updated_at;

            // sanitize era
            for (prop in event.era) {
                if (prop !== 'id') {
                    delete event.era[prop]
                }
            }

            // sanitize timespan
            if (!event.timespan) { } // null check
            else {
                for (let prop1 in event.timespan) {
                    for (let prop2 in event.timespan[prop1]) {
                        if (prop2 !== 'id') {
                            delete event.timespan[prop1][prop2]
                        }
                    }
                }
            }

            // sanitize type
            for (prop in event.type) {
                if (prop !== 'id') {
                    delete event.type[prop]
                }
            }

            // sanitize metaevent (delete everything except id. this can be an array of objects)
            for (let prop1 in event.metaevents) {
                for (let prop2 in event.metaevents[prop1]) {
                    if (prop2 !== 'id') {
                        delete event.metaevents[prop1][prop2]
                    }
                }
            }

            // sanitize images

            if (!event.image) { } // null, no image included
            else {
                for (prop in event.image) {
                    if (prop !== 'formats') {
                        delete event.image[prop]
                    }
                }

                // thumbnail
                for (prop in event.image.formats.thumbnail) {
                    if (prop !== 'url') {
                        delete event.image.formats.thumbnail[prop]
                    }
                }

                // small
                for (prop in event.image.formats.small) {
                    if (prop !== 'url') {
                        delete event.image.formats.small[prop]
                    }
                }

                // medium
                for (prop in event.image.formats.medium) {
                    if (prop !== 'url') {
                        delete event.image.formats.medium[prop]
                    }
                }

                // large
                for (prop in event.image.formats.large) {
                    if (prop !== 'url') {
                        delete event.image.formats.large[prop]
                    }
                }
            }

            //metaevents
            for (var prop in event.metaevent) {
                if (prop !== 'id') {
                    delete event.metaevent[prop]
                }
            }

            // relates_to_event
            if (!event.relates_to_event) { } // null check
            else {
            for (let prop1 in event.relates_to_event) {
                for (let prop2 in event.relates_to_event[prop1]) {
                    if (prop2 !== 'id') {
                        delete event.relates_to_event[prop1][prop2]
                    }
                }
            }
        }

            // related_to_by_event
            if (!event.related_to_by_event) { } // null check
            else {
            for (let prop1 in event.related_to_by_event) {
                for (let prop2 in event.related_to_by_event[prop1]) {
                    if (prop2 !== 'id') {
                        delete event.related_to_by_event[prop1][prop2]
                    }
                }
            }
        }


            return event;
        });
    },
};