var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _consumersToStage, consumersToStage_fn;
import {isNil, mustExist} from "../Maybe.js";
const _Execution = class {
  constructor(nodes) {
    _consumersToStage.add(this);
    this.stages = null;
    this.nodes = nodes;
  }
  plan() {
    const roots = new Set();
    for (const node of this.nodes) {
      if (node.inputs.length === 0) {
        roots.add(node);
        continue;
      }
    }
    if (roots.size === 0) {
      return;
    }
    this.stages = [roots];
    let stage = roots;
    while (0 < stage.size) {
      stage = __privateMethod(this, _consumersToStage, consumersToStage_fn).call(this, stage);
      if (0 < stage.size) {
        this.stages.push(stage);
      }
    }
  }
  execute(withUpdateUi = true) {
    if (isNil(this.stages)) {
      return;
    }
    if (withUpdateUi) {
      for (const stage of this.stages) {
        for (const node of stage) {
          node.update();
          node.updateUi();
        }
      }
    } else {
      for (const stage of this.stages) {
        for (const node of stage) {
          node.update();
        }
      }
    }
  }
  static fromNodes(nodes) {
    const execution = new _Execution([...nodes]);
    return execution;
  }
};
export let Execution = _Execution;
_consumersToStage = new WeakSet();
consumersToStage_fn = function(roots) {
  const consumers = new Set();
  for (const root of roots) {
    for (const output of root.outputs) {
      for (const input of output.inputs) {
        consumers.add(mustExist(input.target.parent));
      }
    }
  }
  return consumers;
};
