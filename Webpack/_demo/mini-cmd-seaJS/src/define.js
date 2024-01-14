import {
  getAbsPath,
  getCurrentScriptSrc,
  parseDependency,
} from "./util";
import Module from "./module";
import contextInstance from "./context";

export default function define(factory) {
  const id = getCurrentScriptSrc();
  const module = contextInstance.getModule(getAbsPath(id));
  module.factory = factory;
  const deps = (module.deps = parseDependency(factory.toString()));
  if (deps.length > 0) {
    Promise.all(
      deps.map((depId) => {
        return new Promise(((resolve, reject) => {
            const absPath = getAbsPath(depId);
            const depModule = contextInstance.getModule(absPath) || new Module(absPath);
            depModule.on('complete', resolve)
            depModule.on('error', reject)
        }))
      })
    ).then(() => {
        module.emit('complete')
    }).catch((err) => {
      module.emit('error', err)
    })
  } else {
    module.emit('complete')
  }
}
