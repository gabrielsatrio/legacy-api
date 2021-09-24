# TEST CASES

## SPT

### GRAPHQL

#### **Destinations**

query getAllDestination{
  getAllDestinations{
    destinationId
    destinationName
  }
}

query getDestination{
  getDestination(destinationId:"JKT"){
    destinationId
    destinationName
  }
}

mutation createDestination{
  createDestination(input:{
    destinationId:"BGR",
    destinationName:"Bogor"
  })
  {
    destinationId
    destinationName
  }
}

mutation updateDestination{
  updateDestination(input:{
    destinationId:"BGR",
    destinationName:"Bogor1"
  })
  {
    destinationId
    destinationName
  }
}

mutation deleteDestination{
  deleteDestination(destinationId:"BGR"){
    destinationId
    destinationName
  }
}

#### **IFS Customer Info**

query getAllCustomerInfo{
  getAllCustomerInfo{
    customerId
    customerName
  }
}

#### **Expedition**

query getAllExpeditions{
  getAllExpeditions{
    expeditionId
    expeditionName
  }
}

mutation createExpedition{
  createExpedition(input:{
    expeditionId:"JNE",
    expeditionName:"JNE Indonesia"
  })
  {
    expeditionId
    expeditionName
  }
}

mutation updateExpedition{
  updateExpedition(input:{
    expeditionId:"JNE",
    expeditionName:"JNE"
  })
  {
    expeditionId
    expeditionName
  }
}

mutation deleteExpedition{
  deleteExpedition(expeditionId:"JNE"){
    expeditionId
    expeditionName
  }
}

#### **Shipping Rates**

query getAllShipping{
  getAllShippings{
    shippingId
    expeditionId
    vehicleId
    destinationId
    rate
    multidropRate
  }
}


#### **Tarif**

query getTarif{
  getTarif(isNormalPrice:"Y", vehicleId:"TRCK",expeditionId:"POS", reqNo:"1"){
    rate
  }
}

#### **Assign Detail**

query getAllAssignDetail{
  getAllAssignDetail{
    assignId
    assignDate
    reqNo
    requisitionDate
    expeditionId
    vehicleId
    licensePlate
    driverName
    nomorResi
    isNormalPrice
    totalPrice
    totalPrice
    nopolLangsir
  }
}

query getAssignDetail{
  getAssignDetail(reqNo:"1", assignId:"C1"){
    assignId
    assignDate
    reqNo
    requisitionDate
    expeditionId
    vehicleId
    licensePlate
    driverName
    nomorResi
    isNormalPrice
    totalPrice
    nopolLangsir
  }
}

query getTarif{
  getTarif(isNormalPrice:"Y", vehicleId:"TRCK",expeditionId:"POS", reqNo:"1"){
    rate
  }
}

mutation createAssignDetail{
  createAssignDetail(input: {
    assignId:"C1",
    assignDate: "2021-09-24",
    reqNo:"1",
    requisitionDate: "2021-09-24"
  })
  {
    assignId
  }
}

#### **PPN**

query getPPN{
  getPPN(expeditionId:"POS"){
    expeditionId
    ppn
  }
}

#### **Requisitions**

query getAllRequisitions{
  getAllRequisitions{
    reqNo
    destinationId
    customerId
    requisitionDate
    rollQty
    meter
    weight
    volume
    contract
    notes
    createdBy
    createdAt
    updatedAt
  }
}

mutation createRequisition{
  createRequisition(input:{
    reqNo:""
    destinationId:"JKT"
    customerId:"D-BDG-0318"
    requisitionDate:"2021-09-24"
    rollQty:50
    meter:1500
    weight:500
    volume:50
    contract:"AT2"
    notes:"notes"
  })
  {
    reqNo
    destinationId
    customerId
    requisitionDate
    rollQty
    meter
    weight
    volume
    contract
    notes
  }
}

mutation updateRequisition{
  updateRequisition(input:{
    reqNo:"13"
    destinationId:"JKT"
    customerId:"D-BDG-0318"
    requisitionDate:"2021-09-24"
    rollQty:52
    meter:1500
    weight:500
    volume:50
    contract:"AT2"
    notes:"notes"
  })
  {
    reqNo
    rollQty
  }
}

mutation deleteRequisition{
  deleteRequisition(reqNo:"13"){
    reqNo
  }
}


