# Create a first-stage to build the app
FROM node:14 as build

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
FROM node:14

# Create an app folder
RUN mkdir /app

# Set up the working directory
WORKDIR /app

# Copy the built artifacts from the build stage
COPY --from=build /app/package.json package.json
COPY --from=build /app/yarn.lock yarn.lock
COPY --from=build /app/ormconfig.ts ormconfig.ts
COPY --from=build /app/.env.development .env.development
COPY --from=build /app/.env.production .env.production
COPY --from=build /app/dist dist

# Install all dependencies
RUN yarn

# Set environment variables
ENV NODE_ENV development

# Expose port
EXPOSE 4000

# Set the startup command
RUN yarn start

# CMD node dist/src/index.js
# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]
