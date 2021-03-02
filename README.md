# AIS - SERVER

## Installation

1. Make sure Postgres & Redis are running

2. Create `.env.development` & `.env.production` by duplicating from `.env.example`, then edit both files as needed

    ```bash
    $ cd server
    $ cp .env.example.development .env.development
    $ cp .env.example.production .env.production
    $ code .env.development # edit as needed
    $ code .env.production # edit as needed
    ```

3. Edit file `dbInit.sql` as needed

4. Do initial database setup

    ```bash
    $ yarn db:setup
    ```

5. Run Migration

    ```bash
    $ yarn db:migrate
    ```

6. Seed database with mock data (*Optional*)

    ```bash
    $ yarn db:seed:up
    ```

7. Run server

    ```bash
    $ yarn dev
    ```

8. Login as `john.doe` (password: `123456`)
