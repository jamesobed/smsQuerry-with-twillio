FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .


CMD ["yarn", "start"]


# docker build -t cargo-land-backend .
# docker run -p 4300:4300 cargo-land-backend

