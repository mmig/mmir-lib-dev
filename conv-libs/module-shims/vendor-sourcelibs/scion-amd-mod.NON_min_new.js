(function () {
	var a = {},
	b = {},
	c = function (f, g) {
		var h = d(g, f),
		i = b[h],
		j;
		if (i)
			return i.exports;
		if (!(j = a[h] || a[h = d(h, "./index")]))
			throw "module '" + f + "' not found";
		i = {
			id: h,
			exports: {}
		};
		try {
			return b[h] = i,
			j(i.exports, function (a) {
				return c(a, e(h))
			}, i),
			i.exports
		} catch (k) {
			throw delete b[h],
			k
		}
	},
	d = function (a, b) {
		var c = [],
		d,
		e;
		/^\.\.?(\/|$)/.test(b) ? d = [a, b].join("/").split("/") : d = b.split("/");
		for (var f = 0, g = d.length; f < g; f++)
			e = d[f], e == ".." ? c.pop() : e != "." && e != "" && c.push(e);
		return c.join("/")
	},
	e = function (a) {
		return a.split("/").slice(0, -1).join("/")
	};
	return function (b) {
		for (var d in b)
			a[d] = b[d];
		typeof define == "function" && define.amd ? define([], function () {
			return c("scion", "")
		}) : (this.scion = c("scion", ""), this.require || (this.require = function (a) {
				return c(a, "")
			}))
	}
}).call(this)({
	"base-platform/dom": function (a, b, c) {
		"use strict",
		c.exports = {
			getChildren: function (a) {
				return Array.prototype.slice.call(a.childNodes)
			},
			localName: function (a) {
				return a.localName
			},
			getAttribute: function (a, b) {
				return a.getAttribute(b)
			},
			hasAttribute: function (a, b) {
				return a.hasAttribute(b)
			},
			namespaceURI: function (a) {
				return a.namespaceURI
			},
			createElementNS: function (a, b, c) {
				return a.createElementNS(b, c)
			},
			setAttribute: function (a, b, c) {
				return a.setAttribute(b, c)
			},
			appendChild: function (a, b) {
				return a.appendChild(b)
			},
			textContent: function (a, b) {
				if (b === undefined)
					return a.nodeType === 1 ? a.textContent !== undefined ? a.textContent : this.getChildren(a).map(function (a) {
						return this.textContent(a)
					}, this).join("") : a.nodeType === 3 || a.nodeType === 4 ? a.data : "";
				if (a.nodeType === 1) {
					if (a.textContent !== undefined)
						return a.textContent = b;
					var c = a.ownerDocument.createTextNode(b);
					return a.appendChild(c),
					b
				}
				if (a.nodeType === 3)
					return a.data = b
			},
			getElementChildren: function (a) {
				return this.getChildren(a).filter(function (a) {
					return a.nodeType === 1
				})
			}
		}
	},
	"base-platform/eval": function (exports, require, module) {
		module.exports = function (content, name) {
			return eval("(function(){\nreturn " + content + ";})()")
		}
	},
	"base-platform/path": function (a, b, c) {
		"use strict",
		c.exports = {
			sep: "/",
			join: function (a, b) {
				return a + "/" + b
			},
			dirname: function (a) {
				return a.split(this.sep).slice(0, -1).join(this.sep)
			},
			basename: function (a, b) {
				var c = a.split(this.sep).slice(-1);
				if (b) {
					var d = this.extname(c);
					d[1] === b && (c = d[1])
				}
				return c
			},
			extname: function (a) {
				return a.split(/\\.(?=[^\\.]+$)/)[1]
			}
		}
	},
	"browser/browser-listener-client": function (a, b, c) {},
	"browser/dom": function (a, b, c) {
		function e(a, b) {
			return "item" in a ? a.item(b) : a[b]
		}
		"use strict";
		var d = b("../base-platform/dom"),
		f = Object.create(d);
		f.hasAttribute = function (a, b) {
			return a.hasAttribute ? a.hasAttribute(b) : a.getAttribute(b)
		},
		f.localName = function (a) {
			return a.localName || a.tagName
		},
		f.createElementNS = function (a, b, c) {
			return a.createElementNS ? a.createElementNS(b, c) : a.createElement(c)
		},
		f.getChildren = function (a) {
			var b = [];
			for (var c = 0; c < a.childNodes.length; c++)
				b.push(e(a.childNodes, c));
			return b
		},
		f.serializeToString = function (a) {
			return a.xml || (new XMLSerializer).serializeToString(a)
		},
		c.exports = f
	},
	"browser/platform": function (a, b, c) {
		"use strict";
		var d = b("../core/util/util");
		a.platform = {
			ajax: require("mmirf/util/loadFile"),
			eval: b("../base-platform/eval"),
			getDocumentFromUrl: function (a, b, c) {
				this.ajax({
					url: a,
					success: function (a) {
						b(null, a)
					},
					dataType: "xml",
					error: function (a) {
						b(a)
					}
				})
			},
			parseDocumentFromString: function (a) {
				return (new window.DOMParser).parseFromString(a, "application/xml")
			},
			getDocumentFromFilesystem: function (a, b, c) {
				this.getDocumentFromUrl(a, b, c)
			},
			getResourceFromUrl: function (a, b, c) {
				this.ajax({
					url: a,
					success: function (a) {
						b(null, a)
					},
					error: function (a) {
						b(a)
					}
				})
			},
			postDataToUrl: function (a, b, c) {
				this.ajax.post({
					type: "post",
					url: a,
					data: b,
					success: function (a) {
						c(null, a)
					},
					error: function (a) {
						c(a)
					}
				})
			},
			setTimeout: function (a, b) {
				return window.setTimeout(a, b)
			},
			clearTimeout: function (a) {
				window.clearTimeout(a)
			},
			log: window.console && window.console.log && (window.console.log.bind ? window.console.log.bind(window.console) : window.console.log),
			path: b("../base-platform/path"),
			url: b("./url"),
			dom: b("./dom")
		}
	},
	"browser/url": function (a, b, c) {
		function d(a) {
//			var b = document.createElement("a");
//			return b.href = a,
//			b
			//modified from https://stackoverflow.com/a/21553982/4278324
			var match = href.match(/^((https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?))?([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
		    return match && {
		        href: href,
		        protocol: match[1],
		        host: match[2],
		        hostname: match[3],
		        port: match[4],
		        pathname: match[6],
		        search: match[7],
		        hash: match[8]
		    }
		}
		"use strict",
		c.exports = {
			getPathFromUrl: function (a) {
				var b = d(a);
				return b.pathname
			},
			changeUrlPath: function (a, b) {
				var c = d(a);
				return c.protocol + "//" + c.hostname + ":" + c.port + b
			}
		}
	},
	"core/constants": function (a, b, c) {
		"use strict",
		c.exports = {
			SCXML_NS: "http://www.w3.org/2005/07/scxml"
		}
	},
	"core/scxml/SCXML": function (a, b, c) {
		function i(a) {
			return function (a) {
				var b = a[0],
				c = a[1];
				return b.source.depth < c.source.depth ? c : c.source.depth < b.source.depth ? b : b.documentOrder < c.documentOrder ? b : c
			}
		}
		function k(a, b) {
			this.model = a,
			this.opts = b,
			this.opts.log = this.opts.log || h.platform.log,
			this.opts.StateIdSet = this.opts.StateIdSet || d,
			this.opts.EventSet = this.opts.EventSet || d,
			this.opts.TransitionPairSet = this.opts.TransitionPairSet || d,
			this.opts.priorityComparisonFn = this.opts.priorityComparisonFn || i(this.opts.model),
			this.opts.retrace = false,
			this._sessionid = this.opts.sessionid || "",
			this._configuration = new this.opts.BasicStateSet,
			this._historyValue = {},
			this._innerEventQueue = [],
			this._isInFinalState = !1,
			this._timeoutMap = {},
			this._listeners = []
		}
		function l(a, b) {
			b = b || {},
			f(b),
			this._isStepping = !1,
			this._send = b.send || this._send,
			this._cancel = b.cancel || this._cancel,
			k.call(this, a, b)
		}
		"use strict";
		var d = b("./set/ArraySet"),
		e = b("./state-kinds-enum"),
		f = b("./setup-default-opts"),
		g = b("./scxml-dynamic-name-match-transition-selector"),
		h = b("../../platform"),
		j = !1;
		k.prototype = {
			start: function () {
				j && h.platform.log("performing initial big step"),
				this._configuration.add(this.model.root.initial);
				var a = this.opts.require || c.parent && c.parent.parent && c.parent.parent.require && c.parent.parent.require.bind(c.parent.parent) || b.main && b.main.require && b.main.require.bind(b.main) || b,
				d = this.model.actionFactory(this.opts.log, this._cancel.bind(this), this._send.bind(this), this.opts.origin, this.isIn.bind(this), a, h.platform.parseDocumentFromString, this._sessionid);
				return this._actions = d.actions,
				this._datamodel = d.datamodel,
				this._performBigStep(),
				this.getConfiguration()
			},
			_getOrSetData: function (a, b, c) {
				var d = this._datamodel[b];
				if (!d)
					throw new Error("Variable " + b + " not declared in datamodel.");
				return d[a](c)
			},
			_getData: function (a) {
				return this._getOrSetData("get", a)
			},
			_setData: function (a, b) {
				return this._getOrSetData("set", a, b)
			},
			getConfiguration: function () {
				return this._configuration.iter().map(function (a) {
					return a.id
				})
			},
			getFullConfiguration: function () {
				return this._configuration.iter().map(function (a) {
					return [a].concat(this.opts.model.getAncestors(a))
				}, this).reduce(function (a, b) {
					return a.concat(b)
				}, []).map(function (a) {
					return a.id
				}).reduce(function (a, b) {
					return a.indexOf(b) > -1 ? a : a.concat(b)
				}, [])
			},
			isIn: function (a) {
				return this.getFullConfiguration().indexOf(a) > -1
			},
			isFinal: function (a) {
				return this._isInFinalState
			},
			_performBigStep: function (a) {
				a && this._innerEventQueue.push(new this.opts.EventSet([a]));
				var b = !0;
				while (b) {
					var c = this._innerEventQueue.length ? this._innerEventQueue.shift() : new this.opts.EventSet,
					d = {},
					f = this._performSmallStep(c, d);
					b = !f.isEmpty()
				}
				this._isInFinalState = this._configuration.iter().every(function (a) {
						return a.kind === e.FINAL
					})
			},
			_performSmallStep: function (a, b) {
				j && h.platform.log("selecting transitions with eventSet: ", a);
				var c = this._selectTransitions(a, b);
				j && h.platform.log("selected transitions: ", c);
				if (!c.isEmpty()) {
					j && h.platform.log("sorted transitions: ", console.log(c));
					var d = new this.opts.TransitionSet(c.iter().filter(function (a) {
								return a.targets
							})),
					f = this._getStatesExited(d),
					g = f[0],
					i = f[1],
					k = this._getStatesEntered(d),
					l = k[0],
					m = k[1];
					j && h.platform.log("basicStatesExited ", g),
					j && h.platform.log("basicStatesEntered ", l),
					j && h.platform.log("statesExited ", i),
					j && h.platform.log("statesEntered ", m);
					var n = new this.opts.EventSet;
					j && h.platform.log("executing state exit actions"),
					i.forEach(function (c) {
						(j || this.opts.logStatesEnteredAndExited) && h.platform.log("exiting ", c.id),
						this._listeners.forEach(function (a) {
							a.onExit && a.onExit(c.id)
						}),
						c.onexit !== undefined && this._evaluateAction(c.onexit, a, b, n);
						var d;
						c.history && (c.history.isDeep ? d = function (a) {
							return a.kind === e.BASIC && c.descendants.indexOf(a) > -1
						}
							 : d = function (a) {
							return a.parent === c
						}, this._historyValue[c.history.id] = i.filter(d))
					}, this);
					var o = c.iter().sort(function (a, b) {
							return a.documentOrder - b.documentOrder
						});
					j && h.platform.log("executing transitition actions"),
					o.forEach(function (c) {
						var d = c.targets && c.targets.map(function (a) {
								return a.id
							});
						this._listeners.forEach(function (a) {
							a.onTransition && a.onTransition(c.source.id, d)
						}),
						c.actions !== undefined && this._evaluateAction(c.actions, a, b, n)
					}, this),
					j && h.platform.log("executing state enter actions"),
					m.forEach(function (c) {
						(j || this.opts.logStatesEnteredAndExited) && h.platform.log("entering", c.id),
						this._listeners.forEach(function (a) {
							a.onEntry && a.onEntry(c.id)
						}),
						c.onentry !== undefined && this._evaluateAction(c.onentry, a, b, n)
					}, this),
					j && h.platform.log("updating configuration "),
					j && h.platform.log("old configuration ", this._configuration),
					this._configuration.difference(g),
					this._configuration.union(l),
					j && h.platform.log("new configuration ", this._configuration),
					n.isEmpty() || (j && h.platform.log("adding triggered events to inner queue ", n), this._innerEventQueue.push(n)),
					j && h.platform.log("updating datamodel for next small step :");
					for (var p in b)
						this._setData(p, b[p])
				}
				return c
			},
			_evaluateAction: function (a, b, c, d) {
				if (this.opts.retrace)
					return;
				function e(a) {
					d.add(a)
				}
				var f = this._getScriptingInterface(c, b, !0);
				return this._actions[a].call(this.opts.evaluationContext, f.getData, f.setData, f.events, e)
			},
			_getScriptingInterface: function (a, b, c) {
				return {
					setData: c ? function (b, c) {
						return a[b] = c
					}
					 : function () {},
					getData: this._getData.bind(this),
					events: b.iter()
				}
			},
			_getStatesExited: function (a) {
				var b = new this.opts.StateSet,
				c = new this.opts.BasicStateSet;
				a.iter().forEach(function (a) {
					var d = a.scope,
					e = d.descendants;
					this._configuration.iter().forEach(function (a) {
						e.indexOf(a) > -1 && (c.add(a), b.add(a), this.opts.model.getAncestors(a, d).forEach(function (a) {
								b.add(a)
							}))
					}, this)
				}, this);
				var d = b.iter().sort(function (a, b) {
						return b.depth - a.depth
					});
				return [c, d]
			},
			_getStatesEntered: function (a) {
				var b = {
					statesToEnter: new this.opts.StateSet,
					basicStatesToEnter: new this.opts.BasicStateSet,
					statesProcessed: new this.opts.StateSet,
					statesToProcess: []
				};
				a.iter().forEach(function (a) {
					a.targets.forEach(function (c) {
						this._addStateAndAncestors(c, a.scope, b)
					}, this)
				}, this);
				var c;
				while (c = b.statesToProcess.pop())
					this._addStateAndDescendants(c, b);
				var d = b.statesToEnter.iter().sort(function (a, b) {
						return a.depth - b.depth
					});
				return [b.basicStatesToEnter, d]
			},
			_addStateAndAncestors: function (a, b, c) {
				this._addStateAndDescendants(a, c),
				this.opts.model.getAncestors(a, b).forEach(function (a) {
					a.kind === e.COMPOSITE ? (c.statesToEnter.add(a), c.statesProcessed.add(a)) : this._addStateAndDescendants(a, c)
				}, this)
			},
			_addStateAndDescendants: function (a, b) {
				if (b.statesProcessed.contains(a))
					return;
				a.kind === e.HISTORY ? a.id in this._historyValue ? this._historyValue[a.id].forEach(function (c) {
					this._addStateAndAncestors(c, a.parent, b)
				}, this) : (b.statesToEnter.add(a), b.basicStatesToEnter.add(a)) : (b.statesToEnter.add(a), a.kind === e.PARALLEL ? b.statesToProcess.push.apply(b.statesToProcess, a.children.filter(function (a) {
							return a.kind !== e.HISTORY
						})) : a.kind === e.COMPOSITE ? b.statesToProcess.push(a.initial) : (a.kind === e.INITIAL || a.kind === e.BASIC || a.kind === e.FINAL) && b.basicStatesToEnter.add(a)),
				b.statesProcessed.add(a)
			},
			_selectTransitions: function (a, b) {
				if (this.opts.onlySelectFromBasicStates)
					var c = this._configuration.iter();
				else {
					var d = new this.opts.StateSet;
					this._configuration.iter().forEach(function (a) {
						d.add(a),
						this.opts.model.getAncestors(a).forEach(function (a) {
							d.add(a)
						})
					}, this),
					c = d.iter()
				}
				var e = this._getScriptingInterface(b, a),
				f = function (a) {
					return this._actions[a.conditionActionRef].call(this.opts.evaluationContext, e.getData, e.setData, e.events)
				}
				.bind(this),
				i = a.iter().map(function (a) {
						return a.name
					}),
				k = i.filter(function (a) {
						return a.search(".")
					}).length,
				l = k ? g : this.opts.transitionSelector,
				m = new this.opts.TransitionSet;
				c.forEach(function (a) {
					l(a, i, f).forEach(function (a) {
						m.add(a)
					})
				});
				var n = this._selectPriorityEnabledTransitions(m);
				return j && h.platform.log("priorityEnabledTransitions", n),
				n
			},
			_selectPriorityEnabledTransitions: function (a) {
				var b = new this.opts.TransitionSet,
				c = this._getInconsistentTransitions(a),
				d = c[0],
				e = c[1];
				b.union(d),
				j && h.platform.log("enabledTransitions", a),
				j && h.platform.log("consistentTransitions", d),
				j && h.platform.log("inconsistentTransitionsPairs", e),
				j && h.platform.log("priorityEnabledTransitions", b);
				while (!e.isEmpty())
					a = new this.opts.TransitionSet(e.iter().map(function (a) {
								return this.opts.priorityComparisonFn(a)
							}, this)), c = this._getInconsistentTransitions(a), d = c[0], e = c[1], b.union(d), j && h.platform.log("enabledTransitions", a), j && h.platform.log("consistentTransitions", d), j && h.platform.log("inconsistentTransitionsPairs", e), j && h.platform.log("priorityEnabledTransitions", b);
				return b
			},
			_getInconsistentTransitions: function (a) {
				var b = new this.opts.TransitionSet,
				c = new this.opts.TransitionPairSet,
				d = a.iter();
				j && h.platform.log("transitions", d);
				for (var e = 0; e < d.length; e++)
					for (var f = e + 1; f < d.length; f++) {
						var g = d[e],
						i = d[f];
						this._conflicts(g, i) && (b.add(g), b.add(i), c.add([g, i]))
					}
				var k = a.difference(b);
				return [k, c]
			},
			_conflicts: function (a, b) {
				return !this._isArenaOrthogonal(a, b)
			},
			_isArenaOrthogonal: function (a, b) {
				var c = this.opts.model.isOrthogonalTo(a.scope, b.scope);
				return j && (h.platform.log("transition scopes", a.scope.id, a.scope.id), h.platform.log("transition scopes are orthogonal?", c)),
				c
			},
			registerListener: function (a) {
				return this._listeners.push(a)
			},
			unregisterListener: function (a) {
				return this._listeners.splice(this._listeners.indexOf(a), 1)
			}
		},
		l.prototype = Object.create(k.prototype),
		l.prototype.gen = function (a, b) {
			var c;
			switch (typeof a) {
			case "string":
				c = {
					name: a,
					data: b
				};
				break;
			case "object":
				if (typeof a.name != "string")
					throw new Error('Event object must have "name" property of type string.');
				c = a;
				break;
			default:
				throw new Error("First argument to gen must be a string or object.")
			}
			if (this._isStepping)
				throw new Error("gen called before previous call to gen could complete. If executed in single-threaded environment, this means it was called recursively, which is illegal, as it would break SCION step semantics.");
			return this._isStepping = !0,
			this._performBigStep(c),
			this._isStepping = !1,
			this.getConfiguration()
		},
		l.prototype._send = function (a, b) {
			var c,
			d,
			e = this;
			if (!h.platform.setTimeout)
				throw new Error("setTimeout function not set");
			j && h.platform.log("sending event", a.name, "with content", a.data, "after delay", b.delay),
			c = function () {
				return e.gen(a)
			},
			d = h.platform.setTimeout(c, b.delay);
			if (b.sendid)
				return this._timeoutMap[b.sendid] = d
		},
		l.prototype._cancel = function (a) {
			if (!h.platform.clearTimeout)
				throw new Error("clearTimeout function not set");
			if (a in this._timeoutMap)
				return j && h.platform.log("cancelling ", a, " with timeout id ", this._timeoutMap[a]), h.platform.clearTimeout(this._timeoutMap[a])
		},
		c.exports = {
			SCXMLInterpreter: k,
			SimpleInterpreter: l
		}
	},
	"core/scxml/default-transition-selector": function (a, b, c) {
		"use strict",
		c.exports = function (a, b, c) {
			return a.transitions.filter(function (a) {
				return !a.event || b.indexOf(a.event) > -1 && (!a.cond || c(a))
			})
		}
	},
	"core/scxml/json2model": function (a, b, c) {
		function f(a) {
			function b(a, b) {
				return d.push(e.gen.util.wrapFunctionBodyInDeclaration(a, b)) - 1
			}
			function c(a) {
				return f[a]
			}
			var d = [],
			f = {};
			a.states.forEach(function (a) {
				f[a.id] = a
			}),
			a.transitions.forEach(function (a) {
				a.cond && (a.conditionActionRef = b(a.cond, !0))
			}),
			a.states.forEach(function (d) {
				d.transitions = d.transitions.map(function (b) {
						return a.transitions[b]
					});
				var e = [];
				d.onentry && (d.onentry = b(d.onentry)),
				d.onexit && (d.onexit = b(d.onexit)),
				d.transitions.forEach(function (a) {
					a.actions && (a.actions = b(a.actions)),
					a.lcca && (a.lcca = f[a.lcca]),
					a.scope = f[a.scope]
				}),
				d.initial = f[d.initial],
				d.history = f[d.history],
				d.children = d.children.map(c),
				d.parent = f[d.parent],
				d.ancestors && (d.ancestors = d.ancestors.map(c)),
				d.descendants && (d.descendants = d.descendants.map(c)),
				d.transitions.forEach(function (a) {
					a.source = f[a.source],
					a.targets = a.targets && a.targets.map(c)
				})
			}),
			a.root = f[a.root];
			var g = e.gen.util.makeActionFactory(a.scripts, d, a.datamodel);
			return g
		}
		function g(a, b) {
			var c = f(a);
			try {
				a.actionFactory = d.platform.eval(c, b)
			} catch (e) {
				throw d.platform.log("Failed to evaluate action factory."),
				d.platform.log("Generated js code to evaluate\n", c),
				e
			}
		}
		"use strict";
		var d = b("../../platform"),
		e = b("../util/code-gen");
		c.exports = function (a, b) {
			return g(a, b),
			a
		};
		if (b.main === c) {
			var h = process.argv[2],
			i = function (a, b) {
				if (a)
					throw a;
				process.stdout.write(f(JSON.parse(b)))
			};
			if (h === "-") {
				var j = "";
				process.stdin.resume(),
				process.stdin.on("data", function (a) {
					j += a
				}),
				process.stdin.on("end", function (a) {
					i(null, j)
				})
			} else {
				var k = b("fs");
				k.readFile(h, "utf8", i)
			}
		}
	},
	"core/scxml/model": function (a, b, c) {
		"use strict";
		var d = b("./state-kinds-enum"),
		e = {
			getAncestors: function (a, b) {
				var c,
				d,
				e;
				return d = a.ancestors.indexOf(b),
				d > -1 ? a.ancestors.slice(0, d) : a.ancestors
			},
			getAncestorsOrSelf: function (a, b) {
				return [a].concat(this.getAncestors(a, b))
			},
			getDescendantsOrSelf: function (a) {
				return [a].concat(a.descendants)
			},
			isOrthogonalTo: function (a, b) {
				return !this.isAncestrallyRelatedTo(a, b) && this.getLCA(a, b).kind === d.PARALLEL
			},
			isAncestrallyRelatedTo: function (a, b) {
				return this.getAncestorsOrSelf(b).indexOf(a) > -1 || this.getAncestorsOrSelf(a).indexOf(b) > -1
			},
			getLCA: function (a, b) {
				var c = this.getAncestors(a).filter(function (a) {
						return a.descendants.indexOf(b) > -1
					}, this);
				return c[0]
			}
		};
		c.exports = e
	},
	"core/scxml/scxml-dynamic-name-match-transition-selector": function (a, b, c) {
		function e(a) {
			return new RegExp("^" + a.replace(/\./g, "\\.") + "(\\.[0-9a-zA-Z]+)*$")
		}
		function f(a) {
			return d[a] ? d[a] : d[a] = e(a)
		}
		function g(a, b) {
			var c = a.events,
			d = c.indexOf("*") > -1 ? function () {
				return !0
			}
			 : function (a) {
				return c.filter(function (b) {
					return f(b).test(a)
				}).length
			};
			return b.filter(d).length
		}
		"use strict";
		var d = {};
		c.exports = function (a, b, c) {
			return a.transitions.filter(function (a) {
				return (!a.events || g(a, b)) && (!a.cond || c(a))
			})
		}
	},
	"core/scxml/set/ArraySet": function (a, b, c) {
		function d(a) {
			a = a || [],
			this.o = [],
			a.forEach(function (a) {
				this.add(a)
			}, this)
		}
		"use strict",
		d.prototype = {
			add: function (a) {
				if (!this.contains(a))
					return this.o.push(a)
			},
			remove: function (a) {
				var b = this.o.indexOf(a);
				return b === -1 ? !1 : (this.o.splice(b, 1), !0)
			},
			union: function (a) {
				return a = a.iter ? a.iter() : a,
				a.forEach(function (a) {
					this.add(a)
				}, this),
				this
			},
			difference: function (a) {
				return a = a.iter ? a.iter() : a,
				a.forEach(function (a) {
					this.remove(a)
				}, this),
				this
			},
			contains: function (a) {
				return this.o.indexOf(a) > -1
			},
			iter: function () {
				return this.o
			},
			isEmpty: function () {
				return !this.o.length
			},
			equals: function (a) {
				var b = a.iter(),
				c = this.o;
				return c.every(function (a) {
					return b.indexOf(a) > -1
				}) && b.every(function (a) {
					return c.indexOf(a) > -1
				})
			},
			toString: function () {
				return "Set(" + this.o.toString() + ")"
			}
		},
		c.exports = d
	},
	"core/scxml/setup-default-opts": function (a, b, c) {
		"use strict";
		var d = b("./scxml-dynamic-name-match-transition-selector"),
		e = b("./set/ArraySet"),
		f = b("./model");
		c.exports = function (a) {
			return a = a || {},
			a.TransitionSet = a.TransitionSet || e,
			a.StateSet = a.StateSet || e,
			a.BasicStateSet = a.BasicStateSet || e,
			a.transitionSelector = a.transitionSelector || d,
			a.model = a.model || f,
			a
		}
	},
	"core/scxml/state-kinds-enum": function (a, b, c) {
		"use strict",
		c.exports = {
			BASIC: 0,
			COMPOSITE: 1,
			PARALLEL: 2,
			HISTORY: 3,
			INITIAL: 4,
			FINAL: 5
		}
	},
	"core/util/annotate-scxml-json": function (a, b, c) {
		function t(a) {
			return f.platform.dom.getChildren(a).filter(function (a) {
				return f.platform.dom.localName(a) === "script"
			}).map(function (a) {
				return f.platform.dom.textContent(a)
			})
		}
		function u(a) {
			var b,
			c,
			d;
			c = 0,
			d = {};
			for (b in a)
				d[b] = {
					name: b,
					documentOrder: c++
				};
			return d
		}
		function w(a, b) {
			if (f.platform.dom.hasAttribute(a, "event")) {
				var c,
				e = f.platform.dom.getAttribute(a, "event");
				e === "*" ? c = [e] : c = e.trim().split(/\s+/).map(function (a) {
						var b = a.match(v);
						if (b) {
							var c = b[1];
							if (!b || !c)
								throw new Error("Unable to parse event: " + a);
							return c
						}
					}),
				c.filter(function (a) {
					return a !== "*"
				}).forEach(function (a) {
					l[a] = !0
				});
				if (c.indexOf(undefined) > -1)
					throw new Error("Error parsing event attribute attributes.event")
			}
			var g = {
				internal: f.platform.dom.getAttribute(a, "type") === "internal",
				documentOrder: m.length,
				id: m.length,
				source: b.id,
				cond: f.platform.dom.getAttribute(a, "cond"),
				events: c,
				targets: f.platform.dom.hasAttribute(a, "target") ? f.platform.dom.getAttribute(a, "target").trim().split(/\s+/) : null
			};
			return f.platform.dom.getElementChildren(a).length && (g.actions = d.gen.parentToFnBody(a)),
			m.push(g),
			g
		}
		function x(a, b) {
			f.platform.dom.getChildren(a).filter(function (a) {
				return f.platform.dom.localName(a) === "data"
			}).forEach(function (a) {
				if (f.platform.dom.hasAttribute(a, "id")) {
					var b,
					c = f.platform.dom.getAttribute(a, "id");
					if (f.platform.dom.hasAttribute(a, "expr"))
						b = {
							content: f.platform.dom.getAttribute(a, "expr"),
							type: "expr"
						};
					else {
						var d = f.platform.dom.hasAttribute(a, "type");
						if (d) {
							var e = f.platform.dom.getAttribute(a, "type"),
							g = e === "xml" ? f.platform.dom.serializeToString(a) : f.platform.dom.textContent(a);
							b = {
								content: g,
								type: e
							}
						} else
							g = f.platform.dom.textContent(a), b = g.length ? {
								content: g,
								type: "text"
							}
						 : null
					}
					p[c] = b
				}
			})
		}
		function y(a, b) {
			var c = f.platform.dom.hasAttribute(a, "id") ? f.platform.dom.getAttribute(a, "id") : B(f.platform.dom.localName(a)),
			l;
			switch (f.platform.dom.localName(a)) {
			case "state":
				f.platform.dom.getChildren(a).filter(function (a) {
					return i.indexOf(f.platform.dom.localName(a)) > -1
				}).length ? l = g.COMPOSITE : l = g.BASIC;
				break;
			case "scxml":
				l = g.COMPOSITE;
				break;
			case "initial":
				l = g.INITIAL;
				break;
			case "parallel":
				l = g.PARALLEL;
				break;
			case "final":
				l = g.FINAL;
				break;
			case "history":
				l = g.HISTORY;
				break;
			default:
			}
			var m = {
				id: c,
				kind: l,
				descendants: []
			};
			n[c] = m,
			b.length && (m.parent = b[b.length - 1]),
			l === g.HISTORY && (m.isDeep = f.platform.dom.getAttribute(a, "type") === "deep" ? !0 : !1),
			m.documentOrder = j.length,
			j.push(m);
			if (l === g.BASIC || l === g.INITIAL || l === g.HISTORY)
				m.basicDocumentOrder = k.length, k.push(m);
			m.depth = b.length,
			m.ancestors = b.slice(),
			b.forEach(function (a) {
				n[a].descendants.push(m.id)
			});
			var o,
			p,
			r = [],
			s = [],
			t = b.concat(m.id),
			u = !1,
			v = null,
			z = function (a) {
				var b = y(a, t);
				return m.initial = b.id,
				s.push(b),
				u = !0
			};
			f.platform.dom.getElementChildren(a).forEach(function (a) {
				switch (f.platform.dom.localName(a)) {
				case "transition":
					r.push(w(a, m));
					break;
				case "onentry":
					p = d.gen.parentToFnBody(a);
					break;
				case "onexit":
					o = d.gen.parentToFnBody(a);
					break;
				case "initial":
					if (!!u)
						throw new Error("Encountered duplicate initial states in state " + m.id);
					z(a);
					break;
				case "history":
					var b = y(a, t);
					m.history = b.id,
					s.push(b);
					break;
				case "datamodel":
					x(a, t);
					break;
				default:
					if (h.indexOf(f.platform.dom.localName(a)) > -1) {
						var c = y(a, t);
						v === null && (v = c),
						s.push(c)
					}
				}
			});
			if (!u && f.platform.dom.localName(a) !== "parallel") {
				var A = f.platform.dom.hasAttribute(a, "initial"),
				C = function (a) {
					var b = f.platform.dom.createElementNS(q, e.SCXML_NS, "initial"),
					c = f.platform.dom.createElementNS(q, e.SCXML_NS, "transition");
					return f.platform.dom.setAttribute(c, "target", a),
					f.platform.dom.appendChild(b, c),
					z(b)
				};
				A ? C(f.platform.dom.getAttribute(a, "initial")) : v && C(v.id)
			}
			return m.onexit = o,
			m.onentry = p,
			m.transitions = r.map(function (a) {
					return a.documentOrder
				}),
			m.children = s.map(function (a) {
					return a.id
				}),
			m
		}
		function B(a) {
			return A[a] = A[a] || 0,
			"" + z + "-" + a + "-" + A[a]++
		}
		function C(a, b) {
			var c,
			d,
			e;
			e = [],
			a.ancestors.forEach(function (a) {
				d = n[a],
				d.kind === g.COMPOSITE && d.descendants.indexOf(b.id) > -1 && e.push(a)
			});
			if (!e.length)
				throw new Error("Could not find LCCA for states.");
			return e[0]
		}
		function D(a) {
			var b = n[a.source],
			c = a.internal && b.parent && a.targets && a.targets.map(function (a) {
					return n[a]
				}).every(function (a) {
					return b.descendants.map(function (a) {
						return n[a]
					}).indexOf(a) > -1
				});
			return a.targets ? c ? a.source : a.lcca : a.source
		}
		"use strict";
		var d = b("./code-gen"),
		e = b("../constants"),
		f = b("../../platform"),
		g = b("../scxml/state-kinds-enum"),
		h = ["state", "parallel", "history", "final", "initial"],
		i = h.concat("scxml"),
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r = a.transformAndSerialize = r = function (a) {
			return JSON.stringify(s(a))
		},
		s = a.transform = function (a) {
			q = a;
			var b = q.documentElement;
			j = [],
			k = [],
			l = {},
			m = [],
			n = {},
			o = [],
			p = {};
			var c = y(b, []);
			return j.forEach(function (a) {
				a.ancestors.reverse()
			}),
			j.forEach(function (a) {
				a.descendants.reverse()
			}),
			m.filter(function (a) {
				return a.targets
			}).forEach(function (a) {
				var b = n[a.source],
				c = a.targets.map(function (a) {
						var b = n[a];
						if (!b)
							throw new Error("Transition targets state id '" + a + "' but state does not exist.");
						return b
					});
				a.lcca = C(b, c[0])
			}),
			m.forEach(function (a) {
				a.scope = D(a)
			}), {
				states: j,
				transitions: m,
				root: c.id,
				events: u(l),
				scripts: t(b),
				profile: f.platform.dom.getAttribute(b, "profile"),
				version: f.platform.dom.getAttribute(b, "version"),
				datamodel: p
			}
		},
		v = /^((([^.]+)\.)*([^.]+))(\.\*)?$/,
		z = "$generated",
		A = {};
		b.main === c && console.log(JSON.stringify(s((new(b("xmldom").DOMParser)).parseFromString(b("fs").readFileSync(process.argv[2], "utf8"))), 4, 4))
	},
	"core/util/code-gen": function (a, b, c) {
		function f(a) {
			return d.platform.dom.getElementChildren(a).map(g).join("\n;;\n")
		}
		function g(a) {
			var b = h[d.platform.dom.namespaceURI(a)],
			c = b && b[d.platform.dom.localName(a)];
			if (!b || !c)
				throw new Error("Element " + d.platform.dom.namespaceURI(a) + ":" + d.platform.dom.localName(a) + " not yet supported");
			return c(a)
		}
		function i(a) {
			return a ? a.slice(-2) === "ms" ? parseFloat(a.slice(0, -2)) : a.slice(-1) === "s" ? parseFloat(a.slice(0, -1)) * 1e3 : parseFloat(a) : 0
		}
		function j(a, b) {
			var c = a;
			if (b) {
				c += " = ";
				switch (b.type) {
				case "xml":
					c += "$parseXml(" + JSON.stringify(b.content) + ")";
					break;
				case "json":
					c += "JSON.parse(" + JSON.stringify(b.content) + ")";
					break;
				case "expr":
					c += b.content;
					break;
				default:
					c += JSON.stringify(b.content)
				}
			}
			return c
		}
		function k(a) {
			var b = "var ",
			c = [];
			for (var d in a) {
				var e = a[d];
				c.push(j(d, e))
			}
			return c.length ? b + c.join(", ") + ";" : ""
		}
		function l(a) {
			var b = [];
			for (var c in a)
				b.push('"' + c + '" : {\n' + '"set" : function(v){ return ' + c + " = v; },\n" + '"get" : function(){ return ' + c + ";}" + "\n}");
			return "{\n" + b.join(",\n") + "\n}"
		}
		function m(a, b) {
			return "function(getData,setData,_events,$raise){var _event = _events[0];\n" + (b ? "return" : "") + " " + a + "\n}"
		}
		function n(a, b, c, d) {
			return a + (b.length ? b.join("\n") : "") + "var $datamodel = " + c + ";\n" + "return {\n" + "datamodel:$datamodel,\n" + "actions:[\n" + d.join(",\n") + "\n]" + "\n};"
		}
		function o(a) {
			return "function($log,$cancel,$send,$origin,In,require,$parseXml,_sessionid,_ioprocessors,_x){\n" + a + "\n}"
		}
		function p(a, b, c) {
			var d = k(c),
			e = l(c),
			f = i.toString() + "\n" + n(d, a, e, b),
			g = o(f);
			return g
		}
		function q(a) {
			var b = d.platform.dom.hasAttribute(a, "namelist") ? d.platform.dom.getAttribute(a, "namelist").trim().split(/ +/) : null,
			c = d.platform.dom.getChildren(a).filter(function (a) {
					return d.platform.dom.localName(a) === "param"
				}),
			e = d.platform.dom.getChildren(a).filter(function (a) {
					return d.platform.dom.localName(a) === "content"
				});
			if (e.length)
				return e = e[0], d.platform.dom.getAttribute(e, "type") === "application/json" ? d.platform.dom.textContent(e) : JSON.stringify(d.platform.dom.textContent(e));
			if (d.platform.dom.hasAttribute(a, "contentexpr"))
				return d.platform.dom.getAttribute(a, "contentexpr");
			var f = "{";
			return b && b.forEach(function (a) {
				f += '"' + a + '"' + ":" + a + ",\n"
			}),
			c.length && c.map(function (a) {
				return r(a)
			}).forEach(function (a) {
				a.expr ? f += '"' + a.name + '"' + ":" + a.expr + ",\n" : a.location && (f += '"' + a.name + '"' + ":" + a.location + ",\n")
			}),
			f += "}",
			f
		}
		function r(a) {
			return {
				name: d.platform.dom.getAttribute(a, "name"),
				expr: d.platform.dom.getAttribute(a, "expr"),
				location: d.platform.dom.getAttribute(a, "location")
			}
		}
		"use strict";
		var d = b("../../platform"),
		e = b("../constants"),
		h = {
			"": {
				script: function (a) {
					return d.platform.dom.textContent(a)
				},
				assign: function (a) {
					return d.platform.dom.getAttribute(a, "location") + " = " + d.platform.dom.getAttribute(a, "expr") + ";"
				},
				if : function (a) {
					var b = "";
					b += "if(" + d.platform.dom.getAttribute(a, "cond") + "){\n";
					var c = d.platform.dom.getElementChildren(a);
					for (var e = 0; e < c.length; e++) {
						var f = c[e];
						if (d.platform.dom.localName(f) === "elseif" || d.platform.dom.localName(f) === "else")
							break;
						b += g(f) + "\n;;\n"
					}
					for (; e < c.length; e++) {
						f = c[e];
						if (d.platform.dom.localName(f) === "elseif")
							b += "}else if(" + d.platform.dom.getAttribute(f, "cond")
								 + "){\n";
							else {
								if (d.platform.dom.localName(f) === "else") {
									b += "}";
									break
								}
								b += g(f) + "\n;;\n"
							}
						}
						for (; e < c.length; e++)
							f = c[e], d.platform.dom.localName(f) === "else" ? b += "else{\n" : b += g(f) + "\n;;\n";
						return b += "}",
						b
					},
				elseif: function () {
					throw new Error("Encountered unexpected elseif tag.")
				},
				else : function () {
						throw new Error("Encountered unexpected else tag.")
					},
				log: function (a) {
					var b = [];
					return d.platform.dom.hasAttribute(a, "label") && b.push(JSON.stringify(d.platform.dom.getAttribute(a, "label"))),
					d.platform.dom.hasAttribute(a, "expr") && b.push(d.platform.dom.getAttribute(a, "expr")),
					"$log(" + b.join(",") + ");"
				},
				raise: function (a) {
					return "$raise({ name:" + JSON.stringify(d.platform.dom.getAttribute(a, "event")) + ", data : {}});"
				},
				cancel: function (a) {
					return "$cancel(" + JSON.stringify(d.platform.dom.getAttribute(a, "sendid")) + ");"
				},
				send: function (a) {
					var b = d.platform.dom.hasAttribute(a, "targetexpr") ? d.platform.dom.getAttribute(a, "targetexpr") : JSON.stringify(d.platform.dom.getAttribute(a, "target")),
					c = "_scionTargetRef",
					e = "var " + c + " = " + b + ";\n",
					f = "{\ntarget: " + c + ",\n" + "name: " + (d.platform.dom.hasAttribute(a, "eventexpr") ? d.platform.dom.getAttribute(a, "eventexpr") : JSON.stringify(d.platform.dom.getAttribute(a, "event"))) + ",\n" + "type: " + (d.platform.dom.hasAttribute(a, "typeexpr") ? d.platform.dom.getAttribute(a, "typeexpr") : JSON.stringify(d.platform.dom.getAttribute(a, "type"))) + ",\n" + "data: " + q(a) + ",\n" + "origin: $origin\n" + "}",
					g = e + "if(" + c + " === '#_internal'){\n" + "$raise(" + f + ");\n" + "}else{\n" + "$send(" + f + ", {\n" + "delay: " + (d.platform.dom.hasAttribute(a, "delayexpr") ? "getDelayInMs(" + d.platform.dom.getAttribute(a, "delayexpr") + ")" : i(d.platform.dom.getAttribute(a, "delay"))) + ",\n" + "sendId: " + (d.platform.dom.hasAttribute(a, "idlocation") ? d.platform.dom.getAttribute(a, "idlocation") : JSON.stringify(d.platform.dom.getAttribute(a, "id"))) + "\n" + "}, $raise);" + "}";
					return g
				},
				foreach: function (a) {
					var b = d.platform.dom.hasAttribute(a, "index"),
					c = d.platform.dom.getAttribute(a, "index") || "$i",
					e = d.platform.dom.getAttribute(a, "item"),
					f = d.platform.dom.getAttribute(a, "array"),
					h = d.platform.dom.getElementChildren(a).map(g).join("\n;;\n");
					return "(function(){\nif(Array.isArray(" + f + ")){\n" + f + ".forEach(function(" + e + "," + c + "){\n" + h + "\n});\n" + "}else{\n" + "Object.keys(" + f + ").forEach(function(" + c + "){\n" + e + " = " + f + "[" + c + "];\n" + h + "\n});\n" + "}\n" + "})();"
				}
			}
		};
		h[e.SCXML_NS] = h[""],
		c.exports = {
			gen: {
				parentToFnBody: f,
				actionTagToFnBody: g,
				actionTags: h,
				util: {
					makeDatamodelDeclaration: k,
					makeDatamodelClosures: l,
					wrapFunctionBodyInDeclaration: m,
					makeTopLevelFunctionBody: n,
					wrapTopLevelFunctionBodyInDeclaration: o,
					makeActionFactory: p
				}
			}
		}
	},
	"core/util/docToModel": function (a, b, c) {
		function g(a, b, c, d) {
			f.platform.getResourceFromUrl ? j(a, b, d, function (d) {
				d ? c(d.length === 1 ? d[0].err : new Error("Script download errors : \n" + d.map(function (a) {
							return a.url + ": " + a.err.message
						}).join("\n"))) : h(a, b, c)
			}) : h(a, b, c)
		}
		function h(a, b, c) {
			try {
				var f = d.transform(b),
				g = e(f, a);
				c(null, g)
			} catch (h) {
				c(h)
			}
		}
		function i(a, b) {
			var c;
			if (f.platform.url.resolve)
				c = f.platform.url.resolve(a, b);
			else {
				var d = f.platform.url.getPathFromUrl(a),
				e = f.platform.path.dirname(d),
				g = f.platform.path.join(e, b);
				c = f.platform.url.changeUrlPath(a, g)
			}
			return c
		}
		function j(a, b, c, d) {
			var e = [],
			g = [],
			h = 0;
			k(b.documentElement, e),
			e.length ? e.forEach(function (b, j) {
				var k = f.platform.dom.getAttribute(b, "src");
				a && (k = i(a, k)),
				f.platform.getResourceFromUrl(k, function (a, c, i) {
					a ? (f.platform.log("Error downloading document " + k + " : " + a.message), g.push({
							url: k,
							err: a
						})) : f.platform.dom.textContent(b, c),
					++h,
					h == e.length && d(g.length ? g : null)
				}, c)
			}) : d()
		}
		function k(a, b) {
			(f.platform.dom.localName(a) === "script" || f.platform.dom.localName(a) === "data") && f.platform.dom.hasAttribute(a, "src") && b.push(a),
			f.platform.dom.getElementChildren(a).forEach(function (a) {
				k(a, b)
			})
		}
		"use strict";
		var d = b("./annotate-scxml-json"),
		e = b("../scxml/json2model"),
		f = b("../../platform");
		c.exports = g
	},
	"core/util/util": function (a, b, c) {
		"use strict",
		c.exports = {
			merge: function (a) {
				for (var b = 1; b < arguments.length; b++) {
					var c = arguments[b];
					for (var d in c)
						c.hasOwnProperty(d) && (a[d] = c[d])
				}
				return a
			}
		}
	},
	platform: function (a, b, c) {
		function d() {
			return typeof Packages != "undefined"
		}
		function e() {
			return typeof process != "undefined" && typeof c != "undefined"
		}
		function f() {
			return typeof window != "undefined" && typeof document != "undefined"
		}
		"use strict";
		var g;
		f() ? c.exports = b("./browser/platform") : e() ? (global.window = global, c.exports = b("./browser/platform"))/*c.exports = b("./node/platform")*/ : d() && (c.exports = b("./rhino/platform"))
	},
	scion: function (a, b, c) {
		function g(a, b, c) {
			if (!d.platform.getDocumentFromUrl)
				throw new Error("Platform does not support getDocumentFromUrl");
			d.platform.getDocumentFromUrl(a, function (d, e) {
				d ? b(d, null) : f(a, e, b, c)
			}, c)
		}
		function h(a, b, c) {
			if (!d.platform.getDocumentFromFilesystem)
				throw new Error("Platform does not support getDocumentFromFilesystem");
			d.platform.getDocumentFromFilesystem(a, function (d, e) {
				d ? b(d, null) : f(a, e, b, c)
			}, c)
		}
		function i(a, b, c) {
			if (!d.platform.parseDocumentFromString)
				throw new Error("Platform does not support parseDocumentFromString");
			f(null, d.platform.parseDocumentFromString(a), b, c)
		}
		"use strict";
		var d = b("./platform"),
		e = b("./core/scxml/SCXML"),
		f = b("./core/util/docToModel"),
		j = c.exports = {
			pathToModel: h,
			urlToModel: g,
			documentStringToModel: i,
			documentToModel: f,
			SCXML: e.SimpleInterpreter,
			ext: {
				platformModule: d,
				actionCodeGeneratorModule: b("./core/util/code-gen")
			}
		}
	}
});
