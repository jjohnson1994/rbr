'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var capitaliseFirstLetter = function capitaliseFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
};
var createMethodName = function createMethodName(rule, table) {
  return rule + capitaliseFirstLetter(table);
};

var RBR = function () {
  function RBR() {
    _classCallCheck(this, RBR);
  }

  _createClass(RBR, [{
    key: 'setRules',

    /**
     * Set the rules to be user
     *
     * @param {*} rules
     * @memberof RBR
     */
    value: function setRules(rules) {
      var _this = this;

      this.rules = rules;

      // Iterate through tables and roles
      Object.keys(rules).forEach(function (table) {
        Object.keys(rules[table]).forEach(function (rule) {
          // Generate Method Name
          var methodName = createMethodName(rule, table);

          // Define new Method on RBR
          Object.defineProperty(_this, methodName, {
            value: function value() {
              var role = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.role;

              /**
               * Return the Boolean value of return a function
               * that returns the boolean value
               */
              if (typeof rules[table][rule][role] === 'boolean') {
                return function () {
                  return rules[table][rule][role];
                };
              }
              return rules[table][rule][role];
            }
          });
        });
      });
    }

    /**
     * Sets the Users Role e.g. admin, member, guest
     *
     * @param {*} role
     * @memberof RBR
     */

  }, {
    key: 'setRole',
    value: function setRole(role) {
      this.role = role;
    }

    /**
     * Returns array of rules for a role
     *
     * @param {*} role
     * @returns Object of functions.
     * @memberof RBR
     */

  }, {
    key: 'getAllRulesForRole',
    value: function getAllRulesForRole(role) {
      var _this2 = this;

      var roleRules = {};

      // Iterate through tables and roles
      Object.keys(this.rules).forEach(function (table) {
        Object.keys(_this2.rules[table]).forEach(function (rule) {
          // Generate Method Name
          var methodName = createMethodName(rule, table);

          roleRules[methodName] = _this2[methodName](role);
        });
      });

      return roleRules;
    }
  }]);

  return RBR;
}();

exports.default = new RBR();