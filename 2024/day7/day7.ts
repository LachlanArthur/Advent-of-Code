import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { permutations } from '../../maths.ts';

import example from './example.ts';
import input from './input.ts';

function test( target: number, inputs: number[], operators: Array<( a: number, b: number ) => number> ): boolean {
	for ( const operatorList of permutations( operators, inputs.length - 1 ) ) {
		let result = inputs[ 0 ];

		for ( let i = 1; i < inputs.length; i++ ) {
			result = operatorList[ i - 1 ]( result, inputs[ i ] );
		}

		if ( result === target ) {
			return true;
		}
	}

	return false;
}

function part1( input: string ) {
	return input
		.lines()
		.map( line => {
			const [ inputResult, inputNumbers ] = line.split( ': ' );
			const result = Number( inputResult );
			const numbers = inputNumbers.split( ' ' ).map( Number );
			return { result, numbers };
		} )
		.filter( ( { result, numbers } ) => test(
			result,
			numbers,
			[
				function add( a, b ) { return a + b },
				function mult( a, b ) { return a * b },
			],
		) )
		.pluck( 'result' )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 3749 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	return input
		.lines()
		.map( line => {
			const [ inputResult, inputNumbers ] = line.split( ': ' );
			const result = Number( inputResult );
			const numbers = inputNumbers.split( ' ' ).map( Number );
			return { result, numbers };
		} )
		.filter( ( { result, numbers } ) => test(
			result,
			numbers,
			[
				function add( a, b ) { return a + b },
				function mult( a, b ) { return a * b },
				function concat( a, b ) { return Number( `${a}${b}` ) },
			],
		) )
		.pluck( 'result' )
		.sum()
}

bench( 'part 2 example', () => part2( example ), undefined );

bench( 'part 2 input', () => part2( input ) );
