# based on the strapi images which includes necessary dependencies already instead of building on a barebones alpine myself
FROM strapi/base
# this command only runs on the container
RUN mkdir -p /home/app
# this command copies files from the current folder on the host to the respective folder in the container
COPY . /home/app
# set working directory so it finds needed files like package.json
WORKDIR /home/app
# set production environment
ENV NODE_ENV=production
# expose port
# EXPOSE 7000
# this is the entry command
CMD ["npm", "start"]