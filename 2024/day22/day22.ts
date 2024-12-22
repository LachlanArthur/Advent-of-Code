import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
import input from './input.ts';

function xor( a: number, b: number ): number {
	return Number( BigInt( a ) ^ BigInt( b ) );
}

function* monkeyPrng( seed: number ) {
	yield seed;
	let next = seed;
	while ( true ) {
		next = xor( next, next * 64 ) % 16777216;
		next = xor( next, Math.floor( next / 32 ) ) % 16777216;
		next = xor( next, next * 2048 ) % 16777216;
		yield next;
	}
}

function part1( input: string ) {
	return input
		.lines()
		.map( seed => monkeyPrng( Number( seed ) ).skip( 2000 ).next().value as number )
		.sum()
}

bench( 'prng test', () => monkeyPrng( 123 ).skip( 1 ).take( 10 ).toArray().join( ',' ), '15887950,16495136,527345,704524,1553684,12683156,11100544,12249484,7753432,5908254' );

bench( 'part 1 example', () => part1( example1 ), 37327623 );

bench( 'part 1 input', () => part1( input ) );

function* monkeyPrice( seed: number ) {
	for ( const secret of monkeyPrng( seed ) ) {
		yield secret % 10;
	}
}

function part2( input: string ) {
	const monkeyPriceSequences = new Map<string, Map<number, number>>();

	const monkeyPrices = input
		.lines()
		.map( seed => monkeyPrice( Number( seed ) ).take( 2000 ).toArray() );

	for ( const [ monkeyIndex, prices ] of monkeyPrices.entries() ) {
		for ( const window of prices.sliding( 5 ) ) {
			const diffs = window.sliding( 2 ).map( ( [ a, b ] ) => b - a );
			const sequence = diffs.join( ',' );
			if ( !monkeyPriceSequences.has( sequence ) ) {
				monkeyPriceSequences.set( sequence, new Map() );
			}

			const monkeyPriceSequence = monkeyPriceSequences.get( sequence )!;

			if ( !monkeyPriceSequence.has( monkeyIndex ) ) {
				monkeyPriceSequence.set( monkeyIndex, window.at( -1 )! );
			}
		}
	}

	return monkeyPriceSequences
		.valuesArray()
		.map( monkeyFirstPrice => monkeyFirstPrice.valuesArray().sum() )
		.max()
}

bench( 'price test', () => monkeyPrice( 123 ).take( 10 ).toArray().join( ',' ), '3,0,6,5,4,4,6,4,4,2' );

bench( 'part 2 example', () => part2( example2 ), 23 );

bench( 'part 2 input', () => part2( input ) );
