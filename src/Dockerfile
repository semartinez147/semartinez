# https://github.com/BretFisher/node-docker-good-defaults/blob/69c923bc646bc96003e9ada55d1ec5ca943a1b19/Dockerfile
FROM node:14

# Set environment variables.
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
ARG PORT=4200
ENV PORT $PORT

# Use these ports on our container.
EXPOSE $PORT 9229 9230

# Run commands on the command line using the 'node' user
RUN mkdir /home/node/app
WORKDIR ./home/node/app
RUN chown node:node ./
USER node

# COPY
COPY package.json package-lock.json index.js ./
RUN npm install --no-optional && npm cache clean --force
CMD ["npm", "run", "dev"]
