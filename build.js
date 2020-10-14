const AdmZip = require('adm-zip');
const fs = require('fs');
const buildOutputPath = './package.zip';

if(fs.existsSync(buildOutputPath)) {
    fs.unlinkSync(buildOutputPath)
}
const build = new AdmZip('');

build.addLocalFile('./manifest.json');
build.addLocalFolder('./src', 'src', (filePath) => filePath.indexOf('.spec') === -1);
build.addLocalFolder('./resources', 'resources', (filePath) => filePath.indexOf('.spec') === -1);
build.writeZip(buildOutputPath, () => {});
