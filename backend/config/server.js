const {
  default: createStrapi
} = require("strapi");

module.exports = ({
  env
}) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 7000),
  url: '', // for development, goes to localhost
  //url: 'https://strapi.rwi.app', //for production
  admin: {
    url: '/dashboard', // We change the path to access to the admin (highly recommended for security reasons).
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'dbdcaf6b43f5b1a460ce9711ac37d503'),
    },
  },
});