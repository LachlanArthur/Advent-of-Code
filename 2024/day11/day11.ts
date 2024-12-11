import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
import input from './input.ts';

const resultCache = new Map<string, number>();

function simulate( stone: number, blinks: number ): number {
	const key = `${stone},${blinks}`;

	if ( resultCache.has( key ) ) {
		return resultCache.get( key )!;
	}

	let next: number[] = split( stone );

	const count = blinks === 1
		? next.length
		: next.map( s => simulate( s, blinks - 1 ) ).sum();

	resultCache.set( key, count );

	return count;
}

function split( stone: number ): number[] {
	if ( stone === 0 ) {
		return [ 1 ];
	}

	const stoneStr = String( stone );

	if ( stoneStr.length % 2 === 0 ) {
		return [
			Number( stoneStr.substring( 0, stoneStr.length / 2 ) ),
			Number( stoneStr.substring( stoneStr.length / 2 ) ),
		];
	}

	return [ stone * 2024 ];
}

function part1( input: string, blinks: number ) {
	let stones = input.split( ' ' ).map( Number );

	for ( let blink = 0; blink < blinks; blink++ ) {
		stones = stones.flatMap( split );
	}

	return stones.length;
}

bench( 'part 1 example 1', () => part1( example1, 1 ), 7 );

bench( 'part 1 example 2', () => part1( example2, 6 ), 22 );

bench( 'part 1 example 2', () => part1( example2, 25 ), 55312 );

bench( 'part 1 input', () => part1( input, 25 ) );

function part2( input: string, blinks: number ) {
	return input
		.split( ' ' )
		.map( stone => simulate( Number( stone ), blinks ) )
		.sum();
}

bench( 'part 2 example 1', () => part2( example1, 1 ), 7 );

bench( 'part 2 example 2', () => part2( example2, 6 ), 22 );

bench( 'part 2 example 2', () => part2( example2, 25 ), 55312 );

bench( 'part 2 input', () => part2( input, 75 ) );
