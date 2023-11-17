import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const constraints = input
		.lines()
		.map( line => line.match( /\b([A-Z])\b/gi ) as [ string, string ] )
		.reduce( ( map, [ a, b ] ) => map.push( a, b ) && map, new Map<string, string[]>() )

	const hasParent = ( node: string ) => constraints.valuesArray().flat().includes( node );

	const nodes = constraints.entriesArray().flat( 2 ).unique();
	const nodesWithParents = constraints.valuesArray().flat().unique();

	const sortedNodes: string[] = [];

	const openNodes = nodes.filter( node => !nodesWithParents.includes( node ) ).sort();

	while ( openNodes.length > 0 ) {
		const next = openNodes.shift()!;
		sortedNodes.push( next );

		let edge: string | undefined;
		while ( edge = constraints.shift( next ) ) {
			if ( !hasParent( edge ) ) {
				openNodes.push( edge );
				openNodes.sort();
			}
		}
	}

	if ( openNodes.length !== 0 ) {
		throw new Error( 'There is a cycle in the graph' );
	}

	return sortedNodes.join( '' );
}

bench( 'part 1 example', () => part1( example ), 'CABDFE' );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string, workerCount: number, taskTime: number ): number {
	const constraints = input
		.lines()
		.map( line => line.match( /\b([A-Z])\b/gi ) as [ string, string ] )
		.reduce( ( map, [ a, b ] ) => map.push( a, b ) && map, new Map<string, string[]>() )

	const hasParent = ( node: string ) => constraints.valuesArray().flat().includes( node );

	const letterValue = ( letter: string ) => letter.charCodeAt( 0 ) - 64;

	const nodes = constraints.entriesArray().flat( 2 ).unique();
	const nodesWithParents = constraints.valuesArray().flat().unique();

	const sortedNodes: string[] = [];

	const openNodes = nodes.filter( node => !nodesWithParents.includes( node ) ).sort();

	let time = 0;
	let workerJobs = new Map<number, [ number, string | undefined ]>(
		Array
			.fromRange( 1, workerCount )
			.map( i => [ i, [ 0, undefined ] ] )
	);

	do {
		// Handle the workers that have finished their work
		for ( const [ worker, [ workerWait, workerJob ] ] of workerJobs ) {
			if ( workerWait === 1 ) {
				workerJobs.set( worker, [ 0, undefined ] );
				sortedNodes.push( workerJob! );

				let edge: string | undefined;
				while ( edge = constraints.shift( workerJob! ) ) {
					if ( !hasParent( edge ) ) {
						openNodes.push( edge );
						openNodes.sort();
					}
				}
			} else if ( workerWait > 1 ) {
				workerJobs.set( worker, [ workerWait - 1, workerJob ] );
			}
		}

		// Assign more work
		for ( const [ worker, [ workerWait ] ] of workerJobs ) {
			if ( workerWait === 0 ) {
				const next = openNodes.shift();
				if ( !next ) continue;
				const workerWait = letterValue( next ) + taskTime;
				workerJobs.set( worker, [ workerWait, next ] );
			}
		}

		// console.log( `${time.toString().padStart( 10, ' ' )}\t${workerJobs.valuesArray().map( ( [ _, job ] ) => job ?? '.' ).join( '\t' )}\t${sortedNodes.join( '' )}` );

		time++;
	} while ( openNodes.length > 0 || workerJobs.valuesArray().pluck( '0' ).filter( Number ).length > 0 )

	if ( openNodes.length !== 0 ) {
		throw new Error( 'There is a cycle in the graph' );
	}

	return time - 1;
}

bench( 'part 2 example', () => part2( example, 2, 0 ), 15 );

bench( 'part 2 input', () => part2( input, 5, 60 ) );
