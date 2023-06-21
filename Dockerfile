FROM emscripten/emsdk

WORKDIR /ffmpeg-wasm
COPY package.json ./
COPY scripts/install-dependencies.js ./
RUN node install-dependencies.js
RUN npm install
RUN npm install -g nx

CMD ["npm", "run", "nx:ffmpeg"]



# RUN git clone https://github.com/FFmpeg/FFmpeg.git
