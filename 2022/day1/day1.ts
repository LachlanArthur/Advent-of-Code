import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

function totals( input: string ): number[] {
	return input
		.split( '\n\n' )
		.map( lines => lines
			.split( '\n' )
			.map( Number )
			.sum()
		)
		.sortByNumberDesc();
}

function part1( input: string ): number {
	return totals( input )[ 0 ];
}

function part2( input: string ): number {
	return totals( input )
		.takeFirst( 3 )
		.sum();
}

console.assert( part1( example ) === 24000 )

console.log( part1( input ) )

console.assert( part2( example ) === 45000 )

console.log( part2( input ) )
