import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

type Rock2 = number[];
type Jet = '<' | '>';

function setup( input: string ) {
	const jets = input.split( '' ) as Jet[];

	const jetShift: Record<Jet, ( x: number ) => number> = {
		'<': ( x: number ) => x << 1,
		'>': ( x: number ) => x >> 1,
	}

	const rockTypes = [
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
	];

	const edgeMask = 0b100000001;

	const chasm: number[] = [
		0b111111111,
	];

	const nextRock = ( ( nextRockIndex ) => () => [ ...rockTypes[ nextRockIndex++ % rockTypes.length ] ].reverse() )( 0 );

	const nextJet = ( ( nextJetIndex ) => () => jets[ nextJetIndex++ % jets.length ] )( 0 );

	const shiftRock = ( rock: Rock2, jet: Jet, y: number ) => {
		const newRock = rock.map( jetShift[ jet ] );
		if ( !spaceForRock( newRock, y ) ) return rock;
		return newRock;
	}

	const spaceForRock = ( rock: Rock2, y: number ) => !rock.some( ( rockLine, index ) => chasm[ y - index ] & rock[ rock.length - 1 - index ] );

	const stopRock = ( rock: Rock2, y: number ) => {
		for ( let ry = 0; ry < rock.length; ry++ ) {
			chasm[ y - ry ] |= rock[ rock.length - 1 - ry ];
		}
	}

	const extendChasm = ( rock: Rock2 ) => {
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
			lines.map( ( x, i ) => ( '#' + i.toString() ).padStart( 5, ' ' ) + ' ' + x.toString( 2 ).padStart( 9, '0' ) + ` (${x})` )
				.reverse()
				.join( '\n' )
		);
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
	}
}

function part1( input: string, maxRocks: number ) {
	const {
		edgeMask,
		chasm,
		nextRock,
		nextJet,
		shiftRock,
		spaceForRock,
		stopRock,
		extendChasm,
		renderLines,
	} = setup( input );

	for ( let rockIndex = 0; rockIndex < maxRocks; rockIndex++ ) {
		let rock = nextRock();
		extendChasm( rock );

		let rockY = chasm.length - 1;

		// console.log( 'New Rock at', rockY );
		// renderLines( rock );
		// renderLines( chasm );

		while ( true ) {
			rock = shiftRock( rock, nextJet(), rockY );
			// console.log( 'Rock shifted' );
			// renderLines( rock );

			if ( spaceForRock( rock, rockY - 1 ) ) {
				rockY--;
				// console.log( 'Rock dropped to', rockY );
			} else {
				// console.log( 'Rock stopped at', rockY );

				stopRock( rock, rockY );

				break;
			}
		}

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
console.log( part1( input, 2022 ) );
console.timeEnd( 'part1 input' );

function part2( input: string, maxRocks: number ) {
	
}

// console.time( 'part2 example' );
// console.assert( part2( example, 1_000_000_000_000 ) === 1_514_285_714_288 );
// console.timeEnd( 'part2 example' );

// console.time( 'part2 input' );
// console.log( part2( input, 1_000_000_000_000 ) );
// console.timeEnd( 'part2 input' );
