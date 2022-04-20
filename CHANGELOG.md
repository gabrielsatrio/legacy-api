<a name="2.1.1"></a>

# [2.1.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/122) (2022-04-20)

### Bug Fixes

- fix: add new column department for benang sisa.
- fix: get user department from session to add value for department column.

<a name="2.1.0"></a>

# [2.1.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/120) (2022-04-14)

### BREAKING CHANGES

- refactor: move `data-sources.ts` from `config` to `database`.

### Bug Fixes

- fix: cannot find data source.
- fix: helmet issue after updating to latest version.
- fix: remove duplicate line.

### Other Changes

- build: implement vscode project settings.
- ci: add new configuration and improvement.
- docs: reorder `package.json`.

<a name="2.0.0"></a>

# [2.0.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/118) (2022-04-12)

### BREAKING CHANGES

- chore: upgrade all dependencies
- follow [this](https://github.com/typeorm/typeorm/pull/8616) guideline to use new version of **TypeORM**.
- follow [this](https://www.conventionalcommits.org/en/v1.0.0/) guideline to create a commit message.

### Bug Fixes

- [**M001**] **machines**: fix permission.

<a name="1.21.2"></a>

# [1.21.2](https://gitlab.com/atjdev/ezio-api/-/merge_requests/116) (2022-04-07)

### Bug Fixes

- [**CORE**] **auth**: remove **AT3** and **AT5** from contract list.
- [**M001**] **apm-work-center**: fix ORA-02046.
- [**M001**] **apm-work-center**: exclude data with category **HD** and **HJ**.

<a name="1.21.1"></a>

# [1.21.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/114) (2022-04-07)

### Bug Fixes

- [**M013**] **sp-requisitions**: fix invalid path.

<a name="1.21.0"></a>

# [1.21.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/112) (2022-04-04)

### Features

- add resolver to change user password (all users).
- [**M012**] **daily-report-dyg**: add new project.

### Other Changes

- set password minimum length to 6 characters.

<a name="1.20.1"></a>

# [1.20.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/110) (2022-04-01)

### Bug Fixes

- [**M001**] **machine-work-center**: rename resovler.

<a name="1.20.0"></a>

# [1.20.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/108) (2022-04-01)

### Features

- **employee**: add new custom field resolver to get display name for **Select's** **labelKey** prop.
- **department**: add new resolvers.
- **department**: add new custom field resolver to get alternate description for **Select's** **labelKey** prop.

### Bug Fixes

- [**M001**] **machine-work-center**: removed and replaced by IFS work center.

<a name="1.19.0"></a>

# [1.19.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/106) (2022-03-28)

### Features

- extract `uploadFile` resolver into separate file.
- create new utility/hepler to get date string.

### Bug Fixes

- [**M001**] **machine**: enlarge column size.

<a name="1.18.0"></a>

# [1.18.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/104) (2022-03-25)

### Features

- [**M011**] **jadwal-emad**: Add entity and resolvers for module: jadwal-emad.

<a name="1.17.0"></a>

# [1.17.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/102) (2022-03-23)

### BREAKING CHANGES

- Ability to upload file.

### Features

- [**CORE**] **server**: fix path for upload public folder.
- [**HR**] **employee**: add new resolver to get data by grade and work location.
- [**M001**] **apm-machine**: add new resolver to upload image (WIP).
- [**M001**] **apm-requisition**: add new column/field: `rejectReason`.
- [**M001**] **apm-requisition-line**: add 2 new columns/fields: `remainingDesc` and `remainingQty`.
- [**M001**] **apm-maintenance**: add new resolver to get specific data with category id equaql to **SNP**.

### Bug Fixes

- [**M001**] **apm-machine**: makes `workCenterNo` nullable.
- [**M001**] **apm-work-center**: add where clause to check `workCenterNo` is not null.

<a name="1.16.0"></a>

# [1.16.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/100) (2022-03-21)

### Features

- [**F001**] MOQ - BASE
- [**SNM**] **customer-order-line-outstanding**: add new resolvers.

<a name="1.15.0"></a>

# [1.15.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/98) (2022-03-12)

### BREAKING CHANGES

- replace `getManagers` resolver into `getEmployeesByGrade` resolver

### Features

- [**M001**] **apm-machine-wc**: add sorting by work center for the result.
- [**M001**] **apm-machine-wc**: add new condition for `getAvailMachWcForHeadLoomByContract` resolver.

<a name="1.14.2"></a>

# [1.14.2](https://gitlab.com/atjdev/ezio-api/-/merge_requests/96) (2022-03-08)

### Bug Fixes

- [**M001**] **spare-part-req**: fix the issue related to data not being synchronized with MR Spare Part Map.

<a name="1.14.1"></a>

# [1.14.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/94) (2022-03-08)

### Bug Fixes

- **server**: update JRS REST API path

<a name="1.14.0"></a>

# [1.14.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/92) (2022-03-07)

### Features

- [**M003**] **opname**: add exclude FB parameter.
- [**M003**] **opname**: add expected number of completion & item query.
- [**M010**] **pengiriman-kain**: add pengiriman kain module.

<a name="1.13.0"></a>

# [1.13.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/90) (2022-03-07)

### BREAKING CHANGES

- add new npm package `request` (version: `2.88.2`).
- add new environment variables inside `.env` file.
- add new empty `tmp` folder.
- ability to run reports from JasperReports Server (format: PDF and XLSX).
- remove `.env.example.test` file.

#### New Utils

- **get-report**: to get output report from JasperReports server.

### Features

- [**CORE**] **server**: add new resolver to receive request to get/run report from JasperReports server (REST API).
- [**M001**] **apm-machine-wc**: add new resolver: `getAvailMachWcForHeadLoomByContract`.
- [**M001**] **apm-machine-wc**: add `try-catch` for each resolver that use `getConnection().query()`.
- [**M001**] **apm-machine**: add new validation to check if the data already exists in `createMachine` resovler.
- [**M001**] **apm-sp-requisition-line-mach**: add new validation to check if the data already exists in `createSPRequisLineMach` resovler.
- [**M001**] **apm-sp-requisition-line**: add new validation to check if the data already exists in `createSPRequisitionLine` resovler.

<a name="1.12.0"></a>

# [1.12.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/88) (2022-02-23)

### Features

- [**M009**] **inspek-qc**: Add Inspek QC module.

<a name="1.11.0"></a>

# [1.11.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/86) (2022-02-18)

### Features

- [**M008**] **benang-sisa**: add BE for Benang Sisa Apps

<a name="1.10.1"></a>

# [1.10.1](https://gitlab.com/atjdev/ezio-api/-/merge_requests/84) (2022-02-17)

### Features

- [**M003**] **opname**: modify param opname loc resolver

<a name="1.10.0"></a>

# [1.10.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/82) (2022-02-14)

### Features

- [**M003**] **opname**: add new queries at opname status resolver

<a name="1.9.0"></a>

# [1.9.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/80) (2022-02-14)

### Features

- add new utility: **custom-email** to replace the email that not using ateja.co.id domain.
- [**HR**] **employee**: add new resolvers.
- [**PRC**] **purchase-requisition-line**: add new entity, input, and resolver.
- [**M001**] **apm**: add new entities, input types, and resolvers for maintenance log module.
- [**M001**] **apm**: rename some resolvers.

### Bug Fixes

- **docs**: fix typos.
- **docs**: add new section **Entity / Input Type Script Generator**.
- [**M001**] **apm**: fix typos.
- [**M006**] **yarn-eff**: fix file path.

<a name="1.8.0"></a>

# [1.8.0](https://gitlab.com/atjdev/ezio-api/-/merge_requests/78) (2022-01-17)

### BREAKING CHANGES

- [**HRD**] **employee**: replace entity source from `ATJ_EMPLOYEE_MV` to `ATJ_EMPLOYEE_V`.
- [**MANUF**] **department**: replace entity source from `ATJ_DEPARTMENT_MV` to `ATJ_DEPARTMENT_V`.

### Features

- [**CORE**] **auth**: refactor to grant specific users to access AGT site.
- [**HR**] **employee**: add new resolver to get specific employee using custom email.
- [**INV**] **internal-customer**: change the resolver name.
- [**INV**] **internal-destination**: modify the resolver.
- [**M001**] **apm**: replace `locationNo` to `workCenterNo`.
- [**M001**] **apm**: add new fields: `nameApprLv1`, `nameApprLv2`, and `nameCreatedBy` in `apm-sp-requisition.ts` file.
- [**M001**] **apm**: make changes to get a `name` and `email`.
- [**M002**] **ddp**: add new line space in `bppf.ts` file.

### Bug Fixes

- fix the module alias for `@/modules`.
- [**CORE**] **user**: hashed the password each time someone updates the user data.
- [**INV**] **intenal-destination**: add `contract` field and replace `objId` to `objKey`.

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
