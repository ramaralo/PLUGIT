/**
* @ignore
*/
var PLUGIT = {
		/**
		 * @ignore
		 * @property {Object} core
		 * @description Base plugin responsible for the management of all the plugins loaded.
		 */
		core: null,
		/**
		 * @property {Object} libs
		 * @description Object containing all custom libraries
		 */
		libs: {
		},
		/**
		 * @property {Object} proto
		 * @description Object containing all constructors meant to be used as a prototype for inheritance
		 */
		proto: {},
		/**
		 * @property {Object} interfaces
		 * @description Object containing all constructors to be instatiated as a plugin communication interface
		 */
		interfaces: {
		},
		/**
		 * @property {Object} util
		 * @description Utility functions
		 */
		util:{
		},
		ERROR_TYPES: ["FATAL", "SIMPLE"]
};