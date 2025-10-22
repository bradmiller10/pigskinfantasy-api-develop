FROM node:12.3.1

ADD package.json package-lock.json  /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /app && cd /app && ln -s /tmp/node_modules && ln -s /tmp/package.json && ln -s /tmp/package-lock.json
WORKDIR /app
COPY src src
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY environment.d.ts .
COPY overrides.d.ts .
COPY nest-cli.json .
COPY webpack-hmr.config.js .

RUN npm i -g @nestjs/cli
RUN npm run build
CMD ["npm", "start"]
