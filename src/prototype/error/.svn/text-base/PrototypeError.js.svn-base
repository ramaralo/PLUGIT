/**
 * Generalização da representação de erros para runtime.
 * 
 * 
 * @returns {PLUGIT.proto.Error}
 */
PLUGIT.proto.Error = function() {
	var allowedTypes = ["fatal", "simple"];
	var errorType = undefined;
	var errorDescription = undefined;
	var errorInfo = undefined;
	var actions = [];
	
	/**
	 * Define o tipo de erro.
	 * Tipos possíveis são: <br/>
	 * <li>
	 * <ul>fatal</ul>
	 * <ul>simple</ul>
	 * </li>
	 * 
	 * @param {String} type o tipo de erro
	 * @throws {TypeError} Se type não é uma string
	 */
	this.setType = function(type) {
		if(typeof(type) === "string") {
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
	 * Devolve o tipo de erro.
	 * 
	 * @returns {String}
	 */
	this.getType = function() {
		return errorType;
	};
	
	/**
	 * Define a descrição do erro. A descrição do erro deve ser um texto que apresenta detalhes do que aconteceu e, sempre que possível, descrever elternativas de resolução que os botões 
	 * definidos com setActions() implementam.
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
	 * Devolve a descrição do erro.
	 * 
	 * @returns {String}
	 */
	this.getErrorDescription = function() {
		return errorDescription;
	};
	
	/**
	 * Define a informação específica do erro. Deve ser um texto que permita ao utilizador perceber o que aconteceu, de uma forma sucinta.
	 * 
	 * @throws {TypeError} Se infoString não é uma string
	 */
	this.setErrorInfo = function(infoString) {
		if(typeof(infoString) !== "string") {
			throw new TypeError("PLUGIT.proto.Error.setErrorInfo(). Argument description is not a string.");
		}
		
		errorInfo = infoString;
	};
	
	/**
	 * Devolve a informação específica do erro.
	 * 
	 * @returns {String}
	 */
	this.getErrorInfo = function() {
		return errorInfo;
	};
	
	/**
	 * Adiciona definições de acções a tomar mediante o erro. Cada definição de acção fornece o label já internacionalizado, e uma função a ser executada se essa acção for escolhida.
	 * 
	 * @param {Array} objArray Array de acções sob a forma de [{label: <string>, actions: <function>}, ...]
	 * @throws {TypeError} Se: 
	 * <li>
	 * <ul>objArray não é um array</ul>
	 * <ul>cada definição de acção não é um objeto</ul>
	 * <ul>cada definição de acção não tem um atributo label ou não é uma string</ul>
	 * <ul>cada definição de acção não tem um atributo action ou não é uma função</ul>
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
	 * Devolve ações definidas com setActions().
	 * 
	 * @returns {Array} Array de definições de acções do tipo [{label: <action>, action: <function>}, ...]
	 */
	this.getActions = function() {
		return actions;
	};
};