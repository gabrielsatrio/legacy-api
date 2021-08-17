# EZIO - API SERVER

## Installation

1. Make sure **OracleXE** (>= 12c) & **Redis** services are running.

2. Create `.env.development`, `.env.test ` & `.env.production` by duplicating from `.env.example.*`, then edit both files as needed.

    ```bash
    > cp .env.example.development .env.development
    > cp .env.example.test .env.test
    > cp .env.example.production .env.production
    > code .env.development # edit as needed
    > code .env.test # edit as needed
    > code .env.production # edit as needed
    ```

3. Run server.

    ```bash
    > yarn dev # development
    > yarn start # production
    ```


## Deployment

1. Make sure all of the parameters inside `.env.production`/`.env.test` file are valid.

2. Build and create docker image.

    ```bash
    > yarn build:docker:prod # or yarn build:docker:test
    ```

3. Check if there are any errors in the docker logs before deploying to the production/testing server.

4. Deploy to the server.

    ```bash
    > yarn deploy:prod # or yarn deploy:test
    ```

> #### **Express way**
>
>   ```bash
>   > yarn build:deploy:prod # or yarn build:deploy:test
>   ```
>
> <p><em>WARNING</em>:</p>
> <p><em>Even the build failed, the new build will replace the existing one in production/testing server! Don't use this command if you are not sure!</em></p>
