import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const chunks = input.split( '\n\n' );
	const regions = chunks.pop()!
		.split( '\n' )
		.map( line => {
			const [ area, counts ] = line.split( ': ' );
			const [ width, height ] = area.split( 'x' ).map( Number );
			return {
				width,
				height,
				counts: counts.split( ' ' ).map( Number ),
			};
		} )
		.log()

	const presents = chunks.map( chunk => chunk
		.split( '\n' )
		.skipFirst( 1 )
		.map( line => parseInt( line.replaceAll( '#', '1' ).replaceAll( '.', '0' ), 2 ) ) );

	presents.forEach( present => render( present, 3 ) );

	// Since the max size seems to be 50, I can encode the placed boxes using bit masks

	let packed = 0;

	for ( const { width, height, counts } of regions ) {

		const grid = [
			2 ** ( width + 2 ) - 1, // All ones
			...Array.filled( height, 2 ** ( width + 1 ) + 1 ),
			2 ** ( width + 2 ) - 1, // All ones
		];

		console.log( 'Packing grid:' );
		render( grid, width + 2 );

		// Keywords: packing free polyominos
		// https://en.wikipedia.org/wiki/Polyomino#Tiling_regions_with_sets_of_polyominoes
		// https://dl.acm.org/doi/10.1145/321296.321300
	}

	return packed;
}

function render( mask: number[], width: number ) {
	console.log( '' );
	console.log( mask.map( n => n
		.toString( 2 )
		.padStart( width, '0' )
		.replaceAll( '1', '██' )
		.replaceAll( '0', '  ' )
	).join( '\n' ) );
	console.log( '' );
}

bench( 'part 1 example', () => part1( example ), undefined );

// bench( 'part 1 input', () => part1( input ) );

// console.log( '----------' );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
