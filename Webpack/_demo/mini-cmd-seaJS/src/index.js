import define from "./define";
import { require } from "./require";
import use from "./use";
import contextInstance from "./context";

window.define = define;
window.require = require;

window.seajs = {
  config: (config) => contextInstance.setConfig(config),
  use: use,
};
