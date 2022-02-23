<a name="1.12.0"></a>

# [1.12.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/88) (2022-02-23)

### Features

- [**M009**] **inspek-qc:** Add Inspek QC module.

<a name="1.11.0"></a>

# [1.11.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/86) (2022-02-18)

### Features

- [**M008**] **benang-sisa:** add BE for Benang Sisa Apps

<a name="1.10.1"></a>

# [1.10.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/84) (2022-02-17)

### Features

- [**M003**] **opname:** modify param opname loc resolver

<a name="1.10.0"></a>

# [1.10.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/82) (2022-02-14)

### Features

- [**M003**] **opname:** add new queries at opname status resolver

<a name="1.9.0"></a>

# [1.9.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/80) (2022-02-14)

### Features

- add new utility: **custom-email** to replace the email that not using ateja.co.id domain.
- [**HR**] **employee:** add new resolvers.
- [**PRC**] **purchase-requisition-line:** add new entity, input, and resolver.
- [**M001**] **apm:** add new entities, input types, and resolvers for maintenance log module.
- [**M001**] **apm:** rename some resolvers.

### Bug Fixes

- **dev-docs:** fix typos.
- **dev-docs:** add new section **Entity / Input Type Script Generator**.
- [**M001**] **apm:** fix typos.
- [**M006**] **yarn-eff:** fix file path.

<a name="1.8.0"></a>

# [1.8.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/78) (2022-01-17)

### BREAKING CHANGES

- [**HRD**] **employee:** replace entity source from `ATJ_EMPLOYEE_MV` to `ATJ_EMPLOYEE_V`.
- [**MANUF**] **department:** replace entity source from `ATJ_DEPARTMENT_MV` to `ATJ_DEPARTMENT_V`.

### Features

- [**CORE**] **auth:** refactor to grant specific users to access AGT site.
- [**HR**] **employee:** add new resolver to get specific employee using custom email.
- [**INV**] **internal-customer:** change the resolver name.
- [**INV**] **internal-destination:** modify the resolver.
- [**M001**] **apm:** replace `locationNo` to `workCenterNo`.
- [**M001**] **apm:** add new fields: `nameApprLv1`, `nameApprLv2`, and `nameCreatedBy` in `apm-sp-requisition.ts` file.
- [**M001**] **apm:** make changes to get a `name` and `email`.
- [**M002**] **ddp:** add new line space in `bppf.ts` file.

### Bug Fixes

- fix the module alias for `@/modules`.
- [**CORE**] **user:** hashed the password each time someone updates the user data.
- [**INV**] **intenal-destination:** add `contract` field and replace `objId` to `objKey`.

<a name="1.7.0"></a>

# [1.7.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/73) (2022-01-10)

### Features

- [**M006**] YarnEff: Add new module Efisiensi Benang.
- [**M007**] DailyProd: Add new module Daily Production.

<a name="1.6.0"></a>

# [1.6.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/74) (2022-01-10)

### BREAKING CHANGES

- Chore: Update `typescript` from version `4.4.2` to version `4.4.4`.
- Refactor: Move all files related to the inventory module into `/src/modules/inventory`.
- Refactor: Rename all files related to the IFS tables or views to follow the conventions.

### Features

- [**M001**] APM: Add new entities, inputs, and resolvers for Spare Part Requisitions module.

<a name="1.5.0"></a>

# [1.5.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/70) (2021-12-29)

### Features

- [**M005**] BPPF: penambahan BE untuk module BPPF.

<a name="1.4.0"></a>

# [1.4.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/68) (2021-12-27)

### Features

- [**M004**] WindingQc: penambahan BE untuk module WindingQc.

<a name="1.3.1"></a>

# [1.3.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/65) (2021-11-26)

### Features

- [**T001**] SPT: Penambahan query utk view assignment user gudang.

<a name="1.3.0"></a>

# [1.3.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/63) (2021-11-18)

### Features

- [**M002**] DDP: Penambahan kolom, untuk feature lot bahan benang.
- [**M002**] DDP: Penambahan virtual kolom, untuk feature total netto timbangan 1 dan 2.

<a name="1.2.8"></a>

# [1.2.8](https://gitlab.com/atjdev/ezio-api/-/merge_requests/61) (2021-11-18)

### Features

- [**M002**] DDP: Penambahan kolom, untuk menentukan status pengerjaan BPO (khusus AMI).

<a name="1.2.7"></a>

# [1.2.7](https://gitlab.com/atjdev/ezio-api/-/merge_requests/59) (2021-11-16)

### Features

- [**T001**] SPT: Penambahan untuk advanced search.

<a name="1.2.6"></a>

# [1.2.6](https://gitlab.com/atjdev/ezio-api/-/merge_requests/57) (2021-11-15)

### Features

- [**M002**] DDP: Penambahan untuk advance search.

<a name="1.2.5"></a>

# [1.2.5](https://gitlab.com/atjdev/ezio-api/-/merge_requests/55) (2021-11-08)

### Features

- [**M002**] DDP: Bug fix api timbangan auxiliaries when same part occur + add input.

<a name="1.2.4"></a>

# [1.2.4](https://gitlab.com/atjdev/ezio-api/-/merge_requests/53) (2021-11-04)

### Features

- [**M002**] DDP: Kolom NO menjadi mandatory.

<a name="1.2.3"></a>

# [1.2.3](https://gitlab.com/atjdev/ezio-api/-/merge_requests/51) (2021-11-01)

### Features

- [**T001**] SPT: Add contract param for assignViews & unassignViews query.
- [**T001**] SPT: Add lock requisition module for kendaraan.

<a name="1.2.2"></a>

# [1.2.2](https://gitlab.com/atjdev/ezio-api/-/merge_requests/49) (2021-10-26)

### Features

- [**T001**] SPT: Add "via" column for requisition resolver and related.views

<a name="1.2.1"></a>

# [1.2.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/47) (2021-10-23)

### Features

- [**T001**] SPT: add ds, divisi, and space column for requisition.
- [**T001**] SPT: add nopol langsir for surat ijin keluar.

<a name="1.2.0"></a>

# [1.2.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/45) (2021-10-12)

### Features

- [**M002**] DDP: add column for sub resep.
- [**M002**] DDP: change API for sub resep to auto generate in auxiliaries.

<a name="1.1.5"></a>

# [1.1.5](https://gitlab.com/atjdev/ezio-api/-/merge_requests/43) (2021-10-08)

### Bug Fixes

- [**T001**] SPT: Add expedition name and vehicle name column for assign requisition view.

<a name="1.1.4"></a>

# [1.1.4](https://gitlab.com/atjdev/ezio-api/-/merge_requests/41) (2021-10-07)

### BREAKING CHANGES

- Modify deployment script `deploy.sh` to execute the script inside the server.

### Features

- [**M001**] APM: Add some new fields for Machine table & view to accomodate more additional informations.
- [**M001**] APM: Update `TEST_CASES.md`.

<a name="1.1.3"></a>

# [1.1.3](https://gitlab.com/atjdev/ezio-api/-/merge_requests/39) (2021-10-06)

### Bug Fixes

- [**M002**] DDP: add more column.

<a name="1.1.2"></a>

# [1.1.2](https://gitlab.com/atjdev/ezio-api/-/merge_requests/37) (2021-10-05)

### Bug Fixes

- [**T001**] SPT: add custom message.

<a name="1.1.1"></a>

# [1.1.1](https://gitlab.com/atjdev/ezio-web/-/merge_requests/16) (2021-09-29)

### Bug Fixes

- [**T001**] SPT: Synchronize version with FE, add test case.

<a name="1.1.0"></a>

# [1.1.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/31) (2021-09-29)

### Features

- [**T001**] SPT (Sistem Pengaturan Transportasi) - Base
- Refactor and add some improvements.

<a name="1.0.0"></a>

# [1.0.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/24) (2021-09-08)

### Features

- [**M002**] DDP (Dyeing Data Processing) - Base.
