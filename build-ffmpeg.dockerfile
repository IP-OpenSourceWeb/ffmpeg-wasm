FROM emscripten/emsdk
RUN apt-get update
RUN apt-get install -y dos2unix

# Set the working directory to /ffmpeg
WORKDIR /ffmpeg
# Clone the latest release version of FFmpeg
RUN git clone --branch $(git ls-remote --tags --refs https://github.com/FFmpeg/FFmpeg.git | awk -F/ '{print $NF}' | grep -E '^n[0-9]+\.[0-9]+(?:\.[0-9]+)?$' | sort -V | tail -n 1) --depth 1 https://github.com/FFmpeg/FFmpeg.git .

# Convert all files to unix format
RUN find . -type f -exec dos2unix {} +

# RUN apt-get update && apt-get install -y \
#     build-essential \
#     git-core \
#     wget \
#     yasm \
#     pkg-config \
#     libtool \
#     autoconf \
#     automake \
#     cmake \
#     libssl-dev \
#     libx264-dev \
#     libx265-dev \
#     libnuma-dev \
#     libvorbis-dev \
#     libvpx-dev \
#     libfdk-aac-dev \
#     libmp3lame-dev \
#     libopus-dev \
#     dos2unix


RUN apt-get install -y build-essential
# RUN apt-get install -y git-core
# RUN apt-get install -y wget
# RUN apt-get install -y yasm
RUN apt-get install -y pkg-config
RUN apt-get install -y libtool
RUN apt-get install -y autoconf
RUN apt-get install -y automake
# RUN apt-get install -y cmake
# RUN apt-get install -y libssl-dev
# RUN apt-get install -y libx264-dev
# RUN apt-get install -y libx265-dev
# RUN apt-get install -y libnuma-dev
# RUN apt-get install -y libvorbis-dev
# RUN apt-get install -y libvpx-dev
# RUN apt-get install -y libfdk-aac-dev
# RUN apt-get install -y libmp3lame-dev
# RUN apt-get install -y libopus-dev

# Configure FFmpeg
RUN ./configure --disable-x86asm
# Build FFmpeg
# RUN make
# RUN make install
# CMD ['ffmpeg -version']

