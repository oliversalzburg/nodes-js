var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _consumersToStage, consumersToStage_fn;
import ElapsedTime from "../../_snowpack/pkg/elapsed-time.js";
import {isNil, mustExist} from "../Maybe.js";
const _Execution = class {
  constructor(nodes) {
    _consumersToStage.add(this);
    this.stages = null;
    this.nodes = nodes;
  }
  plan() {
    const entry = ElapsedTime.new().start();
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
    console.log(`Execution planned in ${entry.getValue()}.`);
  }
  async execute(withUpdateUi = true) {
    const entry = ElapsedTime.new().start();
    if (isNil(this.stages)) {
      return;
    }
    if (withUpdateUi) {
      for (const stage of this.stages) {
        for (const node of stage) {
          await node.update();
          node.updateUi();
        }
      }
    } else {
      for (const stage of this.stages) {
        for (const node of stage) {
          await node.update();
        }
      }
    }
    console.log(`Executed in ${entry.getValue()}.`);
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
