import RBR from '../src';

const postIsNotPrivate = post => post.private === false;

const rules = {
  post: {
    canRead: {
      guest: postIsNotPrivate,
      member: postIsNotPrivate,
      admin: true,
    },
    canWrite: {
      guest: false,
      member: true,
      admin: true,
    },
  },
};

RBR.setRules(rules);

test('Defines a function for each rule', () => {
  expect(RBR.canReadPost).toBeDefined();
  expect(RBR.canWritePost).toBeDefined();

  expect(typeof RBR.canReadPost).toBe('function');
  expect(typeof RBR.canWritePost).toBe('function');
});

test('Returns a function when a role is passed to a rule', () => {
  expect(RBR.canReadPost('member')).toBeDefined();
  expect(RBR.canWritePost('admin')).toBeDefined();

  expect(typeof RBR.canReadPost('member')).toBe('function');
  expect(typeof RBR.canWritePost('admin')).toBe('function');
});

test('Boolean rules return the correct value', () => {
  expect(RBR.canReadPost('admin')()).toBe(true);
  expect(RBR.canWritePost('admin')()).toBe(true);
});

test('Functional rules return the correct value', () => {
  expect(RBR.canReadPost('guest')({ private: true })).toBe(false);
  expect(RBR.canReadPost('member')({ private: false })).toBe(true);
});
