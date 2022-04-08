var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _script, _metadata;
import {BehaviorMetadata} from "./BehaviorMetadata.js";
const _Behavior = class {
  constructor(script = "", metadata = new BehaviorMetadata()) {
    _script.set(this, void 0);
    _metadata.set(this, void 0);
    __privateSet(this, _script, script);
    __privateSet(this, _metadata, metadata);
  }
  get metadata() {
    return __privateGet(this, _metadata);
  }
  toExecutableBehavior() {
    return __privateGet(this, _metadata).wrapExecutable(__privateGet(this, _script));
  }
  toEditableScript() {
    return __privateGet(this, _metadata).serialize() + "\n\n" + __privateGet(this, _script);
  }
  toCodeFragment() {
    return __privateGet(this, _script);
  }
  static fromEditableScript(editable) {
    const metadata = BehaviorMetadata.parse(editable);
    const script = BehaviorMetadata.stripMetadataFromBehaviorScript(editable);
    return new _Behavior(script, metadata);
  }
  static fromCodeFragment(executable, metadata) {
    return new _Behavior(executable, metadata);
  }
  static fromCodeFragmentForNode(executable, node) {
    return new _Behavior(executable, BehaviorMetadata.fromNode(node));
  }
};
export let Behavior = _Behavior;
_script = new WeakMap();
_metadata = new WeakMap();
