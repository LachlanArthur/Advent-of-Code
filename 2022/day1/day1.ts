import { byNumberDesc, sum } from '../helpers';

import example from './example';
import input from './input';

function totals( input: string ): number[] {
	return input
		.split( '\n\n' )
		.map( lines => sum( lines.split( '\n' ).map( Number ) ) )
		.sort( byNumberDesc );
}

function part1( input: string ): number {
	return totals( input )[ 0 ];
}

function part2( input: string ): number {
	return sum(
		totals( input ).slice( 0, 3 )
	);
}

console.log( part1( example ) )

console.log( part1( input ) )

console.log( part2( input ) )
