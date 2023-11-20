import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function* recipeScores( initA: number, initB: number ): Generator<number, never, undefined> {
	yield initA;
	yield initB;

	const output = [ initA, initB ];
	let indexA = 0;
	let indexB = 1;

	while ( true ) {
		const next = output[ indexA ] + output[ indexB ];
		const nextDigits = next < 10 ? [ next ] : [ 1, next % 10 ];
		yield* nextDigits;

		output.push( ...nextDigits );
		indexA = ( indexA + output[ indexA ] + 1 ) % output.length;
		indexB = ( indexB + output[ indexB ] + 1 ) % output.length;
	}
}

function part1( skip: number ): string {
	return recipeScores( 3, 7 )
		.skip( skip )
		.take( 10 )
		.toArray()
		.join( '' );
}

bench( 'part 1 example', () => part1( 5 ), '0124515891' );
bench( 'part 1 example', () => part1( 9 ), '5158916779' );
bench( 'part 1 example', () => part1( 18 ), '9251071085' );
bench( 'part 1 example', () => part1( 2018 ), '5941429882' );

bench( 'part 1 input', () => part1( input ) );

function part2( target: string ): number {
	const [ index ] = recipeScores( 3, 7 )
		.window( target.length )
		.entries()
		.find( ( [ , window ] ) => window.join( '' ) === target )!;

	return index;
}

bench( 'part 2 example', () => part2( '51589' ), 9 );
bench( 'part 2 example', () => part2( '01245' ), 5 );
bench( 'part 2 example', () => part2( '92510' ), 18 );
bench( 'part 2 example', () => part2( '59414' ), 2018 );

bench( 'part 2 input', () => part2( input.toString() ) );
