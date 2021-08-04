# AIS - SERVER

## Installation

1. Make sure **OracleXE** (>= 12c) & **Redis** services are running.

2. Create `.env.development` & `.env.production` by duplicating from `.env.example.*`, then edit both files as needed.

    ```bash
    > cp .env.example.development .env.development
    > cp .env.example.production .env.production
    > code .env.development # edit as needed
    > code .env.production # edit as needed
    ```

3. Run server.

    ```bash
    > yarn dev # development
    > yarn start # production
    ```


## Deployment

1. Make sure all of the parameters in `.env.production` file are valid.

2. Build and create docker image.

    ```bash
    > yarn build:docker
    ```

3. Check if the services can be accessed and have no issues (http://localhost:4000).

4. Deploy to the server.

    ```bash
    > yarn deploy
    ```

> #### **Express way**
>
>   ```bash
>   > yarn deploy:full
>   ```
>
> <p><em>WARNING</em>:</p>
> <p><em>Even the build failed, the new build will replace the existing one in production server! Don't use this command if you are not sure!</em></p>
