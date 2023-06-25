FROM emscripten/emsdk
RUN apt-get update
RUN apt-get install -y dos2unix

# Set the working directory to /ffmpeg
WORKDIR /ffmpeg
# Clone the latest release version of FFmpeg
RUN git clone --branch $(git ls-remote --tags --refs https://github.com/FFmpeg/FFmpeg.git | awk -F/ '{print $NF}' | grep -E '^n[0-9]+\.[0-9]+(?:\.[0-9]+)?$' | sort -V | tail -n 1) --depth 1 https://github.com/FFmpeg/FFmpeg.git .

# Convert all files to unix format
RUN find . -type f -exec dos2unix {} +

# Install dependencies
# RUN apt-get install -y autoconf
# RUN apt-get install -y automake
# RUN apt-get install -y build-essential
# RUN apt-get install -y pkg-config
# RUN apt-get install -y libtool


# Configure FFmpeg
RUN emconfigure ./configure --disable-x86asm
# Build FFmpeg
RUN emmake make
RUN emmake make install
# Comment this to keep the container running
CMD ['ffmpeg','-version'] 

