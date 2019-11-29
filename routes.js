const routes = require("next-routes")();

routes.addResource = function(plural, singular) {
  return this.add(plural, `/platforms/:platformId/${plural}`, plural)
    .add(`${singular}New`, `/platforms/:platformId/${plural}/new`, plural)
    .add(singular, `/platforms/:platformId/${plural}/:id`, plural);
};

routes
  .add("root", "/", "index")
  .addResource("actions", "action")
  .addResource("entities", "entity")
  .addResource("fields", "field")
  .addResource("permissions", "permission")
  .addResource("relations", "relation")
  .addResource("types", "type")
  .addResource("users", "user")
  .addResource("validators", "validator")
  .addResource("views", "view")
  .addResource("widgets", "widget")
  .add("admin", "/platforms/:platformId/admin", "admin")
  .add("mapping", "/platforms/:platformId/source/:type/:sourceId/mapping", "mapping")
  .add("sourceTypes", `/platforms/:platformId/sources`, "sources")
  .add("sources", "/platforms/:platformId/sources/:type", "source")
  .add("sourceNew", "/platforms/:platformId/source/:type/new", "source")
  .add("sourceImport", "/platforms/:platformId/source/:type/:id/import", "source")
  .add("source", "/platforms/:platformId/source/:type/:id", "source")
  .add("resources", "/platforms/:platformId/data/:entityId/:view?", "resources")
  .add("resourceEdit", "/platforms/:platformId/data/:entityId/:view/:id/:path?/edit", "resource")
  .add("resourceFiles", "/platforms/:platformId/data/:entityId/:view/:id/:path?/files", "resource")
  .add("resource", "/platforms/:platformId/data/:entityId/:view/:id/:path?", "resource")
  .add("login", "/login", "login")
  .add("platforms", "/platforms", "platforms")
  .add("platform", "/platforms/:platformId", "platform")
  .add("systemRecords", "/platforms/:platformId/system-records", "systemRecords")
  .add("design", "/platforms/:platformId/design", "design");

module.exports = routes;
