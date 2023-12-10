import { } from '../../extensions.ts';
import { bench, bench100 } from '../../bench.ts';
import { Polynomial, addFractions } from '../../maths.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const total = addFractions(
		input
			.lines()
			.map( line => {
				const sequence = line.match( /-?\d+/g )!.map( Number );
				const formula = Polynomial.fromSequence( sequence );
				return formula.calc( BigInt( sequence.length + 1 ) );
			} )
	);

	if ( total[ 1 ] === 1n ) {
		return total[ 0 ];
	}

	return total;
}

bench100( 'part 1 example', () => part1( example ), 114n );

bench100( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const total = addFractions(
		input
			.lines()
			.map( line => {
				const sequence = line.match( /-?\d+/g )!.map( Number );
				const formula = Polynomial.fromSequence( sequence );
				return formula.calc( 0n );
			} )
	);

	if ( total[ 1 ] === 1n ) {
		return total[ 0 ];
	}

	return total;
}

bench100( 'part 2 example', () => part2( example ), 2n );

bench100( 'part 2 input', () => part2( input ) );
