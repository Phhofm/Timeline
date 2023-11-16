# Timeline - Frontend
This is the repository containing the code for the frontend-part for the timeline.
Install all dependencies with npm install
Inspect changes with npm run start
A static build can be made with npm run build, which will populate the dist folder.

To build the docker timeline-frontend container, rename the index.html in the dist folder to desktop.html, and copy the generated files in the dist folder to the static folder (replace files).To make changes to the landing page, edit the index.html in here. To make changes to the mobile view, edit the mobile.html in here. Then run docker build . -t timeline-frontend

It uses three.js, webpack, spin.js, rotate.js, particles.js, timeline.js, pleaserotate.js

---
Philip Hofmann, philip.hofmann@ius.uzh.ch , https://rwi.app/
