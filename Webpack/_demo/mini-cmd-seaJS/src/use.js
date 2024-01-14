import {  getAbsPath } from "./util";
import { loadModule } from "./module";

export default function use(entryId, callback) {
  const absPath = getAbsPath(entryId);
  loadModule(absPath, callback);
}

