// Author: Patrik Emanuelsson
const fs = require('mz/fs');
const _ = require('lodash');

const atomRadius = 2;

async function main() {
    if(process.argv.length != 4) {
        console.log('Expect 2 files as parameters, i.e. npm start file1.pdb file2.pdb');
        return;
    }

    const atoms1 = await readAndParsePDB(process.argv[2]);
    const atoms2 = await readAndParsePDB(process.argv[3]);

    const overlappers = new Set();
    let nrComparisons = 0;
    for(let atom2 of atoms2) {
        for(let atom1 of atoms1) {
            nrComparisons++;
            if(distance(atom1, atom2) < 2 * atomRadius) {
                overlappers.add(atom2);
                break;
            }
        }
    }

    console.log(`Number of overlaps between the first and second file: ${overlappers.size}`);
    console.log(`Number of atom-atom comparisons: ${nrComparisons}`);
    console.log(`Overlapping atoms in ${process.argv[3]}:`);
    console.log(_.sortBy(Array.from(overlappers), x => x.nr).map(x => `${x.nr} ${x.locInd} ${x.seqNum} ${x.name}`).join('\n'));

}

async function readAndParsePDB(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lineStrings = content.split('\n').filter(x => x != '');
    const lines = lineStrings.map(x => x.split(/\s+/));
    const filteredLines = lines.filter(x => x[0] == 'ATOM' || x[0] == 'HETATM');
    const atoms = filteredLines.map(line => {
        const nr = parseInt(line[1]);
        const name = line[2];
        const locInd = line[3];
        const seqNum = line[5];
        const x = parseFloat(line[6]);
        const y = parseFloat(line[7]);
        const z = parseFloat(line[8]);

        return { nr, name, locInd, seqNum, x, y, z };
    });

    return atoms;
}

function distance(atom1, atom2) {
    return Math.sqrt(Math.pow(atom1.x - atom2.x, 2) + Math.pow(atom1.y - atom2.y, 2) + Math.pow(atom1.z - atom2.z, 2));
}

main();