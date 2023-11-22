
# README

## Intro

This repository is simply a copy of the open source code I have initially released on gitlab and can be found [here](https://gitlab.com/rwf-dev-public/timeline).

This is the repository holding the open source code and docker images for the timeline application [here](https://rwi.app/timeline/) (or [here](https://web.archive.org/web/20210618111754/https://rwi.app/timeline/)) and inspect a live version of this application [here](https://lht.rwi.app/) (or [here](https://web.archive.org/web/20210519085254/https://rwi.app/historytimeline/)). The frontend folder holds the code for the Three.js application, while the backend folder holds the code for the strapi api. I included a README in each.

## Run
To run the dockerized version, download the [**docker-compose-prebuilt-images.yml**](https://gitlab.com/rwf-dev-public/timeline/-/blob/master/docker-compose-prebuilt-images.yml) file from this repository.
If you want, you can modify this docker compose file, by defining another port to bind to by the host than 7001.
In a terminal, cd into the directory holding the downloaded docker-compose-prebuilt-images.yml file and execute 
```
$ docker-compose -f docker-compose-prebuilt-images up -d
```
(Requirements: Have docker installed on your system. Get it here: https://docs.docker.com/get-docker/)
This will use the prebuilt docker images from the gitlab registry of this repo, which builds, tests and then uploads new images (with tag :latest) with each upload, so they are always up-to-date.

## Usage

You can now access this application. In your browser, open http://localhost:7001 or http://\<host-ip\>:\<chosen-port\>/ if you modified the compose file to use another port. You should see the page where you can choose between the mobile and the desktop version. Both versions will show some provided data sample. Both use the same data source.

Now, open the first page again and add /dashboard to access the strapi admin dashboard (meaning http://localhost:7001/dashboard or adapt if you changed the default port). Now, you can register the Default Admin Account. In the admin dashboard, you see the control panel on the left. You can inspect or modify or delete sample data or add your own events (which when you save/publish, you should immediately see the changes on the frontend when refreshing). In Settings, you are also able to register other user accounts to have access to the admin dashboard, together with a role.

## Sample Data
For this project I included some sample data. The way it works is if the docker volume defined in these images does not exist on your system yet, meaning it is the first time for you to spin up this application on your system, it will write some data into it. I deleted the admin account out of the database file, so the first time you visit the dashboard, you will be able to define an admin account with password to the dashboard for yourself. The strapi container will access this docker volume and therefore will have the necessary structure already and also return data on the defined endpoints for the frontend. In this way, if you visit the frontend part of this application, it will not be empty, but already return a few sample-events. Of course, through the dashboard, you can remove these events and create new ones by yourself. It is important to note, that I designed it to not overwrite any existing data. To summarize, if it is the first time you spin up this application, there will be some sample data. But updating / restarting the application will keep the changes that you did from then on on your system. By the way, this way you can simply back up the two defined volumes, or make a cron script that does it for you periodically (I back my application by a cron script on a server that in a weekly routing copies the contents of the volumes to a shared network drive (which also gets backed up) and added a clean up script that deletes backups older than three weeks which i can manually trigger).

## Structure
This will download two docker images from our registry, spin them up in their own containers, create a network and connect them. The frontend container contains an nginx, and only this one is accessible publicly, in the compose file it is currently set to port 7001 (binds to the host port), but you can change it to any port of your choosing. The nginx serves the static sites (index.html, desktop.html and mobile.html) and serves as a proxy though the internal docker network to the strapi instance. Here is a diagram:
![docker structure](https://gitlab.com/rwf-dev-public/timeline/-/raw/master/timeline-docker.svg)
## Build
Of course, you dont need to use the prebuilt images from our registry, but you can also build the docker images from source yourself. Do the same thing as in the Run Section in this README, but use the [docker-compose.yml](https://gitlab.com/rwf-dev-public/timeline/-/blob/master/docker-compose.yml) file instead. This will of course take longer, since it will clone this whole repository into containers before building the applications and generating the images from them. It is also important to note that this method will not run any tests.

## Gitlab CI/CD
Have a look at the .gitlab-ci.yml file. I included a build, test and deploy stage, which automatically trigger on each commit onto the master branch only, so commits to a dev branch will not take up runner resources. For this project, I use the public gitlab shared runners poweder by the Google Cloud Platform. Wth each commit, the pipeline will trigger, which will first clone the most recent state of this repository and then do a build, creating the necessary images, tagging them as testbuilds and push them into our Container Registry. When all of this was successful, the second job (or stage) in the pipeline will trigger, which uses those recently build test images, spins them up and runs some tests, if NGINX successfully started, is running, is accessible, and is serving the static pages, if the routing is correct, if it can reach the Strapi backend within its docker network, if strapi is responding and is responding on the necessary api endpoints and if the volumes were created. If all those tests are successful, we continue with the deploy stage. In there, we mark the testbuild images as correct by tagging them as :latest and pushing them to our Container Registry, in this way we make sure that only images that passed the tests will be pushed with the lastest tag (as in 'final' so to say). Then it will log into one of our servers by using an ssh jumper to reach the host where our live docker application is running, and performs an update and restarts the live application on our server.

## Manual Tests
Hint: There checks are already performed by the Gitlab CI/CD Pipeline integrated in this repo (check the [.gitlab-ci.yml](https://gitlab.com/rwf-dev-public/timeline/-/blob/master/.gitlab-ci.yml) file), before a prebuilt image is pushed with the :latest tag which the docker-compose-prebuilt-images.yml file uses. However, I explain the specific tests here so they can be manually performed in case of unexpected issues on the deployment server or localhost machine.
Here i provide a few steps on things you can check up on to make sure everything works as expected.
**Images** : You should see the two downloaded images named "registry.gitlab.com/rwf-dev-public/timeline/timeline-frontend" and "registry.gitlab.com/rwf-dev-public/timeline/timeline-backend"
```
$ docker images
```
**Containers** : You should see two containers running with the NAMES "timeline-backend" and "timeline-frontend" and their status shoud include "Up"
```
$ docker ps -a
```
**Network** :  You should see a network that had been created named "timeline-network"
```
$ docker network ls
```
**Network-Containers** :  When inspecting the network, in the "Containers" section, it should list two containers names "timeline-frontend" and "timeline-backend", which means that the containers successfully joined that network
```
$ docker network inspect timeline-network
```
**Containers-Network-Ping** :  We are going to check if the frontend-container can find the backend-container withing the docker network. Execute the following command, and check if responses are returned, then stop by pressing Control-C
```
$ docker exec -ti timeline-frontend ping timeline-backend
```
**Nginx** :  Now we are going to check if we can curl some information with nginx from the backend-container, this will allow us to check if nginx will be able to proxy and if strapi is running correctly:
```
$ docker exec -ti timeline-frontend /bin/sh
```
```
/ # curl timeline-backend:7000
```
In the response here, you should see a section like this, that strapi is running correctly in production:
>     <span class="environment">production</span>
>     <p>The server is running successfully.</p>
```
/ # curl timeline-backend:7000/dashboard -IL
```
In this header response, you should see HTTP/1.1 200 OK, meaning strapi serves the dashboard site and it is accessible within the docker network.
```
/ # curl timeline-backend:7000/events -IL
```
Here again, in this header response, you should see the HTTP/1.1 200 OK, meaning strapi api serving the data we need for the frontend. If you execute it without the -IL flag, you should see the sample data returned in your terminal.
```
/ # exit
```
**Volumes** :  In this list, you should see timline_sqlite and timeline_uploads
```
$ docker volume ls
```

## Remove
If you want to remove this application and cleanup your system, run
```
$ docker-compose down -v --rmi all --remove-orphans
```
---
By Philip Hofmann, philip.hofmann@ius.uzh.ch , http://philiphofmann.ch (https://phhofm.github.io/), http://rwi.app
