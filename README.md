<h1 style="text-align: center">RBR</h1>
<p style="text-align: center">Role • Based • Rules<br>
Quickly write rules and permissions based on user roles.</p>

## Basic Usage

**Import RBR into your app**
```javascript
  import RBR from 'rbr';
```

**Define your rules**
```javascript
const rules = {
  posts: {
    canEdit: {
      guest: false,
      member: (memberId, postAuthorId) => memberId === postAuthorId,
      admin: true,
    },
  },
};

RBR.setRules(rules);
```

**Query the rules later on**
```javascript
import RBR from 'rbr';

RBR.canEditPost('guest')(1, 1); // false
RBR.canEditPost('member')(1, 1); // true
RBR.canEditPost('admin')(1, 1); // true

/* or */
RBR.setRole('member');

RBR.canEditPost('member')(1, 1); // true
RBR.canEditPost('member')(1, 2); // false
```

## Terminolodgy
- **Table**. A *table* is an object the user can perform actions on. e.g. users, posts.
- **Permission**. A *permission* is an action that the user would like to perform.
- **User Role**. A *user role* defined the level of access the user has. This should be saved against the user somewhere in your database. e.g. guest, admin.
- **Rule**. A *rule* is the requirements that must be met for a *user role* to be able to perform an *action* on a *table*.

## Defining Rules

### The Rules Object
Rules are defined within a *rules* object. The *rules* object contains three levels: tables, permissions and roles. Each role is then given a rule.

```javascript
const rules = {
  tableA: {
    permissionA: {
      userRoleA: rule,
      userRoleB: rule,
    },
    permissionB: {
      userRoleA: rule,
      userRoleB: rule,
    },
  },
  tableB: {
    permissionC: {
      userRoleA: (a, b) => a !== b,
      userRoleB: (a, b) => a > b,
    },
    permissionD: {
      userRoleA: true,
      userRoleB: (a, b, c) => a > b && c < a,
    },
  },
}
```


### Naming Permissions
Permissions should be named after the action they perform e.g. canEdit, canUpdate. The name of each permission will be prepended to the table they belong to (`final permission name = permission name + table name`).

```javascript
const rules = {
  dog: {
    canFeed: {
      ...
    }
    canClean: {
      ...
    },
  },
}
```
The rules object above will yield two permissions `canFeedDog` and `canCleanDog`.


### Writing rules
Rules are defined on each user role, they can either be a boolean or a function. You might want to use a boolean value for some user roles, and a function for others.

```javascript
const rules = {
  post: {
    canRead: {
      guest: post => post.visibility = 'public',
      member: post => post.visibility = 'public',
    },
    canEdit: {
      guest: false,
      member: (userId, postAuthorId) => userId === postAuthorId,
    },
  },
}
```
Or simplified to

```javascript
const isPostPublic = post => post.visibility = 'public';

const rules = {
  post: {
    canRead: {
      guest: isPostPublic,
      member: isPostPublic,
    },
    canEdit: {
      guest: false,
      member: (userId, postAuthorId) => userId === postAuthorId,
    },
  },
}
```

The examples above are quite simple and a lot more can be done within a rules function. For example, you could make calls to your API.

> If a boolean is used as a rules value, it will be wrapped in a function that returns its value. This way you can treat all rules as functions when checking permissions later on.

## Checking Permissions
RBR using a singleton pattern, so anywhere you import RBR, you will have access to your rules.

You can specity the user role to check either when calling a rule or on the RBR class. Setting it on the RBR class is recommended because it only has to be set once.

When a rule is called (e.g. `canEditPost()`) it will return a second function, this function takes any parameters that might be used in a rule.

>If parameters are given to a rule that doesn't require them, they will be ignored and the rule will return it's value like normal.

```javascript
const rules = {
  user: {
    canCreated: {
      user: false,
      admin: true,
    },
    canEdit: {
      user: (currentUserId, editUserid) => currentUserId === editUserId,
      admin: true,
    }
  }
}
```

```javascript
import RBR from 'rbr';

RBR.canCreatedUser('user')(); // false
RBR.canCreatedUser('admin')(); // true

/* or */
RBR.setRole('user');

RBR.canEditUser()(1, 1); // true
RBR.canEditUser()(1, 2); // false
```
