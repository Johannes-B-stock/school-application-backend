"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-details/me",
      handler: "user-detail.findMe",
    },
    {
      method: "PUT",
      path: "/user-details/me",
      handler: "user-detail.updateMe",
      //   config: {
      //     policies: ["is-mine"],
      //   },
    },
    {
      method: "POST",
      path: "/user-details/me",
      handler: "user-detail.createMe",
    },
  ],
};
