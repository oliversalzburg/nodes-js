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
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _currentConnectionSource, _currentDecoy, _currentDecoyLine, _draggables, _dragOperationSource, _scrollableContainer, _updateDecoy, updateDecoy_fn, _clearDecoy, clearDecoy_fn, _panning, _panInitMouse, _panInitWorkarea, _beginSynchronizedDragOperation, beginSynchronizedDragOperation_fn, _synchronizeDragOperation, synchronizeDragOperation_fn, _initNode, initNode_fn;
import "../../_snowpack/pkg/leader-line.js";
import LZString from "../../_snowpack/pkg/lz-string.js";
import PlainDraggable from "../../_snowpack/pkg/plain-draggable.js";
import {Behavior} from "../behavior/Behavior.js";
import {Execution} from "../execution/Execution.js";
import {isNil, mustExist} from "../Maybe.js";
import {Connection} from "./Connection.js";
import {Locator} from "./Locator.js";
import {NodeEditor} from "./NodeEditor.js";
import {snapshot} from "./snapshot.js";
import styles from "./Workarea.module.css.proxy.js";
export class Workarea extends HTMLElement {
  constructor() {
    super();
    _updateDecoy.add(this);
    _clearDecoy.add(this);
    _beginSynchronizedDragOperation.add(this);
    _synchronizeDragOperation.add(this);
    _initNode.add(this);
    _currentConnectionSource.set(this, void 0);
    _currentDecoy.set(this, void 0);
    _currentDecoyLine.set(this, void 0);
    _draggables.set(this, void 0);
    _dragOperationSource.set(this, void 0);
    _scrollableContainer.set(this, void 0);
    _panning.set(this, void 0);
    _panInitMouse.set(this, void 0);
    _panInitWorkarea.set(this, void 0);
    this.nodes = new Array();
    this.connections = new Set();
    __privateSet(this, _currentConnectionSource, null);
    __privateSet(this, _currentDecoy, null);
    __privateSet(this, _currentDecoyLine, null);
    __privateSet(this, _draggables, new Map());
    __privateSet(this, _dragOperationSource, new Map());
    __privateSet(this, _scrollableContainer, null);
    __privateSet(this, _panning, false);
    __privateSet(this, _panInitMouse, [0, 0]);
    __privateSet(this, _panInitWorkarea, [0, 0]);
    console.debug("Workarea constructed.");
  }
  get selectedNodes() {
    return this.nodes.filter((node) => node.selected);
  }
  connectedCallback() {
    this.classList.add(styles.workarea);
    this.addEventListener("click", (event) => this.onClick(event));
    this.addEventListener("mousedown", (event) => this.onMouseDown(event));
    this.addEventListener("mousemove", (event) => this.onMouseMove(event));
    this.addEventListener("mouseup", (event) => this.onMouseUp(event));
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("keyup", (event) => this.onKeyUp(event));
    console.debug("Workarea connected.");
  }
  initConnectionFrom(columnSource, event) {
    __privateSet(this, _currentConnectionSource, columnSource);
    const decoy = document.createElement("dt-decoy");
    decoy.init(this);
    this.appendChild(decoy);
    __privateSet(this, _currentDecoy, decoy);
    __privateSet(this, _currentDecoyLine, new LeaderLine(__privateGet(this, _currentConnectionSource), __privateGet(this, _currentDecoy), {
      color: "#0078d7",
      endSocket: "left",
      startSocket: "right"
    }));
    __privateMethod(this, _updateDecoy, updateDecoy_fn).call(this, event);
  }
  finalizeConnection(columnTarget) {
    if (!__privateGet(this, _currentConnectionSource)) {
      return;
    }
    this.connect(__privateGet(this, _currentConnectionSource), columnTarget);
  }
  updateConnections() {
    for (const connection of this.connections) {
      connection.line.position();
    }
    for (const node of this.nodes) {
      if (node.behaviorEditor) {
        node.behaviorEditor.line?.position();
      }
    }
  }
  connect(columnSource, columnTarget) {
    const connection = new Connection(columnSource, columnTarget);
    columnSource.connect(connection);
    columnTarget.connect(connection);
    this.connections.add(connection);
    this.storeSnapshot();
  }
  disconnect(connection) {
    this.connections.delete(connection);
    connection.disconnect();
    connection.target.parent?.updateUi();
  }
  disconnectNode(node, updateSnapshot = true) {
    for (const input of node.inputs) {
      if (input.output) {
        if (!this.connections.has(input.output)) {
          continue;
        }
        this.connections.delete(input.output);
        input.output.disconnect();
      }
    }
    for (const output of node.outputs) {
      for (const connection of output.inputs) {
        if (!this.connections.has(connection)) {
          continue;
        }
        this.connections.delete(connection);
        connection.disconnect();
      }
    }
    if (updateSnapshot) {
      this.storeSnapshot();
    }
  }
  editNodeBehavior(node, event) {
    if (node.behaviorEditor) {
      node.behaviorEditor.onClickDelete(event);
      return;
    }
    const editor = document.createElement("dt-node-editor");
    this.appendChild(editor);
    editor.init();
    editor.editNodeBehavior(node);
    editor.updateUi();
    const position = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).absoluteToDraggable({
      x: node.x + 250,
      y: node.y - 250
    });
    const draggable = new PlainDraggable(editor, {
      autoScroll: true,
      handle: editor.getElementsByTagName("title")[0],
      left: position.x,
      onDragStart: (event2) => {
        __privateMethod(this, _beginSynchronizedDragOperation, beginSynchronizedDragOperation_fn).call(this, node);
      },
      onMove: (newPosition) => {
        __privateMethod(this, _synchronizeDragOperation, synchronizeDragOperation_fn).call(this, node, newPosition);
        editor.updateUi();
      },
      top: position.y
    });
    __privateGet(this, _draggables).set(editor, draggable);
    editor.line = new LeaderLine(editor, mustExist(node.editElement), {
      color: "#888",
      dash: {len: 2, gap: 4},
      endSocket: "top",
      path: "grid",
      size: 2
    });
  }
  cancelBehaviorEditor(node, event) {
    if (!node.behaviorEditor) {
      return;
    }
    node.behaviorEditor.line?.remove();
    this.removeChild(node.behaviorEditor);
    __privateGet(this, _draggables).delete(node.behaviorEditor);
    node.behaviorEditor = null;
    node.updateUi();
  }
  closeBehaviorEditor(node, event) {
    if (!node.behaviorEditor) {
      return;
    }
    node.updateBehavior(Behavior.fromEditableScript(node.behaviorEditor.behaviorSource));
    this.cancelBehaviorEditor(node, event);
  }
  onClick(event) {
    if (event.target !== this) {
      return;
    }
  }
  onMouseDown(event) {
    if (__privateGet(this, _scrollableContainer) && event.button === 1) {
      __privateSet(this, _panning, true);
      __privateSet(this, _panInitMouse, [event.x, event.y]);
      __privateSet(this, _panInitWorkarea, [
        __privateGet(this, _scrollableContainer).scrollLeft,
        __privateGet(this, _scrollableContainer).scrollTop
      ]);
    }
  }
  onMouseMove(event) {
    if (__privateGet(this, _currentDecoy)) {
      __privateMethod(this, _updateDecoy, updateDecoy_fn).call(this, event);
    }
    if (__privateGet(this, _scrollableContainer) && __privateGet(this, _panning)) {
      __privateGet(this, _scrollableContainer).scrollLeft = __privateGet(this, _panInitWorkarea)[0] + __privateGet(this, _panInitMouse)[0] - event.x;
      __privateGet(this, _scrollableContainer).scrollTop = __privateGet(this, _panInitWorkarea)[1] + __privateGet(this, _panInitMouse)[1] - event.y;
    }
  }
  onMouseUp(event) {
    __privateSet(this, _currentConnectionSource, null);
    __privateMethod(this, _clearDecoy, clearDecoy_fn).call(this);
    __privateSet(this, _panning, false);
    if (event.target === this) {
      for (const node of [...this.selectedNodes]) {
        node.deselect();
      }
    }
  }
  onKeyDown(event) {
  }
  onKeyUp(event) {
    if (event.target !== document.body) {
      return;
    }
    switch (event.keyCode) {
      case 49: {
        this.createNode("seed");
        break;
      }
      case 50: {
        this.createNode("noop");
        break;
      }
      case 51: {
        this.createNode("script");
        break;
      }
      case 52: {
        this.createNode("row");
        break;
      }
      case 67:
        this.clear();
        break;
      case 82:
        this.restoreSnapshot();
        break;
      case 88:
        this.export();
        break;
      default:
        console.debug(event.keyCode);
    }
  }
  onNodeSelect(node, event) {
  }
  onNodeDeselect(node, event) {
  }
  onNodeResize(node) {
    if (node instanceof NodeEditor) {
      node.line?.position();
    }
  }
  registerScrollableContainer(scrollable) {
    __privateSet(this, _scrollableContainer, scrollable);
  }
  createNode(type, initParameters) {
    let node = null;
    switch (type) {
      case "script": {
        node = document.createElement("dt-node-script");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "noop": {
        node = document.createElement("dt-node-noop");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "row": {
        node = document.createElement("dt-node-row");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "seed": {
        node = document.createElement("dt-node-seed");
        __privateMethod(this, _initNode, initNode_fn).call(this, node, initParameters);
        break;
      }
      case "_editor":
        throw new Error("Behavior editors can not be created through this code path.");
    }
    return node;
  }
  deleteNode(node, updateSnapshot = true) {
    if (node instanceof NodeEditor) {
      this.cancelBehaviorEditor(mustExist(node.target));
      return;
    }
    if (node.behaviorEditor) {
      this.cancelBehaviorEditor(node);
    }
    this.disconnectNode(node, updateSnapshot);
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.removeChild(node);
    __privateGet(this, _draggables).delete(node);
    if (updateSnapshot) {
      this.storeSnapshot();
    }
  }
  deleteSelectedNodes() {
    for (const node of [...this.selectedNodes]) {
      this.deleteNode(node);
    }
  }
  clear() {
    for (const node of [...this.nodes]) {
      this.deleteNode(node, false);
    }
  }
  execute() {
    const execution = Execution.fromNodes(this.nodes);
    execution.plan();
    execution.execute();
  }
  export() {
    const serialized = this.serialize();
    const pretty = JSON.stringify(serialized, void 0, 2);
    console.debug(pretty);
    const short = JSON.stringify(serialized);
    const compressed = LZString.compressToBase64(short);
    const url = new URL(window.location.href);
    url.hash = compressed;
    console.info(url.toString());
  }
  import(compressedSnapshot) {
    const short = LZString.decompressFromBase64(compressedSnapshot);
    if (short === null) {
      throw new Error("Unable to decompress snapshot!");
    }
    const parsed = JSON.parse(short);
    this.deserialize(parsed);
  }
  storeSnapshot() {
    const snapshot2 = this.serialize();
    localStorage.setItem("snapshot", JSON.stringify(snapshot2));
    console.debug("Snapshot updated.");
  }
  restoreSnapshot() {
    const snapshotItem = localStorage.getItem("snapshot");
    if (snapshotItem === null) {
      return;
    }
    const snapshot2 = JSON.parse(snapshotItem);
    this.deserialize(snapshot2);
  }
  restoreSnapshotDemo() {
    this.deserialize(snapshot);
  }
  deserialize(workarea) {
    this.clear();
    const nodes = new Map();
    const inputs = new Map();
    const outputs = new Map();
    for (const node of workarea.nodes) {
      const createdNode = this.createNode(node.type, node);
      nodes.set(mustExist(createdNode.nodeId), createdNode);
      for (const input of createdNode.inputs) {
        inputs.set(mustExist(input.columnId), input);
      }
      for (const output of createdNode.outputs) {
        outputs.set(mustExist(output.columnId), output);
      }
    }
    for (const node of workarea.nodes) {
      for (const output of node.outputs) {
        for (const inputId of output.inputs) {
          this.connect(mustExist(outputs.get(output.id)), mustExist(inputs.get(inputId)));
        }
      }
    }
    for (const node of this.nodes) {
      for (const input of node.inputs) {
        input.update();
        input.updateUi();
      }
    }
    if (!isNil(workarea.stage) && !isNil(__privateGet(this, _scrollableContainer))) {
      __privateGet(this, _scrollableContainer).scroll(workarea.stage.x, workarea.stage.y);
    }
  }
  serialize() {
    return {
      stage: __privateGet(this, _scrollableContainer) ? {x: __privateGet(this, _scrollableContainer).scrollLeft, y: __privateGet(this, _scrollableContainer).scrollTop} : void 0,
      nodes: this.nodes.map((node) => node.serialize())
    };
  }
}
_currentConnectionSource = new WeakMap();
_currentDecoy = new WeakMap();
_currentDecoyLine = new WeakMap();
_draggables = new WeakMap();
_dragOperationSource = new WeakMap();
_scrollableContainer = new WeakMap();
_updateDecoy = new WeakSet();
updateDecoy_fn = function(event) {
  if (!isNil(__privateGet(this, _currentDecoy))) {
    const bounds = this.getBoundingClientRect();
    __privateGet(this, _currentDecoy).style.transform = `translate(${event.pageX - bounds.left}px, ${event.pageY - bounds.top}px)`;
  }
  if (!isNil(__privateGet(this, _currentDecoyLine))) {
    __privateGet(this, _currentDecoyLine).position();
  }
};
_clearDecoy = new WeakSet();
clearDecoy_fn = function() {
  if (!isNil(__privateGet(this, _currentDecoy))) {
    this.removeChild(__privateGet(this, _currentDecoy));
    __privateSet(this, _currentDecoy, null);
  }
  if (!isNil(__privateGet(this, _currentDecoyLine))) {
    __privateGet(this, _currentDecoyLine).remove();
    __privateSet(this, _currentDecoyLine, null);
  }
};
_panning = new WeakMap();
_panInitMouse = new WeakMap();
_panInitWorkarea = new WeakMap();
_beginSynchronizedDragOperation = new WeakSet();
beginSynchronizedDragOperation_fn = function(dragRoot) {
  __privateGet(this, _dragOperationSource).clear();
  __privateGet(this, _dragOperationSource).set(dragRoot, {x: dragRoot.x, y: dragRoot.y});
  const locator = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0);
  for (const node of this.selectedNodes) {
    __privateGet(this, _dragOperationSource).set(node, locator.absoluteToDraggable({x: node.x, y: node.y}));
  }
};
_synchronizeDragOperation = new WeakSet();
synchronizeDragOperation_fn = function(dragRoot, newPosition) {
  const rootDragSource = mustExist(__privateGet(this, _dragOperationSource).get(dragRoot));
  const deltaX = newPosition.left - rootDragSource.x;
  const deltaY = newPosition.top - rootDragSource.y;
  for (const node of this.selectedNodes) {
    if (node === dragRoot) {
      continue;
    }
    const nodeDragSource = mustExist(__privateGet(this, _dragOperationSource).get(node));
    const nodeDraggable = mustExist(__privateGet(this, _draggables).get(node));
    const position = {
      x: nodeDragSource.x + deltaX,
      y: nodeDragSource.y + deltaY
    };
    nodeDraggable.left = position.x;
    nodeDraggable.top = position.y;
    const positionAbsolute = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).draggableToAbsolute(position);
    node.x = positionAbsolute.x;
    node.y = positionAbsolute.y;
    node.updateUi();
  }
};
_initNode = new WeakSet();
initNode_fn = function(node, initParameters) {
  this.appendChild(node);
  node.init(initParameters);
  this.nodes.push(node);
  const containerBounds = __privateGet(this, _scrollableContainer) ? {
    width: __privateGet(this, _scrollableContainer).clientWidth,
    height: __privateGet(this, _scrollableContainer).clientHeight
  } : {
    width: this.clientWidth,
    height: this.clientHeight
  };
  let position;
  if (!isNil(initParameters) && !isNil(initParameters.x) && !isNil(initParameters.y)) {
    position = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).absoluteToDraggable(initParameters);
  } else {
    position = {
      x: this.offsetLeft + containerBounds.width / 2 - node.clientWidth / 2,
      y: this.offsetTop + containerBounds.height / 2 - node.clientHeight / 2
    };
  }
  const draggable = new PlainDraggable(node, {
    autoScroll: true,
    handle: node.getElementsByTagName("title")[0],
    left: position.x,
    onDragEnd: (newPosition) => {
      node.updateUi(Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).draggableToAbsolute({
        x: newPosition.left,
        y: newPosition.top
      }));
      console.debug(`Node ${node.nodeId} moved to ${node.x}x${node.y} (movement was ${Math.round(newPosition.left)}x${Math.round(newPosition.top)}).`);
      this.storeSnapshot();
    },
    onDragStart: (event) => {
      __privateMethod(this, _beginSynchronizedDragOperation, beginSynchronizedDragOperation_fn).call(this, node);
    },
    onMove: (newPosition) => {
      __privateMethod(this, _synchronizeDragOperation, synchronizeDragOperation_fn).call(this, node, newPosition);
      mustExist(node).updateUi();
    },
    top: position.y
  });
  __privateGet(this, _draggables).set(node, draggable);
  const coords = Locator.forWorkarea(this, __privateGet(this, _scrollableContainer) ?? void 0).draggableToAbsolute(position);
  node.updateUi(coords);
  console.debug(`Created node ${node.nodeId} at ${Math.round(node.x)}x${Math.round(node.y)}.`);
  this.storeSnapshot();
};
customElements.define("dt-workarea", Workarea);
