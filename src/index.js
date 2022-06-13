"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const pluginStore = strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });
    // Ensure profile scope for Google Auth
    const grantConfig = await pluginStore.get({ key: "grant" });
    if (grantConfig) {
      if (grantConfig.google && grantConfig.google.scope) {
        grantConfig.google.scope = ["openid", "email", "profile"];
        await pluginStore.set({ key: "grant", value: grantConfig });
      }
    }
  },
};
