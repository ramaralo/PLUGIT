/**
 * Interface used for the plugin communication contract when connect() method is called on a plugin.
 * It should be used in this situation: <br/>
 * <ul>
 * <li>PluginA extends PluginB at extention point extB.</li>
 * <li>PluginB will call PluginA.connect(interface), where interface is an instance of {@link {@link PLUGIT.interfaces.PluginConnectionInterface}}.</li>
 * </ul>
 * <p>
 * You can, and probably will, extend this interface, adding new methods to it. However, an instance of this interface MUST allways be used.
 * </p>
 * 
 * @class
 * @see {@link {@link PLUGIT.interfaces.PluginConnectionResponseInterface}} 
 * @param {String} pluginId The id of the extended plugin, i.e., the id of the plugin that delivers this interface
 * @param {String} extentionPoint The extention point the interface refers to. Defaults no null.
 * @property {String} id The id of the plugin using this interface
 * @property {String} extentionPoint The extention point name where this interface is beeing used
 * @returns {PLUGIT.interfaces.PluginConnectionInterface}
 * @throws {@link TypeError} if argument pluginId is undefined
 * @throws {@link TypeError} if argument extentionPoint is undefined
 */
PLUGIT.interfaces.PluginConnectionInterface = function(pluginId, extentionPoint) {
	this.id = pluginId;
	//TODO: allow only strings
	this.extentionPoint = (extentionPoint !== undefined) ? extentionPoint : null;
	this.api = {};
	/**
	 * Everytime a plugin calls connect() on any plugin under its extentions points, it must pass an instance of {@link {@link PLUGIT.interfaces.PluginConnectionInterface}} as an interface.
	 * As a response, the plugin on the extention point should call connected() on that interface passing an interface of type {@link {@link PLUGIT.interfaces.PluginConnectionResponseInterface}}
	 *
	 *
	 */
	this.connected = function() {
	};
	
	/**
	 * @ignore
	 * @param pluginId
	 * @param extentionPoint
	 */
	function init(pluginId, extentionPoint) {
		if(pluginId === undefined) {
			throw TypeError("PLUGIT.interfaces.PluginConnectionInterface.init(). No pluginId provided as argument. Please provide a plugin ID as a String so " +
					"that this interface can be related to the correct plugin");
		}
		
		if(extentionPoint === undefined) {
			throw TypeError("PLUGIT.interfaces.PluginConnectionInterface.init(). No extentionPoint provided as argument. Please provide a extentionPoint as a String so " +
			"that this interface can be related to the correct extention point");
		}
	}
	
	init(pluginId, extentionPoint);
};