import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.map( line => {
			const n = line.replace( /\D/g, '' ).split( '' ).map( Number );
			return n.at( 0 )! * 10 + n.at( -1 )!;
		} )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 142 );

bench( 'part 1 input', () => part1( input ) );

const names = {
	'zero': '0',
	'one': '1',
	'two': '2',
	'three': '3',
	'four': '4',
	'five': '5',
	'six': '6',
	'seven': '7',
	'eight': '8',
	'nine': '9',
}

function part2( input: string ) {
	for ( const [ name, num ] of Object.entries( names ) ) {
		input = input.replaceAll( name, ( n ) => `${n}${num}${n}` );
	}

	return part1( input );
}

bench( 'part 2 example', () => part2( example2 ), 281 );

bench( 'part 2 input', () => part2( input ) );
