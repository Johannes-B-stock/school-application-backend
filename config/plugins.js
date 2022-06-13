module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        school: {
          field: "slug",
          references: "name",
        },
      },
    },
  },
  email: {
    config: {
      provider: "sendmail",
      settings: {
        defaultFrom: env("DEFAULT_EMAIL_FROM"),
        defaultReplyTo: env("DEFAULT_EMAIL_REPLYTO"),
      },
    },
  },
  // ...
});
