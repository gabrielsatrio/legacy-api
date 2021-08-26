# TEST CASES

## AUTH

### GRAPHQL

query GetAllUsers {
  getAllUsers {
    id
    username
    firstName
    lastName
    fullName
    email
    role
    defaultSite
    defaultDept
    confirmed
    isActive
    createdAt
    updatedAt
  }
}

query GetUser {
  getUser(id: 1) {
    id
    username
    firstName
    lastName
    email
    role
    defaultSite
    defaultDept
    confirmed
    isActive
    createdAt
    updatedAt
  }
}

query GetUserByUsername {
  getUserByUsername(username: "") {
    id
    username
    firstName
    lastName
    email
    role
    defaultSite
    defaultDept
    confirmed
    isActive
    createdAt
    updatedAt
  }
}

query Me {
  me {
    id
    username
    firstName
    lastName
    fullName
    email
    role
    defaultSite
    defaultDept
  }
}

mutation Register {
  register(
    input: {
      username: ""
      firstName: ""
      lastName: ""
      password: ""
      email: ""
      role: ""
      defaultSite: ""
      defaultDept: ""
    }
  ) {
    success
    data {
      id
      username
      firstName
      lastName
      email
      role
      defaultSite
    	defaultDept
      confirmed
      isActive
      createdAt
      updatedAt
    }
    errors {
      message
      field
      code
    }

  }
}

mutation Login {
  login(input: { username: "", password: "" }) {
    success
    data {
    	id
      username
    }
    errors {
      message
      field
      code
    }
  }
}

mutation Logout {
  logout
}

mutation ForgotPassword {
  forgotPassword(email: "")
}

mutation ChangePassword {
  changePassword(
    token: ""
    newPassword: ""
  ) {
    success
    data {
      id
      username
    }
    errors {
      message
      field
      code
    }
  }
}

mutation DeleteUser {
  deleteUser(id: 1) {
    success
    data {
      id
      username
    }
    errors {
      message
      field
      code
    }
  }
}

## APM

### GRAPHQL

query Machines {
  getAllMachines(contract: ["AT1"]) {
    machineId
    contract
    description
    categoryId
    category
    type
    makerId
    maker
    serialNo
    yearMade
    purchaseDate
    departmentId
    department
    locationNo
    location
    status
    note
    image1
    image2
    controller
    launchMethod
    rapierType
    widthInCm
    totalAccumulator
    totalSelector
    totalHarness
    endCapacity
    gang
    gauge
    feeder
    totalNeedles
    yarnFeederType
    needleSensor
    capacityInM
    capacityInKg
    settingSystem
    totalChamber
    usableWidth
    nominalWidth
    position
    createdBy
    createdAt
    updatedAt
  }
}

query Machine {
  getMachine(machineId: "HJ-001", contract: "AT1") {
    machineId
    contract
    description
    categoryId
    category
    type
    makerId
    maker
    serialNo
    yearMade
    purchaseDate
    departmentId
    department
    locationNo
    location
    status
    note
    image1
    image2
    controller
    launchMethod
    rapierType
    widthInCm
    totalAccumulator
    totalSelector
    totalHarness
    endCapacity
    gang
    gauge
    feeder
    totalNeedles
    yarnFeederType
    needleSensor
    capacityInM
    capacityInKg
    settingSystem
    totalChamber
    usableWidth
    nominalWidth
    position
    createdBy
    createdAt
    updatedAt
  }
}

mutation CreateMachine {
  createMachine(
    input: {
      machineId: "HJ-001"
      contract: "AT1"
      description: "Head Jacquard 001"
      categoryId: "C-WH"
      type: "HTVS 8/J"
      makerId: "DO"
      serialNo: "42843"
      yearMade: 2000
      purchaseDate: "2001-11-09"
      departmentId: "TN1"
      locationNo: "TD001"
      status: "Inactive"
      note: "Weaving Head Machine"
      image1: "image.png"
      controller: "S500"
      totalHarness: 100
      endCapacity: 2688
    }
  ) {
    success
    data {
      machineId
      contract
      description
      categoryId
      type
      makerId
      serialNo
      yearMade
      purchaseDate
      departmentId
      locationNo
      status
      note
      image1
      image2
      controller
      launchMethod
      rapierType
      widthInCm
      totalAccumulator
      totalSelector
      totalHarness
      endCapacity
      gang
      gauge
      feeder
      totalNeedles
      yarnFeederType
      needleSensor
      capacityInM
      capacityInKg
      settingSystem
      totalChamber
      usableWidth
      nominalWidth
      position
      createdBy
      createdAt
      updatedAt
    }
    errors {
      message
      field
      code
    }
  }
}

mutation UpdateMachine {
  updateMachine(
    input: {
      machineId: "HJ-001"
      contract: "AT1"
      description: "Head Jacquard 001"
      categoryId: "C-WH"
      type: "HTVS 8/J"
      makerId: "DO"
      serialNo: "42843"
      yearMade: 2000
      purchaseDate: "2001-11-11"
      departmentId: "TN1"
      locationNo: "TD001"
      status: "Active"
      note: "Weaving Head Machine"
      image1: "image.png"
      controller: "S500"
      totalHarness: 100
      endCapacity: 2688
    }
  ) {
    success
    data {
      machineId
      contract
      description
      categoryId
      type
      makerId
      serialNo
      yearMade
      purchaseDate
      departmentId
      locationNo
      status
      note
      image1
      image2
      controller
      launchMethod
      rapierType
      widthInCm
      totalAccumulator
      totalSelector
      totalHarness
      endCapacity
      gang
      gauge
      feeder
      totalNeedles
      yarnFeederType
      needleSensor
      capacityInM
      capacityInKg
      settingSystem
      totalChamber
      usableWidth
      nominalWidth
      position
      createdBy
      createdAt
      updatedAt
    }
    errors {
      message
      field
      code
    }
  }
}

mutation DeleteMachine {
  deleteMachine(machineId: "HJ-001", contract: "AT1") {
    success
    data {
      machineId
      contract
      description
    }
    errors {
      message
      field
      code
    }
  }
}

## DDP

### GRAPHQL

## SPT

### GRAPHQL
