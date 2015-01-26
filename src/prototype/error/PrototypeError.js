/**
 * Runtime generic error representation
 *
 * @returns {PLUGIT.proto.Error}
 */
PLUGIT.proto.Error = function() {
	var allowedTypes = PLUGIT.ERROR_TYPES;

	var errorType = undefined;
	var errorDescription = undefined;
	var errorInfo = undefined;
	var actions = [];
	
	/**
	 * Defines error type.
	 * Allowed types are those available at PLUGIT.ERROR_TYPES
	 * 
	 * @param {String} type o tipo de erro
	 * @throws {TypeError} Se type não é uma string
	 */
	this.setType = function(type) {
		if(typeof(type) === "string") {
			//TODO: Remove jquery dependency
			if($.inArray(type, allowedTypes) === -1) {
				throw new TypeError("PLUGIT.proto.Error.SetType(). Error type: " + type + "is not supported.");
			}
			
			errorType = type;
		}
		else {
			throw new TypeError("PLUGIT.proto.Error.setType(). Argument type is not a string.");
		}
	};
	
	
	/**
	 * Returns erro type
	 * 
	 * @returns {String}
	 */
	this.getType = function() {
		return errorType;
	};
	
	/**
	 * Defines error description
	 * 
	 * @param {String} description String com a descrição do erro
	 * @throws {TypeError} Se description não é uma string
	 */
	this.setErrorDescription = function(description) {
		if(typeof(description) !== "string") {
			throw new TypeError("PLUGIT.proto.Error.setErrorDescription(). Argument description is not a string.");
		}
		
		errorDescription = description;
	};
	
	/**
	 * Returns error description
	 *
	 * @returns {String}
	 */
	this.getErrorDescription = function() {
		return errorDescription;
	};
	
	/**
	 * Defines error info.
	 *
	 * @throws {TypeError} If infostring is not a string
	 */
	this.setErrorInfo = function(infoString) {
		if(typeof(infoString) !== "string") {
			throw new TypeError("PLUGIT.proto.Error.setErrorInfo(). Argument description is not a string.");
		}
		
		errorInfo = infoString;
	};
	
	/**
	 * Returns error info.
	 * 
	 * @returns {String}
	 */
	this.getErrorInfo = function() {
		return errorInfo;
	};
	
	/**
	 * Adds definition pf actions to take for the error. Each action definition must provide the label and an associated function to be executed if that action is choosen
	 *
	 * @param {Array} objArray Action array under the form of objects like: [{label: <string>, actions: <function>}, ...]
	 * @throws {TypeError} If:
	 * <li>
	 * <ul>objArray is not an array</ul>
	 * <ul>each action definition is not an object</ul>
	 * <ul>cada definição de acção não tem um atributo label ou não é uma string</ul>
	 * <ul>each action definition doesn't have a label attribute or is not a string</ul>
	 * <ul>each action definition doesn'nt have an action attribute ot is not a function</ul>
	 * </li>
	 */
	this.addActions = function(objArray) {
		if(!(objArray instanceof Array)) {
			throw new TypeError("PLUGIT.proto.Error.addActions(). Argument is not an array.");
		}
		
		var arrayLength = objArray.length;
		for ( var i = 0; i < arrayLength; i++) {
			if(typeof(objArray[i]) !== "object") {
				throw new TypeError("PLUGIT.proto.Error.addActions(). Argument contains one element that is not an object. Element is in index: " + i);
			}
			
			if(objArray[i].label === undefined || objArray[i].action === undefined) {
				throw new TypeError("PLUGIT.proto.Error.addActions(). Argument contains one element missing a label att or a action att. Element is in index: " + i);
			}
			
			if(typeof(objArray[i].label) !== "string") {
				throw new TypeError("PLUGIT.proto.Error.addActions(). Argument contains one element where the label attribute is not a string. Element is in index: " + i);
			}
			
			if((typeof(objArray[i].action) !== "function")) {
				throw new TypeError("PLUGIT.proto.Error.addActions(). Argument contains one element where the action attribute is not a function. Element is in index: " + i);
			}
		}
		
		actions = actions.concat(objArray);
	};
	
	/**
	 * Returns actions defined by setActions()
	 *
	 * @returns {Array} Array de definições de acções do tipo [{label: <action>, action: <function>}, ...]
	 */
	this.getActions = function() {
		return actions;
	};
};