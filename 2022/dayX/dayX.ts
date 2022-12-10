import '../../extensions';

import example from './example';
import input from './input';

function part1( input: string ) {
	return input
		.split( '\n' )
		.log()
}

console.assert( part1( example ) === undefined );

console.log( part1( input ) );

// function part2( input: string ) {

// }

// console.assert( part2( example ) === undefined );

// console.log( part2( input ) );
