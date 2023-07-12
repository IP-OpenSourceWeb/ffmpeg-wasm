import { packages, packagesPath } from './constants';
import { writeFile } from '../scripts/src/fs.functions';

packages.forEach((p) => {
  writeFile(`${packagesPath}/${p.name}/env.json`, JSON.stringify(p, null, 2));
});

// this should generate a generic project.json file in packages that should have tasks to clone everything (in parallel)

// it should also generate an env.json for each lib containing the name, repoUrl, version, and it should grab commands.js for the creation of the project.json in that lib

// it

// create generate-project.js, this will be invoked by nx for each lib, and it will generate the project.json for that lib using the env.json file and the commands.js file
