var eventCapabilities = require("./event");
var collectionCapabilities = require("./collection");
var slice = Array.prototype.slice;

module.exports = function(Model) {

    eventCapabilities(Model);
    collectionCapabilities(Model);

    Model.create = function() {

        var instance = {};

        Object.defineProperty(instance, "destroy", {
            get: function() {
                Model.remove(instance);
                Model.emit("instance destroyed", instance);
                return Model;
            }
        });

        instance.tag = function() {
            Model.tag.apply(Model, [instance].concat(slice.call(arguments)));
            return instance;
        };

        instance.untag = function() {
            Model.untag.apply(Model, [instance].concat(slice.call(arguments)));
            return instance;
        };

        Model.add(instance);

        Model.emit.apply(Model, ["create", instance].concat(slice.call(arguments)));

        return instance;
    };

    return Model;
};
