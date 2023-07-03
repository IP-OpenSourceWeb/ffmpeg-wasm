FROM emscripten/emsdk
RUN apt-get update
RUN apt-get install pkg-config
RUN apt-get install -y dos2unix

# Set the working directory to /ffmpeg
WORKDIR /ffmpeg

COPY package.json ./
COPY nx.json ./
# COPY . .

RUN npm install
RUN npm install -g nx

COPY ./scripts ./scripts

# Clone the latest release version of FFmpeg
RUN node ./scripts/git/clone-ffmpeg.js
RUN find . -type f -exec dos2unix {} +

RUN npm run ffmpeg:update

# Convert all files to unix format

RUN npm run nx:ffmpeg

# Configure FFmpeg
# RUN emconfigure ./configure --disable-x86asm --disable-stripping
# Build FFmpeg
# RUN emmake make
# RUN emmake make install
# Comment this to keep the container running
CMD ['ffmpeg','-version'] 
