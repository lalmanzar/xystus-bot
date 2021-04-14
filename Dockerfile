FROM mhart/alpine-node:latest
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /app
RUN mkdir -p /app/static
COPY package.json ./
RUN npm install

FROM mhart/alpine-node:latest
WORKDIR /app
COPY --from=0 /app .
COPY . .
ENV PORT 443
EXPOSE 443
CMD ["npm", "start"]
