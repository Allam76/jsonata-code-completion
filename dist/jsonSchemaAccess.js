"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require('lodash'),
    merge = _require.merge,
    some = _require.some,
    find = _require.find,
    uniq = _require.uniq,
    map = _require.map,
    get = _require.get;

module.exports = function (schema) {
  return {
    startSchema: schema,
    currentSchema: schema,
    name: "",
    setCurrentSchema: function setCurrentSchema(node) {
      var _this = this;

      var value = node.value;

      if (this.currentSchema && this.getProp(this.currentSchema) && this.getProp(this.currentSchema)[value]) {
        this.currentSchema = this.getProp(this.currentSchema)[value];
        this.name = value;
      } else if (this.currentSchema && this.currentSchema.name == value) {} else if (this.currentSchema && this.hasOf(this.currentSchema)) {
        this.currentSchema[this.getOf(this.currentSchema)].map(function (item) {
          if (_this.getProp(item)) {
            var prop = _this.getProp(item)[value];

            if (prop) {
              _this.currentSchema = prop;
              _this.name = value;
            }
          }
        });
      } else {
        this.currentSchema = null;
      }
    },
    setStartName: function setStartName() {
      this.currentSchema = this.startName;
    },
    getCurrentSchema: function getCurrentSchema() {
      return this.currentSchema;
    },
    getAttribute: function getAttribute(name) {
      return this.currentSchema.properties[name];
    },
    getProposals: function getProposals(direction) {
      if (this.currentSchema && this.hasOf(this.currentSchema)) {
        var _ref;

        return uniq((_ref = [{}]).concat.apply(_ref, _toConsumableArray(this.currentSchema[this.getOf(this.currentSchema)].map(function (item) {
          if (item.properties) {
            return map(item.properties, function (item, name) {
              return {
                name: name,
                type: "property",
                direction: direction
              };
            });
          }
        }))));
      } else if (this.currentSchema && this.getProp(this.currentSchema)) {
        return Object.keys(this.getProp(this.currentSchema)).map(function (name) {
          return {
            name: name,
            type: "property",
            direction: direction
          };
        });
      }
    },
    setCurrent: function setCurrent(data) {
      this.current = data;
    },
    getCurrent: function getCurrent() {
      return this.current;
    },
    hasChildNames: function hasChildNames() {
      return this.currentSchema && this.currentSchema.properties ? true : false;
    },
    hasOf: function hasOf(schema) {
      return some(["anyOf", "allOf", "oneOf"], function (item) {
        return schema[item];
      });
    },
    getOf: function getOf(schema) {
      return find(["anyOf", "allOf", "oneOf"], function (item) {
        return schema[item];
      });
    },
    getProp: function getProp(schema) {
      if (schema.properties) return schema.properties;
      if (schema.items) return schema.items.properties;
    }
  };
};