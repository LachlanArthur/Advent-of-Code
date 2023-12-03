import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { pointsAroundSquare } from '../../grid.ts';
import { tuple, Tuple } from '../../structures.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	input = input.trim() + '\n';

	if ( input.includes( '\r\n' ) ) {
		throw new Error( 'Input cannot be CRLF' );
	}

	const width = input.indexOf( '\n' ) + 1;
	const special = /[!@#$%^&*\-\=_+]/;

	let total = 0;

	for ( const result of input.matchAll( /\d+/gd ) ) {
		const [ start, end ] = result.indices![ 0 ];

		const xMin = ( start % width ) === 0
			? start
			: start - 1;

		const xMax = ( start % width ) === width
			? end
			: end + 1;

		if (
			// Left and Right
			special.test( input.slice( xMin, xMax ) ) ||
			// Above
			special.test( input.slice( xMin - width, xMax - width ) ) ||
			// Below
			special.test( input.slice( xMin + width, xMax + width ) )
		) {
			total += Number( result[ 0 ] );
		}
	}

	return total;
}

bench( 'part 1 example', () => part1( example ), 4361 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	let total = 0;

	const gears = new Map<Tuple, Tuple[]>();

	const grid = input.lines().map( line => line.split( '' ) );
	for ( const [ y, row ] of grid.entries() ) {
		let firstX: number | undefined;
		for ( const [ x, char ] of row.entries() ) {
			if ( /\d/.test( char ) ) {
				if ( firstX === undefined ) {
					firstX = x;
				}

				for ( const [ surroundX, surroundY ] of pointsAroundSquare( x, y, 1 ) ) {
					const surround = grid[ surroundY ]?.[ surroundX ];
					if ( surround !== '*' ) continue;

					gears.push( tuple( surroundX, surroundY ), tuple( firstX, y ) );
				}
			} else {
				firstX = undefined;
			}
		}
	}

	for ( const numberCoords of gears.values() ) {
		const uniqueCoords = numberCoords.unique();
		if ( uniqueCoords.length === 2 ) {
			let gearRatio = 1;
			for ( const [ nX, nY ] of uniqueCoords ) {
				gearRatio *= Number( grid[ nY ].slice( nX ).join( '' ).match( /\d+/ )![ 0 ] );
			}
			total += gearRatio;
		}
	}

	return total;
}

// bench( 'part 2 example', () => part2( example ), 467835 );

// bench( 'part 2 input', () => part2( input ) );
