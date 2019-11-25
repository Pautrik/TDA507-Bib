const fs = require('fs');

function parseContent(str) {
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

function findChain(atom, previous, atoms, chain = '') {
    let bestChain = '';

    for(let next of atoms) {
        if(atom.id === next.id || (previous && previous.id === next.id))
            continue;

        const d = distance(atom.coords, next.coords);

        if(3.6 < d && d < 4.0) {
            const partChain = findChain(next, atom, atoms, chain);

            if(partChain.length > bestChain.length) {
                bestChain = partChain;
            }
        }
    }

    return `${atom.id},${bestChain}`;
}

function distance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2 + (a.z - b.z)**2);
}


function main() {
    if (process.argv.length !== 3) {
        console.log('Error: expected `npm start file.txt`');
        process.exit();
    }

    let bestChain = '';
    
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8');
    const atoms = parseContent(fileContent.trim());

    for(let atom of atoms) {
        const testChain = findChain(atom, null, atoms, atom.id);

        if(bestChain.length < testChain.length) {
            bestChain = testChain;
        }
    }

    console.log(`Best chain: ${bestChain}`);
}

main();