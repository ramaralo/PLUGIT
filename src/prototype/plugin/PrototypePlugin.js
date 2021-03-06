/**
 * Represents a plugin abstraction.
 *
 * @class
 * @augments Observable
 * @propertiy {String} id The plugin id
 * @constructor
 * @returns {PLUGIT.proto.Plugin}
 *
 */
PLUGIT.proto.Plugin = function() {
	// innerClass
	function ExtentionPoint() {
		this.single = true;
		this.extentionPlugins = [];
	}

	var extentionPoints = {};
	var extentionPointsInterfaces = {};
	var extentionPointsConnected = {};

	var connections = [];

	this.id = null;

	/**
	 * Defines an extention point
	 *
	 * @param {Object} paramObj
	 * @param {Boolean} paramObj.single
	 * @param {String} paramObj.name
	 * @param {String} paramObj.interfaceObj
	 */
	this.defineExtentionPoint = function(paramObj) {
		if(paramObj.single !== undefined && paramObj.name !== undefined && paramObj.interfaceObj !== undefined) {
			extentionPoints[paramObj.name] = (paramObj.single !== undefined && paramObj.single === false) ? [] : null;
			extentionPointsInterfaces[paramObj.name] = paramObj.interfaceObj;
			extentionPointsConnected[paramObj.name] = false;
		}
		else {
			throw TypeError("PLUGIT.proto.PrototypePlugin.defineExtentionPoint(). Invalid argument in plugin id: " + this.id + ". Argument doesn't match the rule: paramObj.single !== undefined && paramObj.name !== undefined && paramObj.interfaceObj !== undefined");
		}
	};

	/**
	 * Gets all extention points
	 * @returns {Object} Object as a map of extention points like this: {extentionPointKey: {@link {@link PLUGIT.proto.Plugin}}}. <br/>
	 * Where: <br/>
	 * - extentionPointKey is one of the names given when defineExtentionPoint() was called and its value can be: null or {@link {@link PLUGIT.proto.Plugin}} instance or array of {@link {@link PLUGIT.proto.Plugin}} instances.
	 */
	this.getExtentionPoints = function() {
		return extentionPoints;
	};

	this.getExtentionPointInterface = function(extentionPointName) {
		return extentionPointsInterfaces[extentionPointName];
	};

	/**
	 * // TODO: evaluate ig this method is really needed or if it exposes sensitive data
	 * Gets all plugins at a specific extention point.
	 *
	 *
	 * @param extentionPoint
	 * @returns {@link {@link PLUGIT.proto.Plugin}} if extentionPoint is single
	 * @returns [{@link {@link PLUGIT.proto.Plugin}}] if extentionPoint is not single
	 * @returns {Number} -1 if extentionPoint doesn't exist validated by method hasExtentionPoint
	 */
	this.getPluginsAtExtentionPoint = function(extentionPoint) {
		var plugins = (this.hasExtentionPoint(extentionPoint)) ? extentionPoints[extentionPoint] : -1;

		return plugins;
	};

	/**
	 * Validates if a given extention point exists in the plugin
	 *
	 * @param {String} name The extention point name
	 * @returns {Boolean}
	 */
	this.hasExtentionPoint = function(name) {
		return (extentionPoints[name] !== undefined) ? true : false;
	};

	/**
	 * Validates if a given extention point interface exists in the plugin
	 *
	 * @param name
	 * @returns
	 */
	this.hasExtentionPointInterface = function(name) {
		return (extentionPointsInterfaces[name] !== undefined) ? true : false;
	};

	/**
	 * Teels if this plugin has extention points or not.
	 *
	 * @returns {Boolean} True if it has extention points, false, if not.
	 */
	this.hasExtentionPoints = function() {
		var hasExtentionPoints = false;

		for ( var key in extentionPoints) {
			hasExtentionPoints = true;
			break;
		}

		return hasExtentionPoints;
	};

	function validateAddExtentionArguments(paramObj) {
		if (paramObj === undefined) {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). No argument found.");
		}
		if (!(paramObj instanceof Object)) {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). Argument is not an object.");
		}

		if (paramObj.extentionPoint === undefined) {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). Argument has no attribute named extentionPoint.");
		}
		if (typeof(paramObj.extentionPoint) != "string") {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). Typeof extentionPoint attribute is not string");
		}

		if (paramObj.plugin === undefined) {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). Argument attribute \"plugin\" is undefined");
		}
		if (!(paramObj.plugin instanceof PLUGIT.proto.Plugin)) {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). Argument attribute \"plugin\" is not an insatnceof PLUGIT.proto.Plugin");
		}

		if (!paramObj.plugin.hasConnection({extentionPoint: paramObj.extentionPoint, pluginId: this.id})) {
			throw new TypeError("PLUGIT.proto.Plugin.addExtention(). Trying to add a plugin with id: " + paramObj.plugin.id + " to extention point: " + paramObj.extentionPoint + " but plugin: " + paramObj.plugin.id + " has no connection defined for plugin: " + this.id);
		}
	}

	/**
	 * Adds a plugin to an extention point
	 * @param {Object} paramObj
	 * @param {String} paramObj.extentionPoint The name of the extention point
	 * @param {{@link {@link PLUGIT.proto.Plugin}}} paramObj.plugin  A referenece to the plugin
	 */
	this.addExtention = function(paramObj) {
		var added = false;

		validateAddExtentionArguments(paramObj);

		if(this.hasExtentionPoint(paramObj.extentionPoint)) {
			if(extentionPoints[paramObj.extentionPoint] instanceof Array) {
				extentionPoints[paramObj.extentionPoint].push(paramObj.plugin);
			}else {
				extentionPoints[paramObj.extentionPoint] = paramObj.plugin;
			}
			added = true;
		}

		return added;
	};

	/**
	 * Define the plugin(s) and respective extention point(s) that this plugin should extentd.
	 *
	 * @param paramObj
	 * @param paramObj.pluginId {String}
	 * @param paramObj.extentionPoint {String}
	 */
	this.connectsTo = function(paramObj) {
		if(paramObj.pluginId !== undefined && paramObj.extentionPoint !== undefined) {
			connections.push(paramObj);
		}
		else {
			throw new TypeError("PLUGIT.proto.PrototypePlugin.connectsTo(). Argument is not in the supported format. Error in plugin: " + this.id);
		}
	};

	/**
	 * Evaluates if the plugin has a connection defined for a specific plugin at a specific connection point
	 *
	 * @param {Object} connectionObj Object representing the connection
	 * @param {String} connectionObj.pluginId The id of the plugin to connect to
	 * @param {String} connectionObj.extentionPoint the extention point to connect at
	 * @returns {Boolean} True if has connection. False if not.
	 */
	this.hasConnection = function(connectionObj) {
		var hasConn = false;
		var arrayLength = connections.length;
		for ( var i = 0; i < arrayLength; i++) {
			if(connections[i].pluginId === connectionObj.pluginId && connections[i].extentionPoint === connectionObj.extentionPoint) {
				hasConn = true;
			}
		}

		return hasConn;
	};

	/**
	 * Gets the plugin(s) and respective extentionPoints that this plugin is supposed to extend
	 *
	 * @returns {Object[]} Array of objects like: {pluginId: String, extentionPoint: String}
	 */
	this.getConnections = function(){
		return connections;
	};



	/**
	 * Method to be overriden. <br/>
	 * Other plugins will call this method if this plugin is defined to connect(extend) to the caller plugin. <br/>
	 * Use this method, to define how this plugin handles the connection from extended plugin, knowing that it should receive an object as an interface
	 * to the extended plugin. You can then store a refence to this interface, in order to keep the connection to the extended plugin.<br/>
	 * You should also protect this plugin from interface changes, validating every method or attribute exitence before calling it.
	 *
	 * @param {PLUGIT.interfaces.PluginConnectionInterface} objInterface The object used as an interface to the extended plugin. Use console.log to inspect the interface methods and attributes.
	 * @throws {Error} If method is not overrriden, it will throw an error.
	 */
	this.connect = function(objInterface) {
		throw new Error("PrototypePlugin.connect(). This method is meant to be overriden at plugin " + this.id + ". It is beeing called because another plugin is trying to connect " +
				"this as an extention plugin.");
	};

	/**
	 * Call method connect() on each plugin under each extentionPoint
	 *
	 * @throws {Error} Throws Error only if plugin has extention points.
	 */
	this.callConnectOnExtentionPoints = function() {
		var extentionPoints = this.getExtentionPoints();

		for ( var extentionPointKey in extentionPoints) {
			this.callConnectOnExtentionPoint(extentionPointKey);
		}
	};

	this.callConnectOnExtentionPoint = function(extentionPointName) {
		if(this.hasExtentionPoint(extentionPointName)) {
			if(extentionPointsInterfaces[extentionPointName] !== undefined) {
				var pluginInterface = extentionPointsInterfaces[extentionPointName];

				if(!extentionPointsConnected[extentionPointName]) { // if connect() hasn't been called yet on this extention point
					if(extentionPoints[extentionPointName] instanceof Array) {
						var arrayLength = extentionPoints[extentionPointName].length;
						for ( var i = 0; i < arrayLength; i++) {
							extentionPoints[extentionPointName][i].connect(pluginInterface);
							extentionPointsConnected[extentionPointName] = true;
						}
					}
					else if(extentionPoints[extentionPointName] !== null){
						extentionPoints[extentionPointName].connect(pluginInterface);
						extentionPointsConnected[extentionPointName] = true;
					}
				}
			}
			else {
				throw new TypeError("PLUGIT.proto.PrototypePlugin.callConnectOnExtentionPoints(). Unable to find interface for extention point " + extentionPointKey + " in plugin " + this.id);
			}

		}
		else {
			throw new TypeError("PLUGIT.proto.PrototypePlugin.callConnectOnExtentionPoint(). Trying to call connect() on extention point " + extentionPointName + " but this extention point doesn't exist.");
		}
	};

	/**
	 * Method to be overriden and called by CORE during the RESUME fase.<br />
	 * Allows for any plugin implementation to define how the plugin start should behave. It represents the only time the core will present
	 * it self (through an an object) to the plugin. Therefore, this is the best place to fire startup events.
	 *
	 * @param {Object} obj Object representing the Core interface.
	 * @throws {Error} Generic error alerting that this method is meant to be overriden
	 */
	this.start = function(obj) {
		throw Error("PLUGIT.proto.Plugin.start(). Method start() in plugin id: " + this.id + " is meant to be overriden. Please override it and use console.log() to inspect arguments beeing passed. Refer to documentation for further details.");
	};

	PLUGIT.proto.Observable.apply(this);
};