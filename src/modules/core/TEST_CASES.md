# TEST CASES

## AUTH

### GRAPHQL

query GetAllUsers {
  getAllUsers {
    username
    name
    email
    departmentId
    usernameDb
    ifsUsername
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
    status
    createdAt
    updatedAt
  }
}

query Me {
  me {
    username
    name
    email
    usernameDb
    ifsUsername
    status
    createdAt
    updatedAt
  }
}

mutation Register {
  register(
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
    status
    createdAt
    updatedAt
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
    status
    createdAt
    updatedAt
  }
}
