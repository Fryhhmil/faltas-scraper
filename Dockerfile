FROM bitnami/node:20 AS node-to-build

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli@19

RUN npm install

RUN ng build --configuration=production

#### FIM DO BUILD #####

FROM nginx:1.17.4

USER root
RUN ln -fs /usr/share/zoneinfo/America/Fortaleza /etc/localtime && ls -l /etc/localtime &&\
 echo "America/Fortaleza" > /etc/timezone && cat /etc/timezone

# Copy the app
WORKDIR /app
COPY --from=node-to-build /app/dist/faltas-scraper/browser /usr/share/nginx/html

COPY --from=node-to-build /app/dist/faltas-scraper/browser/assets/default.conf /etc/nginx/conf.d/

EXPOSE 80
