const capitaliseFirstLetter = str => str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
const createMethodName = (rule, table) => rule + capitaliseFirstLetter(table);

class RBR {
  /**
   * Set the rules to be user
   *
   * @param {*} rules
   * @memberof RBR
   */
  setRules(rules) {
    this.rules = rules;

    // Iterate through tables and roles
    Object.keys(rules).forEach((table) => {
      Object.keys(rules[table]).forEach((rule) => {
        // Generate Method Name
        const methodName = createMethodName(rule, table);

        // Define new Method on RBR
        Object.defineProperty(this, methodName, {
          value: (role = this.role) => {
            /**
             * Return the Boolean value of return a function
             * that returns the boolean value
             */
            if (typeof rules[table][rule][role] === 'boolean') {
              return () => rules[table][rule][role];
            }
            return rules[table][rule][role];
          },
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
  setRole(role) {
    this.role = role;
  }

  /**
   * Returns array of rules for a role
   *
   * @param {*} role
   * @returns Object of functions.
   * @memberof RBR
   */
  getAllRulesForRole(role) {
    const roleRules = {};

    // Iterate through tables and roles
    Object.keys(this.rules).forEach((table) => {
      Object.keys(this.rules[table]).forEach((rule) => {
        // Generate Method Name
        const methodName = createMethodName(rule, table);

        roleRules[methodName] = this[methodName](role);
      });
    });

    return roleRules;
  }
}

export default new RBR();
