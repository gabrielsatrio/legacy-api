# AIS - SERVER

## Installation

1. Make sure **OracleXE** (>= 12c) & **Redis** services are running

2. Create `.env.development` & `.env.production` by duplicating from `.env.example.*`, then edit both files as needed

    ```bash
    $ cp .env.example.development .env.development
    $ cp .env.example.production .env.production
    $ code .env.development # edit as needed
    $ code .env.production # edit as needed
    ```

3. Run server

    ```bash
    $ yarn dev # development
    $ yarn start # production
    ```
