/**
 * @memberOf PLUGIT.proto
 * @returns {PLUGIT.proto.Observable}
 */
PLUGIT.proto.Observable = function() {
	var myObj = this;
	var events ={};

	function addObserver(eventName, fn) {
		var added = true;

		if(myObj.hasEvent(eventName)) {
			events[eventName].push(fn);
		}
		else {
			added = false;
		}

		return added;
	}

	this.defineEvent = function(eventName) {
		events[eventName] = (!this.hasEvent(eventName)) ? [] : events[eventName];
	};

	this.observeEvent = function(eventName, fn) {
		return addObserver(eventName, fn);
	};

	/**
	 * Removes a listener from an event
	 *
	 * @param {String} eventName The event name
	 * @param {Function} fn the callback to be removed
	 * @returns {Boolean} True if the event and callback exists for that event, false otherwise
	 */
	this.stopObservingEvent = function(eventName, fn) {
		var removed = false;

		if(this.hasEvent(eventName)) {
			var i = 0;
			var arrayLength = events[eventName].length;
			for (i; i < arrayLength; i++) {
				if(events[eventName][i] == fn) {
					events[eventName][i] = function(){};
					removed = true;
				}
			}
		}

		return removed;
	};

	this.fireEvent = function(eventName, data) {
		if(this.hasEvent(eventName)) {
			var arrayLength = events[eventName].length;
			for ( var i = 0; i < arrayLength; i++) {
				events[eventName][i](data);
			}
		} else {
			throw new TypeError("PrototypeObservable.fireEvent(). Trying to fire a event " + eventName + " but this event wasn't defined.");
		}

	};

	this.hasEvent = function(eventName) {
		return (events[eventName] !== undefined && events[eventName] instanceof Array) ? true : false;
	};

	this.listEvents = function() {
		return Object.keys(events);
	};
};