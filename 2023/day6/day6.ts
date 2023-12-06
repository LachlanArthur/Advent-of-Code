import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const races = input
		.lines()
		.map( line => line.match( /-?\d+/g )!.map( Number ) )
		.transpose()
		.log() as [ number, number ][]

	return races.map( ( [ time, distance ] ) => {
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
	const [ time, distance ] = input
		.lines()
		.map( line => Number( line.replace( /\D/g, '' ) ) )

	let wins = 0;

	for ( let speed = 1; speed < time - 1; speed++ ) {
		const remaining = time - speed;
		if ( remaining * speed > distance ) {
			wins++;
		}
	}

	return wins;
}

bench( 'part 2 example', () => part2( example ), undefined );

bench( 'part 2 input', () => part2( input ) );
