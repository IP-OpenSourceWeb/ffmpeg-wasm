FROM emscripten/emsdk
RUN apt-get update
RUN apt-get install pkg-config
RUN apt-get install -y dos2unix

RUN npm install -g nx

# Set the working directory to /ffmpeg
WORKDIR /ffmpeg-wasm

COPY package.json ./
RUN npm install

# COPY nx.json ./
COPY . .
RUN nx run-many --target=repo:clone --all --parallel --maxParallel=3

# COPY ./packages/ffmpeg/env.json ./packages/ffmpeg/env.json
# COPY ./packages/ffmpeg/project.json ./packages/ffmpeg/project.json
# RUN nx run ffmpeg:


# RUN find . -type f -exec dos2unix {} +


