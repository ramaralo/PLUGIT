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
			filters: {},
			filterFactory: (function() {

				function FilterFactory() {
					var filterCreator = {};

					this.i18nInstance = null;

					this.extendForFilter = function(filterType, fn) {
						if(arguments.length !== 2) {
							throw new TypeError("PLUGIT.libs.filterFactory.extendForFilter() expects only two arguments. " + arguments.length + " arguments were found");
						}

						else if(typeof(arguments[0]) !== "string") {
							throw new TypeError("PLUGIT.libs.filterFactory.extendForFilter() expects first argument to be a string. " + typeof(arguments[0]) + " was found");
						}

						else if(typeof(arguments[1]) !== "function") {
							throw new TypeError("PLUGIT.libs.filterFactory.extendForFilter() expects second argument to be a function. " + typeof(arguments[1]) + " was found");
						}

						else if(filterCreator[filterType] !== undefined && typeof(filterCreator[filterType]) === "function") {
							throw new TypeError("PLUGIT.libs.filterFactory.extendForFilter(). Factory allready knows type " + filterType + ". You can only define a type once.");
						}

						else {
							filterCreator[filterType] = fn;
						}

					};

					this.createFilter = function(filterType, args, layerManagerInterface) {
						if(!this.knowsFilterType(filterType)) {
							throw new Error("PLUGIT.libs.filterFactory.createFilter(). Unknown filter type: " + filterType);
						}

						var filter =  filterCreator[filterType](
								{
									filterDefinition: args,
									layerManagerInterface: layerManagerInterface
								}
						);

						if(!(filter instanceof PLUGIT.proto.PrototypeFilter)) {
							throw new TypeError("PLUGIT.libs.filterFactory.createFilter(). Factory allready knows type " + filterType + ". You can only define a type once.");;
						}
						else {
							return filter;
						}
					};

					this.knowsFilterType = function(filterType) {
						var knows = (filterCreator[filterType] !== undefined) ? true : false;;

						return knows;
					};
				}

				return new FilterFactory();

			})(),
			extended: {}
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
			extended: {}
		},
		/**
		 * @property {Object} util
		 * @description Utility functions
		 */
		util:{
			loadCss: function(href) {
				var cssLink = $('<link />');
				cssLink.attr("rel","stylesheet");
				cssLink.attr("type", "text/css");
				cssLink.attr("href", href);

				$('head').append(cssLink);

				return cssLink;
			}
		}
};