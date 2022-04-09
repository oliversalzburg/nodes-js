import {c as createCommonjsModule} from "../../../common/_commonjsHelpers-8c19dec8.js";
import codemirror from "../../../codemirror.js";
var javascriptHint = createCommonjsModule(function(module, exports) {
  (function(mod) {
    mod(codemirror);
  })(function(CodeMirror) {
    var Pos = CodeMirror.Pos;
    function forEach(arr, f) {
      for (var i = 0, e = arr.length; i < e; ++i)
        f(arr[i]);
    }
    function arrayContains(arr, item) {
      if (!Array.prototype.indexOf) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === item) {
            return true;
          }
        }
        return false;
      }
      return arr.indexOf(item) != -1;
    }
    function scriptHint(editor, keywords, getToken, options) {
      var cur = editor.getCursor(), token = getToken(editor, cur);
      if (/\b(?:string|comment)\b/.test(token.type))
        return;
      var innerMode = CodeMirror.innerMode(editor.getMode(), token.state);
      if (innerMode.mode.helperType === "json")
        return;
      token.state = innerMode.state;
      if (!/^[\w$_]*$/.test(token.string)) {
        token = {
          start: cur.ch,
          end: cur.ch,
          string: "",
          state: token.state,
          type: token.string == "." ? "property" : null
        };
      } else if (token.end > cur.ch) {
        token.end = cur.ch;
        token.string = token.string.slice(0, cur.ch - token.start);
      }
      var tprop = token;
      while (tprop.type == "property") {
        tprop = getToken(editor, Pos(cur.line, tprop.start));
        if (tprop.string != ".")
          return;
        tprop = getToken(editor, Pos(cur.line, tprop.start));
        if (!context)
          var context = [];
        context.push(tprop);
      }
      return {
        list: getCompletions(token, context, keywords, options),
        from: Pos(cur.line, token.start),
        to: Pos(cur.line, token.end)
      };
    }
    function javascriptHint2(editor, options) {
      return scriptHint(editor, javascriptKeywords, function(e, cur) {
        return e.getTokenAt(cur);
      }, options);
    }
    CodeMirror.registerHelper("hint", "javascript", javascriptHint2);
    function getCoffeeScriptToken(editor, cur) {
      var token = editor.getTokenAt(cur);
      if (cur.ch == token.start + 1 && token.string.charAt(0) == ".") {
        token.end = token.start;
        token.string = ".";
        token.type = "property";
      } else if (/^\.[\w$_]*$/.test(token.string)) {
        token.type = "property";
        token.start++;
        token.string = token.string.replace(/\./, "");
      }
      return token;
    }
    function coffeescriptHint(editor, options) {
      return scriptHint(editor, coffeescriptKeywords, getCoffeeScriptToken, options);
    }
    CodeMirror.registerHelper("hint", "coffeescript", coffeescriptHint);
    var stringProps = "charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search".split(" ");
    var arrayProps = "length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ".split(" ");
    var funcProps = "prototype apply call bind".split(" ");
    var javascriptKeywords = "break case catch class const continue debugger default delete do else export extends false finally for function if in import instanceof new null return super switch this throw true try typeof var void while with yield".split(" ");
    var coffeescriptKeywords = "and break catch class continue delete do else extends false finally for if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes".split(" ");
    function forAllProps(obj, callback) {
      if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
        for (var name in obj)
          callback(name);
      } else {
        for (var o = obj; o; o = Object.getPrototypeOf(o))
          Object.getOwnPropertyNames(o).forEach(callback);
      }
    }
    function getCompletions(token, context, keywords, options) {
      var found = [], start = token.string, global = options && options.globalScope || window;
      function maybeAdd(str) {
        if (str.lastIndexOf(start, 0) == 0 && !arrayContains(found, str))
          found.push(str);
      }
      function gatherCompletions(obj2) {
        if (typeof obj2 == "string")
          forEach(stringProps, maybeAdd);
        else if (obj2 instanceof Array)
          forEach(arrayProps, maybeAdd);
        else if (obj2 instanceof Function)
          forEach(funcProps, maybeAdd);
        forAllProps(obj2, maybeAdd);
      }
      if (context && context.length) {
        var obj = context.pop(), base;
        if (obj.type && obj.type.indexOf("variable") === 0) {
          if (options && options.additionalContext)
            base = options.additionalContext[obj.string];
          if (!options || options.useGlobalScope !== false)
            base = base || global[obj.string];
        } else if (obj.type == "string") {
          base = "";
        } else if (obj.type == "atom") {
          base = 1;
        } else if (obj.type == "function") {
          if (global.jQuery != null && (obj.string == "$" || obj.string == "jQuery") && typeof global.jQuery == "function")
            base = global.jQuery();
          else if (global._ != null && obj.string == "_" && typeof global._ == "function")
            base = global._();
        }
        while (base != null && context.length)
          base = base[context.pop().string];
        if (base != null)
          gatherCompletions(base);
      } else {
        for (var v = token.state.localVars; v; v = v.next)
          maybeAdd(v.name);
        for (var c = token.state.context; c; c = c.prev)
          for (var v = c.vars; v; v = v.next)
            maybeAdd(v.name);
        for (var v = token.state.globalVars; v; v = v.next)
          maybeAdd(v.name);
        if (options && options.additionalContext != null)
          for (var key in options.additionalContext)
            maybeAdd(key);
        if (!options || options.useGlobalScope !== false)
          gatherCompletions(global);
        forEach(keywords, maybeAdd);
      }
      return found;
    }
  });
});
export default javascriptHint;
