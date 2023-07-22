import { writeFile } from '../../fs.functions';

const emscriptenFlags = [];
const ffmpegFlags = [
  '--disable-x86asm',
  '--disable-stripping',

  // ,"--target-os=none ","--arch=x86_32 ","--enable-cross-compile ","--disable-x86asm ","--disable-inline-asm ","--disable-stripping ","--disable-programs ","--disable-doc ","--extra-cflags='-s USE_PTHREADS' ","--extra-cxxflags='-s USE_PTHREADS' ","--extra-ldflags='-s USE_PTHREADS -s INITIAL_MEMORY=33554432' ","--nm='llvm-nm' ","--ar=emar ","--ranlib=emranlib ","--cc=emcc ","--cxx=em++ ","--objcc=emcc ","--dep-cc=emcc"
];

export const ffmpegProjectJson = {
  name: 'ffmpeg',
  projectType: 'library',
  sourceRoot: 'packages/ffmpeg',
  tags: [],
  targets: {
    emmake: {
      executor: 'nx:run-commands',
      options: {
        commands: [
          `emconfigure ./configure ${ffmpegFlags.join(' ')}`,
          // "emconfigure ./configure ,
          'emmake make ',
          'emmake make install',
          // 'mkdir -p wasm/dist',
          // 'emcc -I. -I./fftools -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -Qunused-arguments -o wasm/dist/ffmpeg.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lm -s USE_SDL=2  -s USE_PTHREADS=1  -s INITIAL_MEMORY=33554432',
        ],
        parallel: false,
        cwd: 'packages/ffmpeg',
        color: true,
      },
    },
    make: {
      executor: 'nx:run-commands',
      options: {
        commands: [
          './configure --target-os=none --arch=x86_32 --enable-cross-compile --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc',
          'make --file=Makefile_Original',
          'mkdir -p wasm/dist',
        ],
        parallel: false,
        cwd: 'packages/ffmpeg',
        color: true,
      },
    },
  },
};

writeFile('packages/ffmpeg/project.json', JSON.stringify(ffmpegProjectJson, null, 2));