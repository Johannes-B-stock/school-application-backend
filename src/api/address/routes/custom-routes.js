module.exports = {
  routes: [
    {
      method: "GET",
      path: "/address/mine",
      handler: "address.find",
      config: {
        policies: ["is-mine-or-admin"],
      },
    },
  ],
};
