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

### **Vehicle**

query getAllVehicles{
  getAllVehicles{
    vehicleId
    vehicleName
    weightCapacity
  }
}

mutation createVehicle{
  createVehicle(input:{
    vehicleId:"HINO"
    vehicleName:"HINO"
    weightCapacity:2000
  }){
    vehicleId
    vehicleName
    weightCapacity
  }
}

mutation updateVehicle{
  updateVehicle(input:{
    vehicleId:"HINO"
    vehicleName:"hino"
    weightCapacity:2500
  }){
    vehicleId
    vehicleName
    weightCapacity
  }
}

mutation deleteVehicle{
  deleteVehicle(vehicleId:"HINO"){
    vehicleId
    vehicleName
    weightCapacity
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

mutation createShipping{
  createShipping(input:{
    shippingId:""
    expeditionId:"HIB"
    vehicleId:"TRCK"
    destinationId:"JKT"
    rate:500000
    multidropRate:500000
  })
  {
    shippingId
    expeditionId
    vehicleId
    destinationId
    rate
    multidropRate
  }
}

mutation updateShipping{
  updateShipping(input:{
    shippingId:"S15"
    expeditionId:"HIB"
    vehicleId:"TRCK"
    destinationId:"JKT"
    rate:480000
    multidropRate:48000
  })
  {
    shippingId
    expeditionId
    vehicleId
    destinationId
    rate
    multidropRate
  }
}

mutation deleteShipping{
  deleteShipping(shippingId:"S15"){
    shippingId
  }
}

query getTarif{
  getTarif(isNormalPrice:"Y", vehicleId:"TRCK",expeditionId:"POS", reqNo:"1"){
    rate
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

mutation splitRequisition{
  splitRequisition(input:{
    reqNo:"11"
    requisitionDate:"2021-09-22"
    rollQty:30
    meter:900
    weight:300
    volume:30
    reqNoSplit:"11-S1"
    rollQtySplit:30
    meterSplit:900
    weightSplit:300
    volumeSplit:30
  }){
    reqNo
    rollQty
    meter
    weight
    volume
  }
}

mutation deleteRequisition{
  deleteRequisition(reqNo:"13"){
    reqNo
  }
}

### **Assign**

query getAllAssign{
  getAllAssigns{
    assignId
    assignDate
    createdBy
    tipe
  }
}

query getAssign{
  getAssign(assignDate:"2021-09-27", assignId:"C1"){
    assignId
    assignDate
    createdBy
    tipe
  }
}

query getMaxAssignId{
  getMaxAssignId(tipe:"Combine"){
    assignId
  }
}

mutation createAssign{
  createAssign(input:{
    assignId: "C1"
    assignDate: "2021-10-01"
    tipe:"Combine"
  })
  {
    assignId
    assignDate
    createdBy
    tipe
  }
}

mutation deleteAssign{
  deleteAssign(assignDate:"2021-10-01" assignId:"C1"){
    assignId
    assignDate
    createdBy
    tipe
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

mutation updateAssignDetail{
  updateAssignDetail(input:{
    assignId:"R2"
    assignDate:"2021-09-29"
    reqNo:"9"
    requisitionDate:"2021-09-22"
    tipe:"Retail"
    expeditionId:"POS"
    vehicleId:"TRCK"
    licensePlate:"D 99"
    driverName:"Sembilan"
    nomorResi:"99999999"
    isNormalPrice:"Y"
    totalPrice:1100000
    ppn:"Y"
    price:1000000
  })
  {
    assignId
    assignDate
    totalPrice
  }
}

mutation deleteAssignDetail{
  deleteAssignDetail(input:{
    assignId:"R2"
    assignDate:"2021-09-29"
    reqNo:"10"
    requisitionDate:"2021-09-22"
    tipe:"Retail"
  })
  {
    assignId
    assignDate
    reqNo
    requisitionDate
  }
}
### **Unassign View**

query getAllUnassignViews{
  getAllUnassignViews{
    reqNo
    contract
    destinationId
    destinationName
    customerId
    customerName
    requisitionDate
    rollQty
    meter
    weight
    volume
  }
}

### **Assign View**

query getAllAssignViews{
  getAllAssignViews{
    assignId
    reqNo
    assignDate
    requisitionDate
    contract
    customerId
    destinationId
    customerName
    destinationName
    totalRoll
    totalWeight
    totalVolume
    status
  }
}

#### **PPN**

query getPPN{
  getPPN(expeditionId:"POS"){
    expeditionId
    ppn
  }
}




