import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

type Rock = number[];
type Jet = '<' | '>';

function setup( input: string ) {
	const jets = input.split( '' ) as Jet[];

	const jetShift: Record<Jet, ( x: number ) => number> = {
		'<': ( x: number ) => x << 1,
		'>': ( x: number ) => x >> 1,
	}

	const rockTypes: Rock[] = [
		[
			0b000111100,
		],
		[
			0b000010000,
			0b000111000,
			0b000010000,
		],
		[
			0b000001000,
			0b000001000,
			0b000111000,
		],
		[
			0b000100000,
			0b000100000,
			0b000100000,
			0b000100000,
		],
		[
			0b000110000,
			0b000110000,
		],
	].map( rock => rock.reverse() );

	const edgeMask = 0b100000001;

	const chasm: number[] = [
		0b111111111,
	];

	const nextRock = ( ( nextRockIndex ) => (): Rock => rockTypes[ nextRockIndex++ % rockTypes.length ].clone() )( 0 );

	const nextJet = ( ( nextJetIndex ) => () => jets[ nextJetIndex++ % jets.length ] )( 0 );

	const shiftRock = ( rock: Rock, jet: Jet, y: number ) => {
		const newRock = rock.map( jetShift[ jet ] );
		if ( !spaceForRock( newRock, y ) ) return rock;
		return newRock;
	}

	const spaceForRock = ( rock: Rock, y: number ) => !rock.some( ( rockLine, index ) => chasm[ y - index ] & rock[ rock.length - 1 - index ] );

	const stopRock = ( rock: Rock, y: number ) => {
		for ( let ry = 0; ry < rock.length; ry++ ) {
			chasm[ y - ry ] |= rock[ rock.length - 1 - ry ];
		}
	}

	const extendChasm = ( rock: Rock ) => {
		const gap = 3;

		// Trim excess space
		while ( ( chasm[ chasm.length - ( rock.length + gap + 1 ) ] ?? null ) === edgeMask ) {
			chasm.pop();
		}

		// Add gap and space for next rock
		while ( ( chasm[ chasm.length - ( rock.length + gap ) ] ?? null ) !== edgeMask ) {
			chasm.push( edgeMask );
		}
	}

	const renderLines = ( lines: number[] ) => {
		console.log(
			lines.map( ( x, i ) =>
				( '#' + i.toString() ).padStart( 5, ' ' ) +
				' ' +
				(
					i === 0
						? '▙▄▄▄▄▄▄▄▟'
						: x.toString( 2 )
							.padStart( 9, '0' )
							.replace( /^1/, '▌' )
							.replace( /1$/, '▐' )
							.replaceAll( '0', ' ' )
							.replaceAll( '1', '█' )
				) +
				` (${x})`
			)
				.reverse()
				.join( '\n' )
		);
	}

	const addRock = () => {
		let rock = nextRock();
		extendChasm( rock );

		let rockY = chasm.length - 1;

		while ( true ) {
			rock = shiftRock( rock, nextJet(), rockY );

			if ( spaceForRock( rock, rockY - 1 ) ) {
				rockY--;
			} else {
				stopRock( rock, rockY );
				break;
			}
		}

		return rockY;
	}

	return {
		jets,
		jetShift,
		rockTypes,
		edgeMask,
		chasm,
		nextRock,
		nextJet,
		shiftRock,
		spaceForRock,
		stopRock,
		extendChasm,
		renderLines,
		addRock,
	}
}

function part1( input: string, maxRocks: number ) {
	const {
		edgeMask,
		chasm,
		renderLines,
		addRock,
	} = setup( input );

	for ( let rockIndex = 0; rockIndex < maxRocks; rockIndex++ ) {
		addRock();
	}

	// renderLines( chasm );

	for ( let y = chasm.length - 1; y > 0; y-- ) {
		if ( chasm[ y ] !== edgeMask ) return y;
	}
}

console.time( 'part1 example' );
console.assert( part1( example, 2022 ) === 3068 );
console.timeEnd( 'part1 example' );

console.time( 'part1 input' );
console.log( 'part1 result', part1( input, 2022 ) );
console.timeEnd( 'part1 input' );

function part2( input: string, maxRocks: number ) {
	const {
		jets,
		rockTypes,
		edgeMask,
		chasm,
		addRock,
	} = setup( input );

	const cycleMaximum = jets.length * rockTypes.length;
	const searchSize = 10; // Somewhat arbitrary

	let rockIndex = 0;

	// Seed the chasm with two cycles
	for ( ; rockIndex < cycleMaximum * 2; rockIndex++ ) {
		addRock();
	}

	// Find the cycle
	const searchEnd = chasm.length - 1 - cycleMaximum;
	const searchStart = searchEnd - searchSize;
	const search = chasm.slice( searchStart, searchEnd );
	let cycleLength: number | undefined;

	for ( let y = searchStart - searchSize; y > 0; y-- ) {
		if ( search.every( ( byte, index ) => chasm[ y + index ] === byte ) ) {
			cycleLength = searchStart - y;
			break;
		}
	}

	if ( !cycleLength ) {
		throw 'Failed to find a cycle';
	}

	// Count how many rocks need to fall to advance a cycle
	// Add three more cycles, count how many rocks landed in cycle #2
	const detectRocksFrom = chasm.length + cycleLength;
	const detectRocksTo = detectRocksFrom + cycleLength;
	let rocksInCycle = 0;

	for ( ; chasm.length < detectRocksTo + cycleLength; rockIndex++ ) {
		const rockY = addRock();

		if ( detectRocksFrom <= rockY && rockY < detectRocksTo ) {
			rocksInCycle++;
		}
	}

	// Bulk add cycles until we get close to the end
	const remainingRocks = maxRocks - rockIndex;
	const remainingCycles = Math.floor( remainingRocks / rocksInCycle );
	const virtualLines = remainingCycles * cycleLength;
	rockIndex += remainingCycles * rocksInCycle;

	// Finish off
	for ( ; rockIndex < maxRocks; rockIndex++ ) {
		addRock();
	}

	for ( let y = chasm.length - 1; y > 0; y-- ) {
		if ( chasm[ y ] !== edgeMask ) return y + virtualLines;
	}
}

console.time( 'part1 example - cycles' );
console.assert( part2( example, 2022 ) === 3068 );
console.timeEnd( 'part1 example - cycles' );

console.time( 'part2 example' );
console.assert( part2( example, 1_000_000_000_000 ) === 1_514_285_714_288 );
console.timeEnd( 'part2 example' );

console.time( 'part2 input' );
console.log( 'part2 result', part2( input, 1_000_000_000_000 ) );
console.timeEnd( 'part2 input' );
