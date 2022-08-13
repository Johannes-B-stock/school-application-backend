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
  "duplicate-button": true,
  "import-export-entries": {
    enabled: true,
  },
  deepl: {
    enabled: true,
    config: {
      // your DeepL API key
      apiKey: "9e90f76d-aac3-a8ed-df00-5bae66fae0a0:fx",
      // whether to use the free or paid api, default true
      freeApi: true,
      // Which field types are translated (default string, text, richtext, components and dynamiczones)
      translatedFieldTypes: [
        "string",
        "text",
        "richtext",
        "component",
        "dynamiczone",
      ],
      // If relations should be translated (default true)
      translateRelations: true,
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
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  email: {
    provider: env("EMAIL_PROVIDER"),
    providerOptions: {
      host: env("EMAIL_SMTP_HOST", "smtp.example.com"),
      port: env("EMAIL_SMTP_PORT", 587),
      auth: {
        user: env("EMAIL_SMTP_USER"),
        pass: env("EMAIL_SMTP_PASS"),
      },
    },
    settings: {
      defaultFrom: env("DEFAULT_EMAIL_FROM"),
      defaultReplyTo: env("DEFAULT_EMAIL_REPLYTO"),
    },
  },
  // ...
});
