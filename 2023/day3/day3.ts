import { } from '../../extensions.ts';
import { bench100 } from '../../bench.ts';
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
	const lastRow = input.length - width;
	const special = /[^\d\n.]/;

	let total = 0;

	for ( const result of input.matchAll( /\d+/gd ) ) {
		const [ start, end ] = result.indices![ 0 ];

		const min = start - +( ( start % width ) !== 0 );
		const max = end + +( ( start % width ) !== width );

		if (
			// Left and Right
			special.test( input.slice( min, max ) ) ||
			// Above
			( start > width && special.test( input.slice( min - width, max - width ) ) ) ||
			// Below
			( start < lastRow && special.test( input.slice( min + width, max + width ) ) )
		) {
			total += Number( result[ 0 ] );
		}
	}

	return total;
}

bench100( 'part 1 example', () => part1( example ), 4361 );

bench100( 'part 1 input', () => part1( input ) );

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

bench100( 'part 2 example', () => part2( example ), 467835 );

bench100( 'part 2 input', () => part2( input ) );
