import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { allPaths, Vertex } from '../../pathfinder.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

class Device implements Vertex {
	constructor( public name: string ) { }
	edges = new Map<Device, number>();
	traversible = true;
	is( other: Device ): boolean {
		return this.name === other.name;
	}
}

function part1( input: string ) {
	const devices = new Map<string, Device>();

	const getDevice = ( name: string ) => {
		if ( !devices.has( name ) ) {
			devices.set( name, new Device( name ) );
		}
		return devices.get( name )!;
	}

	for ( const line of input.lines() ) {
		const [ name, outputList ] = line.split( ': ' );
		const outputs = outputList.split( ' ' );
		const device = getDevice( name );
		for ( const output of outputs ) {
			device.edges.set( getDevice( output ), 1 );
		}
	}

	const start = devices.get( 'you' )!;
	const end = devices.get( 'out' )!;

	let total = 0;
	for ( const path of allPaths( start, end ) ) {
		total++;
	}

	return total;
}

bench( 'part 1 example', () => part1( example ), 5 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const edges = new Map<string, Map<string, number>>();

	for ( const line of input.lines() ) {
		const [ name, outputList ] = line.split( ': ' );
		const outputs = outputList.split( ' ' );
		edges.set( name, new Map( outputs.map( output => [ output, 1 ] ) ) );
	}

	// console.log( edges );

	// TODO: Make this graph simplification reusable

	const keep = [
		'svr',
		'fft',
		'dac',
		'out',
	];

	const remove = edges.keysArray().without( ...keep );

	while ( remove.length > 0 ) {
		const removedName = remove.pop()!;
		const moveEdges = edges.get( removedName )!;
		edges.delete( removedName );

		// console.log( 'Replacing %o with %o', edge, move );

		for ( const [ otherName, otherEdges ] of edges ) {
			const count = otherEdges.get( removedName );
			if ( count !== undefined ) {
				otherEdges.delete( removedName );
				// console.log( '  Updating %o', other );
				for ( const [ moveName, moveCount ] of moveEdges ) {
					// console.log( '    %o += %o', moveName, moveCount );
					otherEdges.increment( moveName, count * moveCount );
				}
			}
		}

		// console.log( edges );
	}

	const devices = new Map<string, Device>();

	const getDevice = ( name: string ) => {
		if ( !devices.has( name ) ) {
			devices.set( name, new Device( name ) );
		}
		return devices.get( name )!;
	}

	for ( const [ name, others ] of edges ) {
		const device = getDevice( name );
		for ( const [ otherName, otherCount ] of others ) {
			device.edges.set( getDevice( otherName ), otherCount );
		}
	}

	const start = devices.get( 'svr' )!;
	const end = devices.get( 'out' )!
	const need = [ devices.get( 'fft' )!, devices.get( 'dac' )! ];

	let totalPaths = 0;
	for ( const path of allPaths( start, end ) ) {
		if ( path.vertices.intersect( need ).length === need.length ) {
			totalPaths += path.vertices.sliding( 2 ).map( ( [ a, b ] ) => a.edges.get( b )! ).product();
		}
	}

	return totalPaths;
}

bench( 'part 2 example', () => part2( example2 ), 2 );

bench( 'part 2 input', () => part2( input ) );
