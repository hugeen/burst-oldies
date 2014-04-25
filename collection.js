var finderCapabilities = require("./finder");
var tagCapabilities = require("./tag");
var slice = Array.prototype.slice;

module.exports = function(collection) {

    collection.all = Object.create(Array.prototype);

    finderCapabilities(collection.all);
    tagCapabilities(collection);

    collection.find = function() {
        return collection.all.find.apply(collection.all, slice.call(arguments));
    };

    collection.where = function() {
        return collection.all.where.apply(collection.all, slice.call(arguments));
    };

    collection.add = function(item) {
        var items = Array.isArray(item) ? item : [item];
        items.forEach(function(item) {
            collection.all.push(item);
        });

        return collection;
    };

    collection.remove = function(item) {
        var items = Array.isArray(item) ? item : [item];
        collection.untagAll(item);
        items.forEach(function(item) {
            var index = collection.all.indexOf(item);
            if (index !== -1) {
                collection.all.splice(index, 1);
            }
        });

        return collection;
    };

    return collection;
};
