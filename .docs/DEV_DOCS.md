# Project Structure

> **Filename**
> - Lowercase with hypens
> - Max Length: 27 chars (excluding the extension)
> - Format: [IFS|PROJECT_CODE]-[TABLE/VIEW_NAME].[SEQ].[vw].ts
>
></br>

```
root
│   .docs
|       DEV_DOCS.md
|       ISSUE_TEMPLATE.md
|       PULL_REQUEST_TEMPLATE.md
|
└── src
|   |
│   └── modules
|       |
│       └── manufacturing
|           |
│           └── entities
│                   apm-machine-category.ts         [TABLE:PROJECT]
│                   apm-machine-category.vw.ts      [TABLE:PROJECT]
│                   ifs-inv-trans-history.ts        [TABLE:IFS]
│                   ifs-inv-trans-history.vw.ts     [VIEW:IFS]
│                   production-plan.1.vw.ts         [VIEW]
│                   production-plan.ts              [TABLE]
│                   production-plan.vw.ts           [VIEW]
│               apm-machine-category.dr.ts          [DATA_RESPONSE]
│               apm-machine-category.in.ts          [INPUT_TYPE]
│               apm-machine-category.rv.ts          [RESOLVER]
│               ifs-inv-trans-history.dr.ts         [DATA_RESPONSE]
│               ifs-inv-trans-history.in.ts         [INPUT_TYPE]
│               ifs-inv-trans-history.rv.ts         [RESOLVER]
│               production-plan.dr.ts               [DATA_RESPONSE]
│               production-plan.in.ts               [INPUT_TYPE]
│               production-plan.rv.ts               [RESOLVER]
│               README.md                           [SCOPES]
│               TEST_CASES.md                       [TEST_CASE]
|
|   CHANGELOG.md                                    [CHANGELOG]
|   README.md
```

# Git Branch Naming

Use lowercase with hypens

* `main`
* `develop`
* `feature/`[PROJECT_NAME]</br>
  e.g. feature/apm
* `bugfix/`[ISSUE_NAME]</br>
  e.g. bugfix/more-gray-shades
* `hotfix/`[ISSUE_NAME]</br>
  e.g. hotfix/increase-scaling-threshold
* `release/`[APP_VERSION]</br>
  e.g. release/v1.0.0

# References

* [Coding Standards](https://github.com/angular/components/blob/master/CODING_STANDARDS.md)
