# TEST CASES

## MOQ

### GRAPHQL

```
fragment MoqFragment on Moq {
  orderNo
  lineNo
  relNo
  minQty
  gabungCo
  rowId
}

fragment MoqViewFragment on MoqView {
  orderNo
  lineNo
  relNo
  minQty
  gabungCo
  rowId
}

query Moq {
  getMoq(orderNo:"10C/001/1220", lineNo:"16", relNo:"1") {
    ...MoqViewFragment
  }
}

mutation CreateMoq {
  createMoq(
    input: {
      orderNo: "10C/TES"
      lineNo: "1"
      relNo: "1"
      minQty: 200
      gabungCo: "10C/TES1"
    }
  ) {
    ...MoqFragment
  }
}

query ChecMoqExist {
  checMoqExist(orderNo: "10C/001/1220", lineNo: "1", relNo: "1")
}

mutation UpdateMoq {
  updateMoq(
    input: {
      orderNo: "10C/TES"
      lineNo: "1"
      relNo: "1"
      minQty: 200
      gabungCo: "10C/TES1"
    }
  ) {
    ...MoqFragment
  }
}

mutation DeleteMoq {
  deleteMoq(orderNo: "10C/001/1220", lineNo: "1", relNo: "1") {
    ...MoqFragment
  }
}
```

