import '../../extensions.ts';
import { bench } from '../../bench.ts';

import examples from './example.ts';
import input from './input.ts';

type Quad = [ number, number, number, number ];

function manhattan4d( a: Quad, b: Quad ) {
	return (
		Math.abs( a[ 0 ] - b[ 0 ] ) +
		Math.abs( a[ 1 ] - b[ 1 ] ) +
		Math.abs( a[ 2 ] - b[ 2 ] ) +
		Math.abs( a[ 3 ] - b[ 3 ] )
	);
}

function part1( input: string ) {
	const coords = input
		.lines()
		.map( line => line.extractNumbers() as Quad )

	const clusters: Quad[][] = [];

	for ( const coord of coords ) {
		const closeClusters = clusters.filter( cluster => cluster.some( c => manhattan4d( c, coord ) <= 3 ) );

		if ( closeClusters.length === 0 ) {
			clusters.push( [ coord ] );
		} else if ( closeClusters.length === 1 ) {
			closeClusters.first()!.push( coord );
		} else {
			for ( const closeCluster of closeClusters ) {
				clusters.splice( clusters.indexOf( closeCluster ), 1 );
			}
			clusters.push( closeClusters.flat( 1 ).concat( [ coord ] ) );
		}
	}

	return clusters.length;
}

for ( const [ example, answer ] of examples ) {
	bench( 'part 1 example', () => part1( example ), answer );
}

bench( 'part 1 input', () => part1( input ) );
