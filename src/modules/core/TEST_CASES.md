# TEST CASES

## USER

### GRAPHQL

```
query GetAllUsers {
  getAllUsers {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}

query GetUser {
  getUser(username: "") {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}

mutation CreateUser {
  createUser(
    input: {
      username: ""
      password: ""
      departmentId: ""
      usernameDb: ""
      ifsUsername: ""
    }
  ) {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}

mutation UpdateUser {
  updateUser(
    input: {
      username: ""
      password: ""
      departmentId: ""
      usernameDb: ""
      ifsUsername: ""
    }
  ) {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}

mutation DeleteUser {
  deleteUser(username: "") {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}
```


## AUTH

### GRAPHQL

```
query CurrentUser {
  currentUser {
    username
    name
    email
    departmentId
    defaultContract
    contract
  }
}

mutation Login {
  login(input: { username: "", password: "" }) {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}

mutation Logout {
  logout
}

mutation ForgotPassword {
  forgotPassword(username: "")
}

mutation ChangePassword {
  changePassword(
    token: ""
    newPassword: ""
  ) {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
    defaultContract
    contract
    status
    createdAt
    updatedAt
  }
}
```
