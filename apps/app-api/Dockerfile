FROM node:18.4-buster-slim
COPY dist/apps/app-api .
RUN yarn install --ignore-engines
CMD node ./main.js
