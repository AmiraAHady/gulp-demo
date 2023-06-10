const { src, dest, series, watch, parallel } = require("gulp");

const globs = {
  htmlPath: "project/**/*.html",
  cssPath: "project/css/**/*.css",
  jsPath: "project/js/**/*.js",
  imgPath: "project/pics/*",
};

const htmlMin = require("gulp-html-minifier-terser");
// html task
function htmlTask() {
  //read file
  return (
    src(globs.htmlPath)
      //minfiy
      .pipe(htmlMin({ collapseWhitespace: true, removeComments: true }))
      // move to dist
      .pipe(dest("dist"))
  );
}

exports.h = htmlTask;

const optimizeImages = require("gulp-optimize-images");
function imgTask() {
  return src(globs.imgPath)
    .pipe(
      optimizeImages({
        compressOptions: {
          jpeg: {
            quality: 50,
            progressive: true,
          },
          png: {
            quality: 90,
            progressive: true,
            compressionLevel: 6,
          },
          webp: {
            quality: 80,
          },
        },
      })
    )
    .pipe(dest("dist/assets/images"));
}
exports.img = imgTask;
var concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
function cssTask() {
  //read files
  return (
    src(globs.cssPath)
      //concat all css in one file
      .pipe(concat("style.min.css"))
      //minify
      .pipe(cleanCSS())
      //move to dist
      .pipe(dest("dist/assets/css"))
  );
}
exports.css = cssTask;
const terser = require("gulp-terser");
function jsTask() {
  return (
    src(globs.jsPath)
      //concat all js in one file
      .pipe(concat("script.min.js"))
      //minify
      .pipe(terser())
      //move to dist
      .pipe(dest("dist/assets/js"))
  );
}

function watchTasks() {
  watch(globs.htmlPath, htmlTask);
  watch(globs.cssPath, cssTask);
  watch(globs.imgPath, imgTask);
  watch(globs.jsPath, jsTask);
}
// exports.js = jsTask;
//default //gulp
exports.default = series(
  parallel(htmlTask, imgTask, cssTask, jsTask),
  watchTasks
);

// function task1() {
//     return Promise.resolve()
// }

// //named export
// exports.t1 =task1 //gulp t1

// //defualt export
// exports.default=  task1 //gulp
