import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Vertex } from "../../pathfinder.ts";

import example from './example.ts';
import input from './input.ts';

class Computer implements Vertex {
	traversible = true;
	edges = new Map<Computer, number>();
	constructor( public id: string ) { }
	is( other: Computer ) {
		return this.id === other.id;
	}
}

function part1( input: string ) {
	const computers = new Map<string, Computer>();

	for ( const connection of input.lines() ) {
		const [ idA, idB ] = connection.split( '-' );

		const [ computerA, computerB ] = [ idA, idB ]
			.map( id => {
				if ( !computers.has( id ) ) {
					computers.set( id, new Computer( id ) );
				}
				return computers.get( id )!;
			} );

		computerA.edges.set( computerB, 1 );
		computerB.edges.set( computerA, 1 );
	}

	const groups = new Map<string, Computer[]>();

	for ( const computer of computers.values() ) {
		for ( const [ a, b ] of computer.edges.keysArray().combinations( 2 ) ) {
			if ( a.edges.has( b ) && b.edges.has( a ) ) {
				const group = [ computer, a, b ];
				groups.set( group.pluck( 'id' ).sort().join( '-' ), group );
			}
		}

	}

	return groups
		.valuesArray()
		.filter( group => group.some( computer => computer.id.startsWith( 't' ) ) )
		.length;
}

bench( 'part 1 example', () => part1( example ), 7 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const computers = new Map<string, Computer>();

	for ( const connection of input.lines() ) {
		const [ idA, idB ] = connection.split( '-' );

		const [ computerA, computerB ] = [ idA, idB ]
			.map( id => {
				if ( !computers.has( id ) ) {
					computers.set( id, new Computer( id ) );
				}
				return computers.get( id )!;
			} );

		computerA.edges.set( computerB, 1 );
		computerB.edges.set( computerA, 1 );
	}

	const groups = new Map<string, Computer[]>();

	sizes: for ( let size = 3, found = true; found === true; size++ ) {
		found = false;
		for ( const computer of computers.values() ) {
			for ( const edges of computer.edges.keysArray().combinationsLazy( size - 1 ) ) {
				if ( edges.combinationsLazy( 2 ).every( ( [ a, b ] ) => a.edges.has( b ) && b.edges.has( a ) ) ) {
					const group = [ computer, ...edges ];
					groups.set( group.pluck( 'id' ).sort().join( '-' ), group );
					found = true;
					continue sizes;
				}
			}
		}
	}

	if ( groups.size === 0 ) {
		throw new Error( 'No groups found' );
	}

	return groups
		.valuesArray()
		.sortByNumberDesc( 'length' )
		.first()!
		.pluck( 'id' )
		.sort()
		.join( ',' );
}

bench( 'part 2 example', () => part2( example ), 'co,de,ka,ta' );

bench( 'part 2 input', () => part2( input ) );
