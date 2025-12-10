import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.map( ( line, i ) => {
			const match = line.match( /^\[([.#]+)\]((?: \(\d+(?:,\d+)*\))*) \{(\d+(?:,\d+)*)\}+$/ );
			if ( !match ) throw new Error( `Failed to parse line ${i + 1}` );
			const size = match[ 1 ].length;
			return {
				size,
				lights: 0,
				target: parseInt( match[ 1 ]
					.split( '' )
					.map( c => c === '#' ? '1' : '0' )
					.join( '' ), 2 ),
				schematics: match[ 2 ]
					.trim()
					.split( ' ' )
					.map( str => {
						const mask = Array.filled( size, '0' );
						for ( const position of str.replaceAll( /[()]/g, '' ).split( ',' ).map( Number ) ) {
							mask[ position ] = '1';
						}
						return parseInt( mask.join( '' ), 2 );
					} ),
				joltages: match[ 3 ]
					.split( ',' )
					.map( Number ),
			}
		} )
		.log()
}

bench( 'part 1 example', () => part1( example ), undefined );

// bench( 'part 1 input', () => part1( input ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
