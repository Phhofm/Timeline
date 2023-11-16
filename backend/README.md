# Timeline - Strapi
This is the repository containing the code for the strapi-api-part for the timeline.
Install all dependencies with npm install
Inspect changes with npm run develop
Always before deployment, build the admin panel with with npm run build --prod. 

Docker: You can then create a docker image with docker . -t timeline-backend. Run it with the docker compose file. It is reachable thorugh the nginx in the timeline-frontend container.

I also created a server.js file to run it on a server seperately with pm2:
Start the service with NODE_ENV=production pm2 start server.js --name strapi
You can now check the service running on HOST:PORT as you wrote into the config/server.js file. 

The admin dashboard is reachable under /dashboard
In the dashboard, you can create new users with author rights, create all the elements and relations. In the api/controllers folder, you find the files to adapt for your customized data responses.

This configuration uses the SQLite Database file in the .tmp folder.

---
Philip Hofmann, philip.hofmann@ius.uzh.ch , https://rwi.app/ , phhofm.github.io
