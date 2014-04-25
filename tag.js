var finderCapabilities = require("./finder");
var slice = Array.prototype.slice;

module.exports = function(object) {

    var tags = {};
    var tagNames = [];

    object.tag = function() {
        var args = slice.call(arguments);
        var item = args.shift();
        args.forEach(function(arg) {
            var tagNames = Array.isArray(arg) ? arg : [arg];
            tagNames.forEach(function(tagName) {
                var tag = object.getTag(tagName);
                if (tag.indexOf(item) === -1) {
                    tag.push(item);
                }
            });
        });

        return object;
    };

    object.untag = function() {

        var args = slice.call(arguments);
        var item = args.shift();

        args.forEach(function(arg) {
            var tagNames = Array.isArray(arg) ? arg : [arg];
            tagNames.forEach(function(tagName) {
                var tag = tags[tagName] || false;
                if (tag) {
                    var index = tag.indexOf(item);
                    if (index !== -1) {
                        tag.splice(index, 1);
                    }
                }
            });
        });

        return object;
    };

    object.untagAll = function(item) {
        tagNames.forEach(function(tagName) {
            object.untag(tagName, item);
        });

        return object;
    };

    object.getTag = function(tagName) {
        object.addTag(tagName);

        return tags[tagName];
    };

    object.addTag = function(tagName) {
        if (typeof tags[tagName] === "undefined") {
            tagNames.push(tagName);
            var tag = Object.create(Array.prototype);
            tags[tagName] = tag;
            finderCapabilities(tag);
            tagBroadcastCapabilities(tag);
            Object.defineProperty(object, tagName, {
                get: function() {
                    return tagCascade(tag);
                },
                configurable: true
            });
        }

        return this;
    };

    function tagCascade(parentTag) {
        tagNames.forEach(function(tagName) {
            defineFilteredTag(parentTag, tagName);
        });

        return parentTag;
    }

    function defineFilteredTag(parentTag, tagName) {
        Object.defineProperty(parentTag, tagName, {
            get: function() {
                var filteredTag = filterTag(parentTag, tags[tagName]);
                finderCapabilities(filteredTag);
                tagBroadcastCapabilities(filteredTag);
                return tagCascade(filteredTag);
            },
            configurable: true
        });
    }

    function filterTag(parentTag, tag) {
        var filtered = Object.create(Array.prototype);
        parentTag.forEach(function(item) {
            for (var i = 0; i < tag.length; i++) {
                if (tag[i] === item) {
                    filtered.push(item);
                    break;
                }
            }
        });

        return filtered;
    }

    function tagBroadcastCapabilities(tag) {
        tag.broadcast = function() {
            var args = slice.call(arguments);
            tag.forEach(function(item) {
                item.emit.apply(item, args);
            });
        };
    };

    return object;
};
