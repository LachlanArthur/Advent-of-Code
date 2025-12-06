import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.map( line => line.split( /\s+/g ).filter(String) )
		.transpose()
		.map( ( args ) => {
			if ( args.pop() === '*' ) {
				return args.map( Number ).product();
			} else {
				return args.map( Number ).sum();
			}
		} )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 4277556 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return input
		.linesAndChars()
		.transpose()
		.reverse()
		.reduce( ( carry, args ) => {
			if ( args.join( '' ).trim() === '' ) {
				return carry;
			}

			const operator = args.pop();

			carry.numbers.push( parseInt( args.join( '' ).trim() ) );

			if ( operator === ' ' ) {
				return carry;
			}

			if ( operator === '*' ) {
				carry.total += carry.numbers.product();
			} else {
				carry.total += carry.numbers.sum();
			}

			carry.numbers = [];

			return carry;
		}, { total: 0, numbers: [] as number[] } )
		.total
}

bench( 'part 2 example', () => part2( example ), 3263827 );

bench( 'part 2 input', () => part2( input ) );
