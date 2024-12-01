import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ): number {
	return input
		.lines()
		.map( line => line.split( '   ' ).map( n => parseInt( n ) ) )
		.transpose()
		.map( list => list.sortByNumberAsc() )
		.transpose()
		.map( ( [ a, b ] ) => Math.abs( a - b ) )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 11 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): number {
	const [ left, right ] = input
		.lines()
		.map( line => line.split( '   ' ).map( n => parseInt( n ) ) )
		.transpose()
	
	const rightCounts = right.countUnique()

	return left
		.map( n => n * ( rightCounts.get( n ) ?? 0 ) )
		.sum()
}

bench( 'part 2 example', () => part2( example ), 31 );

bench( 'part 2 input', () => part2( input ) );
