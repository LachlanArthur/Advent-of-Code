import '../../extensions.ts';
import { bench100 } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.map( line => {
			const [ a, b ] = line.split( ':' )[ 1 ].split( '|' );

			const win = a.match( /-?\d+/g )!.map( Number );
			const mine = b.match( /-?\d+/g )!.map( Number );

			let total = 0;

			for ( const n of win ) {
				if ( mine.includes( n ) ) {
					if ( total ) {
						total *= 2;
					} else {
						total = 1;
					}
				}
			}

			return total;
		} )
		.sum()
}

bench100( 'part 1 example', () => part1( example ), 13 );

bench100( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const cards = new Map( input
		.lines()
		.map( ( line, i ) => {
			const [ a, b ] = line.split( ':' )[ 1 ].split( '|' );

			const win = a.match( /-?\d+/g )!.map( Number );
			const mine = b.match( /-?\d+/g )!.map( Number );

			const matches = [];

			for ( const n of win ) {
				if ( mine.includes( n ) ) {
					matches.push( n );
				}
			}

			return [ i + 1, matches ] as [ number, number[] ];
		} )
	);

	const cache = new Map<number, number>();
	function getCardTotal( card: number ): number {
		if ( cache.has( card ) ) return cache.get( card )!;

		let winCount = 1;

		for ( let subCard of range( card + 1, card + cards.get( card )!.length ) ) {
			winCount += getCardTotal( subCard );
		}

		cache.set( card, winCount );

		return winCount;
	}

	let total = 0;

	for ( const [ i ] of cards ) {
		total += getCardTotal( i );
	}

	return total;
}

bench100( 'part 2 example', () => part2( example ), 30 );

bench100( 'part 2 input', () => part2( input ) );

function* range( from: number, to: number ) {
	for ( let i = from; i <= to; i++ ) {
		yield i;
	}
}
