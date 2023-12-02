import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

type Colour = 'red' | 'green' | 'blue';

function parse( input: string ): Record<Colour, number>[][] {
	return input
		.lines()
		.map( line => line
			.split( ': ' )[ 1 ]
			.split( '; ' )
			.map( group => ( {
				red: 0,
				green: 0,
				blue: 0,
				...Object.fromEntries(
					group.split( ', ' )
						.map( cubes => {
							const [ n, colour ] = cubes.split( ' ' );
							return [
								colour,
								parseInt( n ),
							] as [ Colour, number ];
						} )
				)
			} as Record<Colour, number> ) )
		);
}

function part1( input: string ) {
	return parse( input )
		.entriesArray()
		.filter( ( [ , game ] ) => game.every( group => group.red <= 12 && group.green <= 13 && group.blue <= 14 ) )
		.pluck( '0' )
		.map( i => i + 1 )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 8 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return parse( input )
		.map( groups => groups.pluck( 'red' ).max() * groups.pluck( 'green' ).max() * groups.pluck( 'blue' ).max() )
		.sum()
}

bench( 'part 2 example', () => part2( example ), 2286 );

bench( 'part 2 input', () => part2( input ) );
