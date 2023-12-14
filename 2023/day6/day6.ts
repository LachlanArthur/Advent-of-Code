import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	return input
		.lines()
		.map( line => line.match( /\d+/g )!.map( Number ) )
		.transpose()
		.map( ( [ time, distance ] ) => {
			let wins = 0;

			for ( let speed = 1; speed < time - 1; speed++ ) {
				const remaining = time - speed;
				if ( remaining * speed > distance ) {
					wins++;
				}
			}

			return wins;
		} )
		.product();
}

bench( 'part 1 example', () => part1( example ), 288 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return part1( input.replaceAll( ' ', '' ) );
}

bench( 'part 2 example', () => part2( example ), 71503 );

bench( 'part 2 input', () => part2( input ) );
