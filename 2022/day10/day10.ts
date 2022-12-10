import '../../extensions';

import example from './example';
import input from './input';

function runCycles( input: string ) {
	const cycles: number[] = [ 1 ];

	Array.fromLines( input )
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
		...cycles.entriesArray().takeNth( 20 ).takeFirst(),
		...cycles.entriesArray().skipFirst( 20 ).takeNth( 40 ),
	];

	const strengths = signals.map( ( [ index, x ] ) => ( index + 1 ) * x );

	return strengths.sum();
}

console.assert( part1( example ) === 13140 );

console.log( part1( input ) );

function part2( input: string ) {
	const cycles = runCycles( input );

	const screen: string[] = [];

	for ( const line of cycles.entriesArray().chunks( 40 ) ) {
		let pixelIndex = 0;
		for ( const [ index, x ] of line ) {
			screen[ index ] = pixelIndex >= x - 1 && pixelIndex <= x + 1 ? '#' : '.';

			pixelIndex++;
		}
	}

	return screen
		.chunks( 40 )
		.map( chunk => chunk.join( '' ) )
		.join( '\n' );
}

console.log( part2( example ) );

console.log( part2( input ) );
