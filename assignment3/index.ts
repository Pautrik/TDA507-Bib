import { readFileSync } from 'fs';

interface Atom {
    id: number;
    coords: Coords;
}

interface Coords {
    x: number;
    y: number;
    z: number;
}

function parseContent(str: string) : Atom[] {
    return str.split('\n').map(line => {
        const strParts = line.match(/\S+/g);
        const parts = strParts.map(parseFloat);
        return {
            id: parts[0],
            coords: {
                x: parts[1],
                y: parts[2],
                z: parts[3],
            },
        };
    });
}

function findChain(atom: Atom, atoms: Atom[], chain: Atom[] = []): Atom[] {
    let bestChain = [];

    for(let i = 0; i < atoms.length; i++) {

        const atomsCopy = [...atoms]; // clone array
        const next = atomsCopy.splice(i, 1)[0];

        const d = distance(atom.coords, next.coords);

        if(3.6 < d && d < 4.0) {
            const partChain = findChain(next, atomsCopy, chain);

            if(partChain.length > bestChain.length) {
                bestChain = partChain;
            }
        }
    }

    return [atom, ...bestChain];
}

function distance(a: Coords, b: Coords): number {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2 + (a.z - b.z)**2);
}


function main() {
    if (process.argv.length !== 3) {
        console.log('Error: expected `npm start file.txt`');
        process.exit();
    }

    let bestChain: Atom[] = [];
    
    const fileContent= readFileSync(process.argv[2], 'utf-8');
    const atoms = parseContent(fileContent.trim());

    for(let i = 0; i < atoms.length; i++) {
        const atomsCopy = [...atoms];
        const atom = atomsCopy.splice(i, 1)[0];
        const testChain = findChain(atom, atomsCopy, [atom]);

        if(bestChain.length < testChain.length) {
            bestChain = testChain;  
        }
    }

    console.log(`Best chain:\n${bestChain.map(x => x.id).join('\n')}`);
    console.log(`Number of atoms in chain: ${bestChain.length}`);
}

main();