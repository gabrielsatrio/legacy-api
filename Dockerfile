# Create a first-stage to build the app
FROM node:14-alpine as build

# Create an app folder
RUN mkdir /app

# Set up the working directory
WORKDIR /app

# Copy the package.json file first, then run `yarn`.
# This is an optimization step, as this layer will be cached,
# meaning that if we don't change the package.json file,
# this step doesn't need to be performed again
COPY package.json .

# Install all dependencies
RUN yarn

# Copy the rest of the application
COPY . .

# Build the app (Output: /dist folder)
RUN yarn build

# -------------------------------------------------------------

# Create a second-stage which copies the /dist folder
# and run the application
FROM node:14-alpine

# Install Instantclient Basic Light Oracle and dependencies
RUN apk --no-cache add libaio libnsl libc6-compat curl && \
  cd /tmp && \
  curl -o instantclient-basiclite.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip -SL && \
  unzip instantclient-basiclite.zip && \
  mv instantclient*/ /usr/lib/instantclient && \
  rm instantclient-basiclite.zip && \
  ln -s /usr/lib/instantclient/libclntsh.so.19.1 /usr/lib/libclntsh.so && \
  ln -s /usr/lib/instantclient/libocci.so.19.1 /usr/lib/libocci.so && \
  ln -s /usr/lib/instantclient/libociicus.so /usr/lib/libociicus.so && \
  ln -s /usr/lib/instantclient/libnnz19.so /usr/lib/libnnz19.so && \
  ln -s /usr/lib/libnsl.so.2 /usr/lib/libnsl.so.1 && \
  ln -s /lib/libc.so.6 /usr/lib/libresolv.so.2 && \
  ln -s /lib64/ld-linux-x86-64.so.2 /usr/lib/ld-linux-x86-64.so.2

ENV ORACLE_BASE /usr/lib/instantclient
ENV LD_LIBRARY_PATH /usr/lib/instantclient
ENV TNS_ADMIN /usr/lib/instantclient
ENV ORACLE_HOME /usr/lib/instantclient

# Install PM2
RUN npm i -g pm2

# Create an app folder
RUN mkdir /app

# Set up the working directory
WORKDIR /app

# Copy the built artifacts from the build stage
COPY --from=build /app/dist dist
COPY --from=build /app/.env.production .env.production
COPY --from=build /app/ormconfig.js ormconfig.js
COPY --from=build /app/package.json package.json
COPY --from=build /app/yarn.lock yarn.lock

# Install all dependencies
RUN yarn

# Set environment variables
ENV NODE_ENV production

# Expose port
EXPOSE 4000

# Set the startup command
CMD ["pm2-runtime", "dist/index.js"]

# Debug mode only
# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]
