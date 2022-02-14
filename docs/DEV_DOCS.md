# Project Structure

> **Filename**
>
> - Use lowercase with hypens
> - Max Length: 27 chars (excl. the extension)
> - Singular
> - Format: [IFS|PROJECT_CODE]-[TABLE/VIEW_NAME].[SEQ].[vw].ts
>
> </br>

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
│                   ifs-inv-trans-history.vw.ts     [VIEW:IFS] # View only
│                   production-plan.1.vw.ts         [VIEW]
│                   production-plan.ts              [TABLE]
│                   production-plan.vw.ts           [VIEW]
│               apm-machine-category.in.ts          [INPUT_TYPE]
│               apm-machine-category.rv.ts          [RESOLVER]
│               ifs-inv-trans-history.rv.ts         [RESOLVER] # No mutation, query only
│               production-plan.in.ts               [INPUT_TYPE]
│               production-plan.rv.ts               [RESOLVER]
│               README.md                           [SCOPES]
│               TEST_CASES.md                       [TEST_CASE]
|
|   CHANGELOG.md                                    [CHANGELOG]
|   README.md
```

# Entity / Input Type Script Generator

Follow these steps:

1. Open SQLPlus\* / TOAD application and run the following command:

```SQL
SELECT ATJ_Util_API.Get_Entity_Input_Type_Script(<SCHEMA_NAME>, <TABLE/VIEW_NAME>) AS "Script"
FROM   DUAL;
```

2. Paste the result into a new Entity file (and a new Input Type file if it's a Table).
3. Specify the primary column(s) manually if it's a View.
4. Recheck and save.

# Error Handling

## In Oracle Database

```sql
FUNCTION ABC(...) RETURN ... AS
  ...
BEGIN
  ...
  IF (...) THEN                           --- validation
    RAISE_APPLICATION_ERROR(-20001, '');
  END IF;
  ...
  RETURN ...;
EXCEPTION
  WHEN NO_DATA_FOUND THEN                 -- specific error
    RAISE_APPLICATION_ERROR(-20001, '');
  WHEN DUP_VAL_ON_INDEX THEN              -- specific error
    RAISE_APPLICATION_ERROR(-20001, '');
  WHEN OTHERS THEN                        --- general error
    RAISE;
END;
```

## Javascript/TypeScript

```javascript
const abc = () => {
  try {
    ...
    return result;
  } catch (err) {
    throw new Error(mapError(err));
  }
}
```

# Git Branch Naming

Use lowercase with hypens

- `main`
- `develop`
- `feature/`[PROJECT_NAME]</br>
  e.g. feature/apm
- `bugfix/`[ISSUE_NAME]</br>
  e.g. bugfix/more-gray-shades
- `hotfix/`[ISSUE_NAME]</br>
  e.g. hotfix/increase-scaling-threshold
- `release/`[APP_VERSION]</br>
  e.g. release/v1.0.0

# References

- [Coding Standards](https://github.com/angular/components/blob/master/CODING_STANDARDS.md)
