FROM emscripten/emsdk
RUN apt-get update
RUN apt-get install -y dos2unix

# Set the working directory to /ffmpeg
WORKDIR /ffmpeg
# Clone the latest release version of FFmpeg
RUN git clone \
--branch $(git ls-remote --tags --refs https://github.com/FFmpeg/FFmpeg.git | awk -F/ '{print $NF}' | grep -E '^n[0-9]+\.[0-9]+(?:\.[0-9]+)?$' | sort -V | tail -n 1) --depth 1 https://github.com/FFmpeg/FFmpeg.git .

# Convert all files to unix format
RUN find . -type f -exec dos2unix {} +

# Install dependencies
RUN apt-get install -y autoconf
RUN apt-get install -y automake
RUN apt-get install -y build-essential
RUN apt-get install -y pkg-config
RUN apt-get install -y libtool


# Configure FFmpeg
RUN emconfigure ./configure \
--target-os=none \
--arch=x86_32 \
--enable-cross-compile \
--disable-x86asm \
--disable-inline-asm \
--disable-stripping \
--disable-programs \
--disable-doc \
--extra-cflags='-s USE_PTHREADS' \
--extra-cxxflags='-s USE_PTHREADS' \
--extra-ldflags='-s USE_PTHREADS -s INITIAL_MEMORY=33554432' \
--nm='llvm-nm' \
--ar=emar \
--ranlib=emranlib \
--cc=emcc \
--cxx=em++ \
--objcc=emcc \
--dep-cc=emcc

# Build FFmpeg
RUN emmake make
RUN emmake make install
# Comment this to keep the container running
CMD ['ffmpeg','-version']

