const argv = require("argv");
const gulp = require("gulp");
const uglify = require("gulp-uglify");
const path = require("path");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("gulp-typescript");

const args = argv
    .option({ name: "env", short: "e", type: "string" })
    .run();
const assetsCSS = [
    "./node_modules/bootstrap/dist/css/*.min.css",
    "./node_modules/font-awesome/css/font-awesome.min.css",
    "./node_modules/tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css",
    "./node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css",
];
const assetsFonts = [
    "node_modules/font-awesome/fonts/**"
];
const assetsJS = [
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/moment/min/moment.min.js",
    "./node_modules/popper.js/dist/umd/popper.min.js",
    "./node_modules/vue/dist/vue.min.js",
    "./node_modules/bootstrap/dist/js/bootstrap.min.js",
    "./node_modules/tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js",
    "./node_modules/datatables.net/js/jquery.dataTables.js",
    "./node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js"
];
const vueFiles = ["./src/**/*.vue"];
const isDebug = args.options["env"] === "debug";
const dest = isDebug ? "./debug" : "./build";
const tsconfig = typescript("tsconfig.json");

function formatPrefix(num) {
    if (num <= 9) {
        return "0" + num;
    }
    return num;
}

gulp.task("copy-css", () => {
    let prefix = 0;
    return gulp.src(assetsCSS)
        .pipe(rename((path) => {
            path.basename = formatPrefix(++prefix) + path.basename;
        }))
        .pipe(gulp.dest(`${dest}/assets/css`));
});

gulp.task("copy-fonts", () => {
    return gulp.src(assetsFonts)
        .pipe(gulp.dest(`${dest}/assets/fonts`));
});

gulp.task("copy-js", () => {
    let prefix = 0;
    return gulp.src(assetsJS)
        .pipe(rename((path) => {
            path.basename = formatPrefix(++prefix) + path.basename;
        }))
        .pipe(gulp.dest(`${dest}/assets/js`));
});

gulp.task("copy-assets", ["copy-css", "copy-fonts", "copy-js"]);

gulp.task("copy-vue", () => {
    return gulp.src(vueFiles, { base: "./src" })
        .pipe(gulp.dest(dest));
});

gulp.task("compile", () => {
    const src = gulp.src(["src/**/*.ts", "!src/**/*.d.ts"], { base: "./src" });
    if (isDebug) {
        return src.pipe(sourcemaps.init())
            .pipe(tsconfig)
            .pipe(sourcemaps.mapSources((sourcePath, file) => {
                var from = path.dirname(file.path);
                var to = path.resolve(path.join(__dirname, "build"));
                return path.join(path.relative(from, to), sourcePath);
            }))
            .pipe(sourcemaps.write(""))
            .pipe(gulp.dest(dest));
    } else {
        return src.pipe(tsconfig)
            .pipe(uglify())
            .pipe(gulp.dest(dest));
    }
});

gulp.task("build", ["compile", "copy-assets", "copy-vue"]);
