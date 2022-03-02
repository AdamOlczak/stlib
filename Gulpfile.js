const gulp = require("gulp");
const browserSync = require("browser-sync");
const reload = browserSync.reload;

function serve(cb) {
	browserSync({
		server: {
			baseDir: "app",
		},
		host: "127.0.0.1",
		localOnly: true,
	});

	gulp.watch(["*.html", "static/*.js"], { cwd: "app" }, reload);
}

exports.default = serve;
