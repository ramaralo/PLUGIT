/**
 * @namespace Main plugin responsable for all plugin management, including loading plugins.
 * @see PLUGIT.core-publicInterface
 * @type {PLUGIT.proto.Plugin}
 * @returns {Object} obj
 */
PLUGIT.core = (function() {

	/**
	 * @ignore
	 */
	function Core() {
		var myObj = this;
		this.id = "corePlugin";

		var arePluginsInitialized = false;
		var debugMode = false;
		var logs = [];

		var console = { // permite invocar localmente o console, sem que vá ao scope window.
				log: function() {
					logs.push(arguments);
				}
		};
		
		var logPluginExtPointInterface = new PLUGIT.interfaces.PluginConnectionInterface(this.id, "logPlugin");

		/**
		 * Defines a plugin interface. This is how a plugin sees CORE at the moment CORE calls start() on each plugin, passing pluginToCoreInterface as an argument.
		 * @public
		 */
		var pluginToCoreInterface = new PLUGIT.interfaces.CoreToPluginInterface();
		pluginToCoreInterface.stopObservingEvent = function(eventName, fn) {
			return stopObservingEvent(eventName, fn);
		};
		pluginToCoreInterface.observePluginEvent = function(paramObj) {
			return observePluginEvent(paramObj);
		};


		/**
		 *
		 * @param paramObj
		 * @param paramObj.pluginId
		 * @param paramObj.eventName
		 * @param paramObj.callBack
		 * @returns {Boolean}
		 */
		function stopObservingPluginEvent(paramObj) {
			var removed = true;

			if(paramObj.pluginId === this.id) { // check to see if the plugin id refers to this one
				removed = this.stopObservingEvent(paramObj.eventName, paramObj.callback);
			}
			else {
				try {
					removed = getPluginById(paramObj.pluginId).stopObservingEvent(paramObj.eventName, paramObj.callBack);
				} catch (e) {
					removed = -1;
				}
			}

			return removed;
		}

		function validatePluginToLoad(pluginInstance) {
			if (pluginInstance instanceof PLUGIT.proto.Plugin) {
				if (pluginInstance.id !== null && pluginInstance !== undefined) {
					if(pluginInstance.id === "any") {
						throw new TypeError("ERROR: Core.loadPlugin(). Trying to load plugin with forbiden id name: " + pluginInstance.id + ". Change the plugin id.");
					}
					if (pluginMap[pluginInstance.id] !== undefined || myObj.id === pluginInstance.id) {
						throw new TypeError("ERROR: Core.loadPlugin(). Trying to load plugin with an id that allready exists on another plugin. Duplicated id: "
							+ pluginInstance.id);
					}
				} else {
					throw new TypeError("ERROR: Core.loadPlugin(). Trying to load a plugin with no id defined. Make sure all plugins have an id overriding the default value.");
				}
			} else {
				throw new TypeError("ERROR: Core loading an object that is not an instance if PrototypePlugin. Only instances of this Class can be loaded into core.");
			}
		}

		/**
		 *
		 * @param paramObj
		 * @param paramObj.pluginId
		 * @param paramObj.eventName
		 * @param paramObj.callBack
		 * @returns {Boolean|Number}
		 */
		function observePluginEvent(paramObj) {
			var added = true;

			if(paramObj.pluginId === "any") {
				for ( var key in pluginMap) {
					if(pluginMap[key].hasEvent(paramObj.eventName)) {
						added = pluginMap[key].observeEvent(paramObj.eventName, paramObj.callBack);
					}
				}
			}
			else {
				try {
					added = getPluginById(paramObj.pluginId).observeEvent(paramObj.eventName, paramObj.callBack);
				} catch (e) {
					added = -1;
				}
			}


			return added;
		};

		/**
		 * Gets a plugin with the specified id
		 *
		 * @param pluginId
		 * @returns
		 * @throws {@link Error}
		 *             if no plugin exists with the required id.
		 */
		function getPluginById(pluginId) {
			if (pluginMap[pluginId] !== undefined) {
				return pluginMap[pluginId];
			} else {
				throw Error("Core.getPluginById(). Trying to get a plugin with id "
						+ pluginId + " but no such plugin exists.");
			}
		}


		function createLayout() {
			mapContainer = $("<div id=\"PLUGITMapContainer\" style=\"width: 80%; bottom: 0px; top: 0px; position: absolute; float: left;\" />");
			groupManagerContainer = $("<div id=\"PLUGITGroupManagerContainer\" style=\"bottom: 0px; top: 0px; right: 0px; width: 20%; position: absolute;\" />");

			$("#PLUGITLayout").append(mapContainer);
			$("#PLUGITLayout").append(groupManagerContainer);
		}

		/**
		 * @ignore
		 */
		this.start = function() {
			if (arePluginsInitialized === false) {
				console.log("RESUME FASE - CORE STARTING TO CALL START() ON EACH PLUGIN...");

				arePluginsInitialized = true;

				for ( var pluginKey in pluginMap) {
					pluginMap[pluginKey].start(pluginToCoreInterface);
				}
			} else {
				throw new Error("Core trying to initialize plugins, but Core allready initialized plugins.");
			}
		};

		/**
		 * @ignore
		 */
		this.plugExtentions = function() {
				console.log("RESUME FASE - CORE STARTING TO ADD EXTENTIONS...");

				for ( var pluginKey in pluginMap) {
					var connections = pluginMap[pluginKey].getConnections(); // [{pluginId: String, extentionPoint: String}, ...]

					var arrayLength = connections.length;
					for ( var i = 0; i < arrayLength; i++) {
						var pluginToExtend = connections[i]; // {pluginId: String, extentionPoint: String}

						if(this.id === pluginToExtend.pluginId) {
							this.addExtention({
								plugin: pluginMap[pluginKey],
								extentionPoint: pluginToExtend.extentionPoint
								});

							console.log("Pluging plugin ", pluginMap[pluginKey], " to plugin ", pluginToExtend.pluginId);
						}
						else if(pluginMap[pluginToExtend.pluginId] !== undefined){
							pluginMap[pluginToExtend.pluginId].addExtention({
								plugin: pluginMap[pluginKey],
								extentionPoint: pluginToExtend.extentionPoint
								});


							console.log("Pluging plugin ", pluginMap[pluginKey], " to plugin ", pluginToExtend.pluginId);
						}
						else {
							throw new TypeError("Core.plugExtentions(). Trying to connect plugin with id: " + pluginKey + " to plugin with id: " + pluginToExtend.pluginId + " but there is no such plugin id: " + pluginToExtend.pluginId + ". " +
									"Problem may be in plugin with id: " + pluginKey + " that is defined to connect to plugin " + pluginToExtend.pluginId);
						}
					}
				}
		};

		/**
		 * @ignore
		 */
		this.callConnectOnPlugins = function() {
			console.log("CALLING CALLCONNECTONEXTENTIONPOINTS() ON ", this);
			this.callConnectOnExtentionPoints();

			console.log("RESUME FASE - CORE STARTING TO CALL callConnectOnExtentionPoints() ON EACH PLUGIN...");

			for ( var pluginKey in pluginMap) {
				console.log("calling callConnectOnExtentionPoints() on ", pluginMap[pluginKey]);
				pluginMap[pluginKey].callConnectOnExtentionPoints();
			}
		};

		/**
		 * Defines data from configuration
		 * @ignore
		 * @param {Object} obj
		 */
		this.defineData = function(obj) {
			//TODO: finish implementation
			debugMode = (obj.debugMode !== undefined) ? obj.debugMode : false;
		};

		/**
		 * @ignore
		 */
		this.loadPlugin = function(pluginInstance) {
			console.log("LOAD FASE - CORE STARTING TO LOAD PLUGIN...");

			validatePluginToLoad(pluginInstance);

			console.log("Core trying to load plugin ", pluginInstance);
			pluginMap[pluginInstance.id] = pluginInstance;

			console.log("Core loaded plugin: ", pluginInstance);
		};

		this.reset = function() {
			if(debugMode) {
				arePluginsInitialized = false;
				mapContainer = null;
				groupManagerContainer = null;
				pluginMap = {};
				for ( var key in pluginMap) {
					delete pluginMap[key];
				};
			};
		};

		/**
		 * Faz o window.console.log de todos os logs criados localmente
		 */
		this.dumpLogs = function() {
			var arrayLength = logs.length;
			for ( var l = 0; l < arrayLength; l++) {
				window.console.log(logs[l]);
			};
		};

		/**
		 * Define compile fase. Iterates over the loaded plugins, checks for
		 * dependence plugins, and delivers references to all dependencies to
		 * each plugin.
		 * @ignore
		 */
		this.compilePlugins = function() {
			if (arePluginsInitialized === false) {
				console.log("RESUME FASE - CORE STARTING PLUGIN COMPILER...");

				for ( var pluginKey in pluginMap) {
					console.log("Compiling  plugin " + pluginKey + "...");

					// evaluate if core depends on this plugin
					if ($.inArray(pluginKey, this.getDependencePlugins()) > -1) {
						this.setDependencePlugins([getPluginById(pluginKey)]);
					}

					var pluginDependence = pluginMap[pluginKey].getDependencePlugins();

					console.log(pluginKey, " has the following dependencies: ", pluginDependence);
					if (pluginDependence.length > 0) {
						var plugins = []; // the plugins to deliver to pluginMap[pluginKey]

						var arrayLength = pluginDependence.length;
						for ( var i = 0; i < arrayLength; i++) {
							plugins.push(getPluginById(pluginDependence[i]));
						}

						console.log("Delivering dependence plugins...");

						pluginMap[pluginKey].setDependencePlugins(plugins);
					};
				};
			}
			else {
				throw Error("Core.compile(). Plugins have already been initialized.");
			}
		};

		/**
		 * Obtem uma listagem de todos os eventos declarados pelos plugins.
		 *
		 * @returns {Object} Mapa organizado pelos IDs dos plugins tendo em cada entrada um array de eventos declarados
		 */
		this.getPluginsEvents = function() {
			var eventsMap = {};

			for ( var key in pluginMap) {
				eventsMap[key] = pluginMap[key].listEvents();
			}

			return eventsMap;
		};

		/**
		 * Obtem uyma lista de todos os plugins carregados
		 *
		 * @returns {Array}
		 */
		this.listPlugins = function() {
			return Object.keys(pluginMap);
		};

		this.getPluginById = function(stringPlugin) {
			return getPluginById(stringPlugin);
		};

		this.getDefinedData = function() {
			var interfaceClone = jQuery.extend(true, {}, pluginToCoreInterface);

			return interfaceClone;
		};

		// constructor		
		this.defineExtentionPoint({single: true, name: "logManager", interfaceObj: logPluginExtPointInterface});
	}

	Core.prototype = new PLUGIT.proto.Plugin();

	var newCore = new Core();

	/**
	 * This is the public interface of PLUGIT.core.
	 *
	 * <p>
	 * Don't use it as PLUGIT.core.plublicInterface.<br />
	 * Use this methods as methods of PLUGIT.core.
	 * </p>
	 *
	 * @class
	 *
	 */
	var publicInterface = {
			/**
			 * Defines data from configuration files as well as permitions from SCA.
			 * This method is called once index.jsp is loaded on the browser and its arguments are managed by PLUGIT, so there will be no need to call this manually.
			 * <p>This documentations exists only for information purpose</p>
			 *
			 * @param {Object} obj parameters object
			 * @param {String[]} obj.permitions Array of strings
			 * @param {Json} obj.i18n
			 * @param {Number[]} obj.startCenter
			 * @param {Number} obj.startzoom
			 */
			defineData : function(obj) {
				newCore.defineData(obj);
			},
			/**
			 * Loads a plugin into the plugin architecture.
			 * @param {Object} pluginInstance Object of type PLUGIT.proto.Plugin
			 */
			loadPlugin : function(pluginInstance) {
				newCore.loadPlugin(pluginInstance);
			},
			/**
			 * Call for resume fase
			 */
			resume : function() {
				newCore.start();
				newCore.plugExtentions();
				newCore.callConnectOnPlugins();
			},
			/**
			 * Convenience method for accessing extentions points
			 * @deprecated Will be droped in future verisons
			 * @returns {Object}
			 */
			getExtentionPoints: function() {
				return newCore.getExtentionPoints();
			},
			reset: function() {
				newCore.reset();
			},
			getPluginsEvents: function() {
				return newCore.getPluginsEvents();
			},
			/**
			 * Returns a list of loaded plugin IDs
			 * @returns {Array}
			 */
			listPlugins: function() {
				return newCore.listPlugins();
			},
			getPluginById: function(stringId) {
				return newCore.getPluginById(stringId);
			},
			getDefinedData: function() {
				return newCore.getDefinedData();
			},
			dumpLogs: function() {
				newCore.dumpLogs();
			}
		};

	return publicInterface;
})();