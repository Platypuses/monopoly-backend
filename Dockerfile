FROM node:14-alpine as build-stage
WORKDIR /usr/app-build
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsoa.json ./
COPY .eslintrc.json ./
COPY .prettierrc ./
COPY src ./src
RUN ls -a
RUN yarn build

FROM node:14-alpine
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY --from=build-stage /usr/app-build/dist .
CMD ["node", "src/index.js"]
