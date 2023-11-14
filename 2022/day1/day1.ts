import '../../extensions.ts';
import { bench } from '../../bench.ts';

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

bench( 'part 1 example', () => part1( example ), 24000 );

bench( 'part 1 input', () => part1( input ) );

bench( 'part 2 example', () => part2( example ), 45000 );

bench( 'part 2 input', () => part2( input ) );
