import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';
import { renderBrailleGrid } from '../../debug.ts';

function part1( input: string ) {
	const particles = input
		.lines()
		.map( line => line
			.match( /-?\d+/g )!
			.map( Number ) as [ number, number, number, number ] );

	const positionsAtTime = ( t: number ) => particles.map<[ number, number ]>( ( [ x, y, dx, dy ] ) => [ x + dx * t, y + dy * t ] )

	const maxSimulationTime: number = ( () => {
		const [ minX, maxX, minY, maxY ] = particles.transpose().flatMap( x => x.minMax() );
		return Math.max( maxX - minX, maxY - minY );
	} )();

	// Simulate the particle movement to find when they occupy the least area
	const timeAreas: number[] = [];

	for ( let t = 0; t < maxSimulationTime; t++ ) {
		const [ minX, maxX, minY, maxY ] = positionsAtTime( t ).transpose().flatMap( x => x.minMax() );
		timeAreas[ t ] = ( maxX - minX ) * ( maxY - minY );
	}

	const closestTime = timeAreas.entriesArray().minBy( '1' )![ 0 ];
	const messageCoords = positionsAtTime( closestTime );

	// Translate the message coords to zero
	const [ minX, minY ] = messageCoords.transpose().flatMap( x => x.min() )
	for ( const [ i, [ x, y ] ] of messageCoords.entries() ) {
		messageCoords[ i ] = [ x - minX, y - minY ];
	}

	renderBrailleGrid( Array.filledFromCoordinates( messageCoords, () => true, false ) as boolean[][] );

	return closestTime;
}

bench( 'part 1 example', () => part1( example ) );

bench( 'part 1 input', () => part1( input ) );
