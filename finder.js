var slice = Array.prototype.slice;

module.exports = function(collection) {

    collection.find = function() {
        var where = collection.where.apply(collection, slice.call(arguments));

        return where.length > 0 ? where[0] : null;
    };

    collection.where = function() {
        var conditions = {};
        if (typeof arguments[0] === "string") {
            conditions[arguments[0]] = arguments[1];
        } else {
            conditions = arguments[0];
        }

        return collection.filter(function(item) {
            var satisfiedCondition = false;
            for (var key in conditions) {
                if (conditions.hasOwnProperty(key)) {
                    satisfiedCondition = typeof item[key] !== "undefined" && item[key] === conditions[key];
                }
            }

            return satisfiedCondition;
        });
    };

};
