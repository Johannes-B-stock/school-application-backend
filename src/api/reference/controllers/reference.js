"use strict";

const { isNotAdmin } = require("../../../common/utils");
const utils = require("@strapi/utils");
const { ForbiddenError } = utils.errors;

/**
 *  reference controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::reference.reference",
  ({ strapi }) => ({
    async find(ctx) {
      if (isNotAdmin(ctx)) {
        if (!ctx.query.uid && !ctx.query.filters.uid) {
          throw new ForbiddenError(
            "If user is not admin then the uid has to be given to find a reference"
          );
        }
        if (!ctx.query.filters.uid) {
          ctx.query = {
            ...ctx.query,
            filters: {
              ...ctx.query?.filters,
              uid: { $eq: ctx.query.uid },
            },
          };
        }
      }
      const found = await super.find(ctx);
      return found;
    },
    async create(ctx) {
      try {
        const pageContent = await strapi.entityService.findMany(
          "api::page-content.page-content"
        );

        const siteName = pageContent.pageTitle;

        await strapi
          .plugin("email-designer")
          .service("email")
          .sendTemplatedEmail(
            {
              // required
              to: ctx.request.body.data.email,
            },
            {
              // required - Ref ID defined in the template designer (won't change on import)
              templateReferenceId: 1,
            },
            {
              // this object must include all variables you're using in your email template
              user: ctx.state.user,
              reference: ctx.request.body.data,
              url: ctx.request.body.data.url,
              site: {
                name: siteName,
              },
              SITE: {
                name: siteName,
              },
            }
          );
        ctx.request.body.data = { ...ctx.request.body.data, emailSend: true };
        const reference = await super.create(ctx);
        return reference;
      } catch (err) {
        strapi.log.debug("📺: ", err);
        return ctx.badRequest(null, err);
      }
    },
  })
);
