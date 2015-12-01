define(function(){

    /* Based on Alex Arnell's inheritance implementation. */

    /** section: Language
     * class Class
     *
     *  Manages Prototype's class-based OOP system.
     *
     *  Refer to Prototype's web site for a [tutorial on classes and
     *  inheritance](http://prototypejs.org/learn/class-inheritance).
     **/

    if (!Object.keys) {
        /**
         * 获取键并返回数组
         * Object.keys(object)
         * @param {Object} object 需要获取键数组的实例对象
         * @return {Array} 键数组
         */
        Object.keys = function (object) {
            var keys = [], name;
            for (name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }

    var Class = (function() {

        // Some versions of JScript fail to enumerate over properties, names of which
        // correspond to non-enumerable properties in the prototype chain
        var IS_DONTENUM_BUGGY = (function(){
            for (var p in { toString: 1 }) {
                // check actual property name, so that it works with augmented Object.prototype
                if (p === 'toString') return false;
            }
            return true;
        })();

        function $A(iterable) {
            if (!iterable) return [];
            // Safari <2.0.4 crashes when accessing property of a node list with property accessor.
            // It nevertheless works fine with `in` operator, which is why we use it here
            if ('toArray' in Object(iterable)) return iterable.toArray();
            var length = iterable.length || 0, results = new Array(length);
            while (length--) results[length] = iterable[length];
            return results;
        }

        function extend(destination,source){
            for(var n in source){
                if(source.hasOwnProperty(n)){
                    destination[n]=source[n];
                }
            }
            return destination;
        }

        function subclass() {};
        function create() {
            var parent = null, properties = $A(arguments);
            if ("[object Function]" === Object.prototype.toString.call(properties[0]))
                parent = properties.shift();

            function klass() {
                this.initialize.apply(this, arguments);
            }
            extend(klass, Class.Methods);
            klass.superclass = parent;
            klass.subclasses = [];

            if (parent) {
                subclass.prototype = parent.prototype;
                klass.prototype = new subclass;
                parent.subclasses.push(klass);
            }

            for (var i = 0, length = properties.length; i < length; i++)
                klass.addMethods(properties[i]);

            if (!klass.prototype.initialize)
                klass.prototype.initialize = Prototype.emptyFunction;

            klass.prototype.constructor = klass;
            return klass;
        }

        function addMethods(source) {
            var ancestor   = this.superclass && this.superclass.prototype,
                properties = Object.keys(source);

            if (IS_DONTENUM_BUGGY) {
                if (source.toString != Object.prototype.toString)
                    properties.push("toString");
                if (source.valueOf != Object.prototype.valueOf)
                    properties.push("valueOf");
            }

            for (var i = 0, length = properties.length; i < length; i++) {
                var property = properties[i], value = source[property];
                if (ancestor && Object.isFunction(value) &&
                    value.argumentNames()[0] == "$super") {
                    var method = value;
                    value = (function(m) {
                        return function() { return ancestor[m].apply(this, arguments); };
                    })(property).wrap(method);

                    value.valueOf = (function(method) {
                        return function() { return method.valueOf.call(method); };
                    })(method);

                    value.toString = (function(method) {
                        return function() { return method.toString.call(method); };
                    })(method);
                }
                this.prototype[property] = value;
            }

            return this;
        }

        return {
            create: create,
            extend: extend,
            Methods: {
                addMethods: addMethods
            }
        };
    })();

    return Class;
})