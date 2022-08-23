module.exports = function (app) {
  var getLinksController = require("./getLinksController.js");

  app.route("/api/crawl-links").post(getLinksController.getLinksAndAddToDB);
};
