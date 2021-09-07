# TEST CASES

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
pada modul BPO pastikan bisa CRUD header dan detail ( auxiliaries dan dyestuff)
#### **BPO**
kondisi saat ini saat insert head detail automatis terisi\
untuk detail tidak perlu insert saat ini, jadi cukup query, update dan delete\
jika ingin menggunakan test case yang lain pastikan master resepnya sudah dibuat terlebih dahulu
```
# query all dan spesifik

query allBPOs{
  getAllBPOs(contract:["AMI"]){
    idNo,
    tanggal,
    partNo,
    orderNo,
    noMesin,
    lotCelup,
    liquidRatio,
    volume,
    weight,
    altReceipe,
    programNo,
    kuCount,
    sentToAux,
    contract,
    dyestuffsUses{
      idNo
    },
    auxiliariesUses{
      idNo
    }
  }
}

query allBPO{
  getBPO(contract:["AMI"],idNo:"290321/II/120",kuCount:0 ){
    idNo,
    tanggal,
    partNo,
    orderNo,
    noMesin,
    lotCelup,
    liquidRatio,
    volume,
    weight,
    altReceipe,
    programNo,
    kuCount,
    sentToAux,
    contract,
    dyestuffsUses{
      idNo
    },
    auxiliariesUses{
      idNo
    }
  }
}

# Create , update , delete
# pastikan sebelum delete hapus childnya dahulu

mutation addBPO{
  createBPO(input:{
    idNo:"290321/II/121",
    tanggal:"06/27/2019 14:22:00",
    partNo:"FD-ACHAZIO#W-E-010",
    orderNo:null,
    noMesin:"Jet II",
    lotCelup:"II/121",
    liquidRatio:3,
    volume:3,
    weight:8,
    altReceipe:"1",
    programNo:null,
    kuCount:0,
    sentToAux:0,
    contract:"AMI"
  }){
    success,
    data{
       idNo,
        tanggal,
        partNo,
        orderNo,
        noMesin,
        lotCelup,
        liquidRatio,
        volume,
        weight,
        altReceipe,
        programNo,
        kuCount,
        sentToAux,
        contract,
        dyestuffsUses{
          idNo
        },
        auxiliariesUses{
          idNo
        }
    },
    errors{
      message
    }
  }
}

mutation updateBPO{
  UpdateBPO(input:{
    idNo:"290321/II/121",
    tanggal:"06/27/2019 14:22:00",
    partNo:"FD-ACHAZIO#W-E-010",
    orderNo:null,
    noMesin:"Jet II",
    lotCelup:"II/121",
    liquidRatio:14,
    volume:13,
    weight:8,
    altReceipe:"3",
    programNo:null,
    kuCount:0,
    sentToAux:0,
    contract:"AMI"
  }){
    success,
    data{
       idNo,
        tanggal,
        partNo,
        orderNo,
        noMesin,
        lotCelup,
        liquidRatio,
        volume,
        weight,
        altReceipe,
        programNo,
        kuCount,
        sentToAux,
        contract,
        dyestuffsUses{
          idNo
        },
        auxiliariesUses{
          idNo
        }
    },
    errors{
      message
    }
  }
}

mutation deleteBPO{
  deleteBPO(idNo:"290321/II/121",contract:"AMI",kuCount:0){
    success,
    errors{
      message
    }
  }
}

# Auxiliaries

query auxiliaries{
  getBPOAuxiliaries(contract:"AMI",idNo:"290321/II/121",kuCount:0 ){
    idNo,
    partNo
  }
}

mutation updateAux{
  updateBPOAuxiliaries(input:{
    contract:"AMI",
    idNo:"290321/II/121",
    partNo:"CXCO-B01-02",
    partDesc:"BT 338",
    partActual:"A",
    persentase:1,
    total:3,
    lotBatchNo:null,
    orderNo:null,
    kuCount:0,
    beratAktual:0
  }){
    success,
    data{
      partActual
    }
  }
}

mutation deleteAux{
  deleteBPOAuxiliaries(contract:"AMI",idNo:"290321/II/121",partNo:"CXCO-B01-02",kuCount:0){
    success,
    errors{
      message
    }
  }
}

mutation deleteAux2{
  deleteBPOAuxiliaries(contract:"AMI",idNo:"290321/II/121",partNo:"CXCO-A04-01",kuCount:0){
    success,
    errors{
      message
    }
  }
}

#Dyestuff

query dyestuff{
  getBPODyestuff(contract:"AMI",idNo:"290321/II/121",kuCount:0 ){
    idNo,
    partNo
  }
}

mutation updateDye{
  updateBPODyestuff(input:{
    contract:"AMI",
    idNo:"290321/II/121",
    partNo:"CCDY-A02-02",
    partDesc:"AIZEN CATHILON RED KGL",
    kodeKuans:"QQQ",
    persentase:0.5,
    total:0.004,
    lotBatchNo:null,
    orderNo:null,
    kuCount:0
  }){
    success,
    data{
      kodeKuans
    },
    errors{
      message
    }
  }
}

mutation deleteDye{
  deleteBPODyestuff(contract:"AMI",idNo:"290321/II/121",partNo:"CCDY-A02-02",kuCount:0){
    success,
    errors{
      message
    }
  }
}

mutation deleteDye2{
  deleteBPODyestuff(contract:"AMI",idNo:"290321/II/121",partNo:"CCDY-A06-03",kuCount:0){
    success,
    errors{
      message
    }
  }
}

```
#### **Material**
berisi head dan detail, lakukan masing-masing crud pada head dan detail\
pastikan depedency master-detail sesuai

```
query getMaterials{
  getMaterials(contract:["AMI","ATD"]){
    idNo,
    contract,
    partNo,
    jenisCelup,
    lotCelup,
    hasilCounterMeter
  }
}

query getMaterialID{
  getMaterialById(contract:["AMI","ATD"], idNo:"270721/III/131"){
    idNo,
    contract,
    partNo,
    jenisCelup,
    lotCelup,
    hasilCounterMeter
  }
}

query getMaterialSO{
  getMaterialByOrderNo(contract:["AMI","ATD"], orderNo:"1373447"){
    idNo,
    contract,
    partNo,
    jenisCelup,
    lotCelup,
    hasilCounterMeter
  }
}

mutation addMaterial{
  createMaterial(input:{
    contract:"AMI",
    jenisCelup:"Piece Dye",
    idNo:"290321/II/121",
    tanggal:"06/27/2021 14:22:00",
    partNo:"FD-ZORROVINO-V-090",
    mediaCelup:null,
    hasilCounterMeter:0,
    orderNo:null,
    noMesin:"Jet III",
    jmlMediaCelup: null,
    tara:1,
    bruto:1,
    netto:1,
    note: null,
    lotCelup:"III/121"
  }){
    success,
    data{
      contract,
      idNo,
      tanggal,
      note
    },
    errors{
      message
    }
  }
}


mutation updateMaterial{
  UpdateMaterial(input:{
    contract:"AMI",
    jenisCelup:"Piece Dye",
    idNo:"290321/II/121",
    tanggal:"06/27/2021 14:22:00",
    partNo:"FD-ZORROVINO-V-090",
    mediaCelup:null,
    hasilCounterMeter:0,
    orderNo:null,
    noMesin:"Jet III",
    jmlMediaCelup: null,
    tara:1,
    bruto:1,
    netto:1,
    note: "dzulumat",
    lotCelup:"III/121"
  }){
    success,
    data{
      contract,
      idNo,
      tanggal,
      note
    },
    errors{
      message
    }
  }
}

mutation deteleMaterial{
  deleteMaterial(contract:"AMI",idNo:"290321/II/121"){
    success,
    errors{
      message
    }
  }
}

#######material use

query materialUse{
  getMaterialUseByKey(contract:"AMI",idNo:"290321/II/121"){
    idNo,
    partNo,
    length,
    lotBatchNo
  }
}

mutation addMaterialUse{
  createMaterialUse(input:{
    contract:"AMI",
    idNo:"290321/II/121",
    lotBatchNo:"AM/KS09/210319-61",
    partNo:"FP-MIRABELLEKNIT-XX-0",
    length:160,
    orderNo:null,
    tubeDyeing:"Tube Kiri",
    no:1
  }){
    success,
    data{
      idNo,
      partNo,
      length,
      lotBatchNo
    },errors{
      ,message
    }
  }
}

mutation updateMaterialUse{
  updateMaterialUse(input:{
    contract:"AMI",
    idNo:"290321/II/121",
    lotBatchNo:"AM/KS09/210319-61",
    partNo:"FP-MIRABELLEKNIT-XX-0",
    length:170,
    orderNo:null,
    tubeDyeing:"Tube Kiri",
    no:1
  }){
    success,
    data{
      idNo,
      partNo,
      length,
      lotBatchNo
    },errors{
      ,message
    }
  }
}

mutation deleteMaterialUse{
  deleteMaterialUse(contract:"AMI",idNo:"290321/II/121", no:1){
    success,
    errors{
      message
    }
  }
}
```
#### **Mesin**
query saja
```
query getMesin {
  getDDPMachine(contract:["AMI"]){
    mesin,
    contract
  }
}

query getMesinByMesin{
 getDDPMachineByMesin(contract:["AMI"], mesin:"Jet I"){
  mesin,
  contract
	}
}
```

## SPT

### GRAPHQL
