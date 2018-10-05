FROM mhart/alpine-node:8
WORKDIR /app
RUN mkdir -p /app/static
COPY package.json ./
RUN npm install

FROM mhart/alpine-node:8
WORKDIR /app
COPY --from=0 /app .
COPY . .
ENV PORT 80
EXPOSE 80
EXPOSE 443
CMD ["npm", "start"]
