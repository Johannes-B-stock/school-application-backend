module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '45c6bbd9857f6f434afeec40239cb6d2'),
  },
});
