import { chunker, chunks, findSharedLetter, skipFirst, sum, takeFirst, takeNth } from '../helpers';

import example from './example';
import input from './input';

function runCycles( input: string ) {
	const cycles: number[] = [ 1 ];

	input.split( '\n' )
		.forEach( ( line, i, a ) => {
			const [ instruction, value ] = line.split( ' ' );
			const prev = cycles[ cycles.length - 1 ];
			if ( instruction === 'addx' ) {
				const x = prev + parseInt( value );
				cycles.push( prev );
				cycles.push( x );
			} else if ( instruction === 'noop' ) {
				cycles.push( prev );
			}
		} );

	return cycles;
}

function part1( input: string ) {
	const cycles = runCycles( input );

	const signals = [
		...takeFirst( takeNth( cycles.entries(), 20 ), 1 ),
		...takeNth( skipFirst( cycles.entries(), 20 ), 40 ),
	];

	const strengths = signals.map( ( [ index, x ] ) => ( index + 1 ) * x );

	return sum( strengths );
}

console.assert( part1( example ) === 13140 );

console.log( part1( input ) );

function part2( input: string ) {
	const cycles = runCycles( input );

	const screen: string[] = [];

	for ( const line of chunks( cycles.entries(), 40 ) ) {
		let pixelIndex = 0;
		for ( const [ index, x ] of line ) {
			const cycle = index + 1;

			screen[ cycle ] = pixelIndex >= x - 1 && pixelIndex <= x + 1 ? '#' : '.';

			pixelIndex++;
		}
	}

	return [ ...chunks( screen, 40 ) ]
		.map( chunk => chunk.join( '' ) )
		.join( '\n' );
}

console.log( part2( example ) );

console.log( part2( input ) );
