/**
 * Abstraction of CORE interface as a plugin sees it. This should be used in this situation: <br/>
 * 
 * 
 * When CORE calls the start() method (on the RESUME fase) on any plugin, it will pass a CoreToPluginInterface instance as an argument. <br/>
 * For specific plugins, or CORE extention points the interface may be extended, but this definition is allways present. Every plugin should redefine
 * its start() method, knowing that an instance of {@link {@link PLUGIT.interfaces.CoreToPluginInterface}} will be passed as an argument and should keep
 * a reference to this argument in order to keep a "connection" to CORE enviorment.
 * 
 * @class
 * @property {String[]} permitions An array of SCA's PI's
 * @property {PLUGIT.libs.i18n} i18n An instance of {@link {@link PLUGIT.libs.i18n}} already popuplated with all i18n keys from propertie files
 * @property {Number[]} startCenter An array of LAT, LONG defined on the key PLUGIT.map.startCenter PLUGIT_config.properties. Example. [17, -22]
 * @property {Number} startzoom A number to specify the starting map zoom. Example: 5
 */
PLUGIT.interfaces.CoreToPluginInterface = function() {
	/**
	 * @param {String} eventName The name of the event to stop observing
	 * @param {Function} fn The callback to be removed from the event
	 */
	this.stopObservingEvent = function(eventName, fn){};
	
	/**
	 * @param {Object} paramObj
	 * @param {String} paramObj.pluginId
	 * @param {String} paramObj.eventName
	 * @param {Function} paramObj.callBack
	 * @returns {Boolean|Number}
	 */
	this.observePluginEvent = function(paramObj){};
};
