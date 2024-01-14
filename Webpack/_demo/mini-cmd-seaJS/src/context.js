import { getRootPath } from './util.js';
class Context {
  constructor() {
    this.config = {}
    this.modules = {}
  }
  setConfig(config) {
    const rootPath = getRootPath()
    config.base = rootPath + '/' + config.base.split('/').slice(1)
    config.alias = {
      ...config.alias,
    }
    this.config = config;
  }
  getConfig() {
    return this.config;
  }

  setModule(moduleId, module) {
    this.modules[moduleId] = module;
  }
  getModule(moduleId) {
    return this.modules[moduleId];
  }
}
const contextInstance = new Context();

export default contextInstance;
