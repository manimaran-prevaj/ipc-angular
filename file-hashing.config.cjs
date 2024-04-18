const fs = require('fs');
const path = require('path');

// Rename the main js file for build-server
const distDir = path.resolve(__dirname, 'dist/build-server');
const files = fs.readdirSync(distDir);

files.forEach(file => {
	if (file.endsWith('.js') && (file.includes("main"))) {
		const filePath = path.join(distDir);
		const oldFile = path.join(distDir, file);
		fs.rename(oldFile, filePath + '/main.js', function (err) {
			if (err) console.log('ERROR: ' + err);
		});
	}
});


console.log("Renaming successful");
