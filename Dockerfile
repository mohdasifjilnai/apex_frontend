# Use an official Node.js image as the build stage
FROM node:16-alpine AS build
ARG RB_GITLAB_TOKEN
ARG server
ENV server=$server
ADD ./ /ng-kmt
WORKDIR /ng-kmt
COPY package.json .
RUN npm install --force
COPY . /apex-frontend
ENV RB_GITLAB_TOKEN=${RB_GITLAB_TOKEN}

# Build your Angular application
RUN $(npm bin)/ng build --aot --build-optimizer --vendor-chunk=true --configuration=$server

# Create a production-ready Nginx image
 FROM nginx:alpine
 COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular app from the build stage to the Nginx image
 COPY --from=build /ng-kmt/dist/apex_frontend /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
