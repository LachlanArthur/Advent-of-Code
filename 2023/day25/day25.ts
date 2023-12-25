import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { Vertex, breadthFirstSearchEdges, breadthFirstWalk, findClusters, minimumCut } from '../../pathfinder.ts';

import example from './example.ts';
import input from './input.ts';

class Component implements Vertex {
	edges = new Map<Component, number>();
	traversible = true;

	constructor( public readonly name: string ) { }

	is( other: Component ): boolean {
		return this.name === other.name;
	}
}

function part1( input: string ) {
	const components = new Map<string, Component>();

	const getComponent = ( name: string ): Component => {
		if ( !components.has( name ) ) {
			const component = new Component( name );
			components.set( name, component );
		}
		return components.get( name )!;
	}

	for ( const line of input.lines() ) {
		const [ name, edgeNames ] = line.split( ': ' );
		for ( const edgeName of edgeNames.split( ' ' ) ) {
			getComponent( name ).edges.set( getComponent( edgeName ), 1 );
			getComponent( edgeName ).edges.set( getComponent( name ), 1 );
		}
	}

	// Make 3 cuts at the minimum
	for ( const [ a, b ] of minimumCut( components.valuesArray(), 3 ) ) {
		a.edges.delete( b );
		b.edges.delete( a );
	}

	return findClusters( components.valuesArray() )
		.map( cluster => cluster.length )
		.product();
}

bench( 'part 1 example', () => part1( example ), 54 );

bench( 'part 1 input', () => part1( input ) );
