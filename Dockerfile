FROM emscripten/emsdk
RUN apt-get update
RUN apt-get install -y dos2unix

RUN npm install -g nx
# Set the working directory to /ffmpeg
WORKDIR /ffmpeg-wasm

COPY ./package.json ./package.json
# Install npm dependencies
RUN npm install

COPY ./project.json ./project.json 
# COPY ./env.install-deps.js ./env.install-deps.js
# COPY ./scripts/shell.functions.js ./scripts/shell.functions.js
# Install os dependencies
# RUN nx run env:install-deps 
# Copy the rest of the files
COPY . .

# Clone the latest release version of all repos
RUN nx run-many --target=repo:clone --all --parallel

# Fix line endings
RUN find ./packages -type f -exec dos2unix {} +


