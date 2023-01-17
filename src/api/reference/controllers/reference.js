"use strict";

const emailTemplate = {
  subject: "Reference for <%= user.username %>",
  text: `Hello <%= reference.name %>, 
    You have been chosen as reference from <%= user.username %>.

    Please click on this link to answer all questions that we have for you and answer all questions honestly: 
    
    <%= site.url %>/references/<%= reference.url %>

    Be blessed,
    <%= site.name %>
    `,
  html: `<h4>Hello <%= reference.name %>,</h4>
      <p>You have been chosen as reference from <%= user.username %>.</p>
      <p>Please click on this link to answer all questions that we have for you and answer all questions honestly: 
        <br /> <br />
      <%= reference.url %>
    <br /> <br />
      Be blessed, <br/>
      <%= site.name %> </p>`,
};

/**
 *  reference controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::reference.reference",
  ({ strapi }) => ({
    async create(ctx) {
      try {
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
                name: "Y-Apply School Applications",
              },
              SITE: {
                name: "Y-Apply School Applications",
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

      // await strapi.plugins["email"].services.email.sendTemplatedEmail(
      //   {
      //     to: reference.data.attributes.email,
      //     // from: is not specified, so it's the defaultFrom that will be used instead
      //   },
      //   emailTemplate,
      //   {
      //     user: ctx.state.user,
      //     reference: reference.data.attributes,
      //     site: { name: "School Application Page" },
      //   }
      // );
    },
  })
);
