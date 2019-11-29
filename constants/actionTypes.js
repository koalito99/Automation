import { defineAction } from "redux-define";

const NAMESPACE = "Platform";

export default {
  DRAWER: defineAction("DRAWER", ["TOGGLE"], NAMESPACE),
  ROUTE: defineAction("ROUTE", ["CHANGE"], NAMESPACE),
  PLATFORMS: defineAction("PLATFORMS", ["ADD", "CANCEL", "DRAFT_CHANGE"], NAMESPACE),
  DRAFT: defineAction("DRAFT", ["DRAFT_SET", "DRAFT_FIELD_SET", "ERRORS_SET"], NAMESPACE),
  FILTERS: defineAction("FILTERS", ["TOGGLE"], NAMESPACE),
  RECORDS: defineAction("RECORDS", ["SELECT"], NAMESPACE),
  INDEXING: defineAction("INDEXING", ["SET"], NAMESPACE)
};
