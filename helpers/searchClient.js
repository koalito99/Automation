import algoliasearch from "algoliasearch/lite";

const production = false; // process.env.ENV === "test"

export default algoliasearch(
  production ? "YT48HOY4PL" : "UR92T45LCG",
  production
    ? "0e8a84536ccb933ae143fc95e2b9d4b1"
    : "da1a0ac46f838379e184eb6b1cfcc5c8"
);
