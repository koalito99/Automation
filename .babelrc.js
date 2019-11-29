const execSync = require("child_process").execSync;

const devConfig = require("./define.dev.js");
const testConfig = require("./define.test.js");
const prodConfig = require("./define.production.js");

function getConfig(env) {
  switch (env) {
    case "production": {
      return prodConfig;
    }
    case "test": {
      return testConfig;
    }
    case "dev": {
      return devConfig;
    }
    default: {
      return devConfig;
    }
  }
}

const firebaseConfig = execSync("cd .. && firebase functions:config:get app").toString("utf8");

let config = Object.assign({}, getConfig(process.env.ENV), {
  "process.env.FIREBASE_CONFIG": firebaseConfig
});

module.exports = {
  presets: ["next/babel", "@babel/preset-env"],
  plugins: [
    ["transform-define", config],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
    [
      "styled-components",
      {
        ssr: true,
        displayName: true
      }
    ],
    [
      "module-resolver",
      {
        root: ["./"]
      }
    ]
  ],
  retainLines: true
};
