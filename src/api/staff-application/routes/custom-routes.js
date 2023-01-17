"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/staff-applications/me",
      handler: "staff-application.me",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/staff-applications/count",
      handler: "staff-application.count",
      config: {
        policies: [],
      },
    },
  ],
};
