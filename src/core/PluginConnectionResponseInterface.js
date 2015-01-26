/**
 * Interface used for the plugin communication contract when connected() method is called on an interface of type: {@link {@link PLUGIT.interfaces.PluginConnectionInterface}}<br/>
 * It should be used in this situation: <br/>
 * <ul>
 * <li>PluginA extends PluginB at extention point extB.</li>
 * <li>PluginB will call PluginA.connect(interface), PluginA should respond with a interface of this type when calling interface.connected({@link {@link PLUGIT.interfaces.PluginConnectionInterface}} instance)</li>
 * </ul>
 * 
 * @class
 * @see {@link {@link PLUGIT.interfaces.PluginConnectionInterface}}
 * @param {String} pluginId The id of the responding plugin
 * @property {String} id The id of the plugin using this interface
 * @returns {PLUGIT.interfaces.PluginConnectionResponseInterface}
 * @throws {@link TypeError} if argument pluginId is undefined
 */
PLUGIT.interfaces.PluginConnectionResponseInterface = function(pluginId) {
	this.id = pluginId;
	this.api = {};

	/**
	 * @ignore
	 * @param pluginId
	 * @param extentionPoint
	 */
	function init(pluginId) {
		if(pluginId === undefined) {
			throw TypeError("PLUGIT.interfaces.PluginConnectionResponseInterface.init(). No pluginId provided as argument. Please provide a plugin ID as a String so " +
					"that this interface can be related to the correct plugin");
		}
	}
	
	init(pluginId);
};