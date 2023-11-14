import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

const wrappedIndex = ( length: number, index: number ): number => {
	let newIndex = ( index + length * 100 ) % length;

	return newIndex;
}

const mix = ( instructions: { value: number }[] ) => ( numbers: { value: number }[] ) => {
	const length = numbers.length;

	let output = [ ...numbers ];

	for ( const number of instructions ) {

		const oldIndex = output.indexOf( number );
		const newIndex = wrappedIndex( length - 1, oldIndex + number.value );

		output.splice( oldIndex, 1 );
		output.splice( newIndex, 0, number );
	}

	return output;
}

function part1( input: string ) {
	const instructions = input
		.split( '\n' )
		.map( Number )
		.map( value => ( { value } ) )

	const output = mix( [ ...instructions ] )( [ ...instructions ] );

	const zero = output.filter( ( { value } ) => value === 0 )[ 0 ];
	const zeroIndex = output.indexOf( zero );

	const oneT = output[ wrappedIndex( output.length, zeroIndex + 1000 ) ].value;
	const twoT = output[ wrappedIndex( output.length, zeroIndex + 2000 ) ].value;
	const threeT = output[ wrappedIndex( output.length, zeroIndex + 3000 ) ].value;

	return oneT + twoT + threeT;
}

bench( 'part 1 example', () => part1( example ), 3 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const instructions = input
		.split( '\n' )
		.map( Number )
		.map( n => n * 811589153 )
		.map( value => ( { value } ) )

	const mixer = mix( [ ...instructions ] );

	let output = [ ...instructions ];

	for ( let i = 0; i < 10; i++ ) {
		output = mixer( [ ...output ] );
	}

	const zero = output.filter( ( { value } ) => value === 0 )[ 0 ];
	const zeroIndex = output.indexOf( zero );

	const oneT = output[ wrappedIndex( output.length, zeroIndex + 1000 ) ].value;
	const twoT = output[ wrappedIndex( output.length, zeroIndex + 2000 ) ].value;
	const threeT = output[ wrappedIndex( output.length, zeroIndex + 3000 ) ].value;

	return oneT + twoT + threeT;
}

bench( 'part 2 example', () => part2( example ), 1623178306 );

bench( 'part 2 input', () => part2( input ) );
