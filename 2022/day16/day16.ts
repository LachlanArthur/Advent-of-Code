import '../../extensions.ts';
import { Vertex, dijkstra } from '../../pathfinder.ts';
import { combinations } from '../../maths.ts';

import example from './example.ts';
import input from './input.ts';
import { bench } from '../../bench.ts';

export class Valve implements Vertex {
	traversible = true;
	edges = new Map<Valve, number>();

	constructor( public name: string, public rate: number ) { }

	total( openedAt: number, endAt: number ) {
		return Math.max( 0, this.rate * ( endAt - openedAt ) );
	}

	is( other: Valve ): boolean {
		return this.name === other.name && this.rate === other.rate;
	}
}

function parse( input: string ) {
	const matches = input
		.split( '\n' )
		.map( line => line.match( /^Valve (?<valve>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<connect>.+)$/ )!.groups as Record<'valve' | 'rate' | 'connect', string> );

	const valves = new Map<string, Valve>();
	const tunnels = new Set<string>();

	for ( const match of matches ) {
		match.connect
			.split( ', ' )
			.forEach( connection => tunnels.add( [ match.valve, connection ].join() ) )

		valves.set( match.valve, new Valve( match.valve, parseInt( match.rate ) ) );
	}

	// Connect tunnels
	for ( const tunnel of tunnels ) {
		const [ from, to ] = tunnel
			.split( ',' )
			.map( valve => valves.get( valve )! );

		from.edges.set( to, 1 );
		to.edges.set( from, 1 );
	}

	const allValves = valves.valuesArray();

	const closedValves = new Set<string>(
		valves.entriesArray()
			.filter( ( [ index, { rate } ] ) => rate > 0 )
			.pluck( '0' )
	);

	// Pre-cache the possible totals for each valve if it were opened at a certain time
	const cacheValveTotals = ( endAt: number ) => {
		const valveTotalCache: Record<string, number[]> = {};

		for ( const name of closedValves ) {
			const valve = valves.get( name )!;
			const cache: number[] = [];
			for ( let minute = 1; minute < endAt; minute++ ) {
				cache[ minute ] = valve.total( minute, endAt );
			}
			valveTotalCache[ name ] = cache;
		}

		return valveTotalCache;
	}

	// Pre-cache the shortest path between each valve
	const pathCache: Record<string, Record<string, string[]>> = Object.fromEntries(
		allValves
			.pluck( 'name' )
			.map( start => [
				start,
				Object.fromEntries(
					closedValves.valuesArray()
						.filter( end => start !== end )
						.map( end => [ end, dijkstra( allValves, valves.get( start )!, valves.get( end )! ).pluck( 'name' ) ] )
				)
			] )
	);

	// Pre-cache the distances between each valve
	const pathDistances: Record<string, Record<string, number>> = Object.fromEntries(
		Object.entries( pathCache )
			.map( ( [ start, paths ] ) => [
				start,
				Object.fromEntries(
					Object.entries( paths )
						.map( ( [ end, path ] ) => [
							end,
							path.length,
						] )
				)
			] )
	);

	const getPathDistance = ( from: string, to: string ): number => {
		return pathDistances[ from ][ to ];
	}

	return {
		valves,
		allValves,
		closedValves,
		cacheValveTotals,
		pathCache,
		pathDistances,
		getPathDistance,
	};
}

function part1( input: string, startName: string, endAt: number ) {
	const {
		closedValves,
		cacheValveTotals,
		pathDistances,
		getPathDistance,
	} = parse( input );

	const valveTotalCache = cacheValveTotals( endAt );

	const getTotalIfOpenedAt = ( valve: string, minute: number ) => {
		return valveTotalCache[ valve ][ minute ] ?? 0
	}

	// console.log( 'Valve Total Cache:' );
	// console.table( valveTotalCache );

	// console.log( 'Path Distance Cache:' );
	// console.table( pathDistances );

	const rankValves = ( current: string, valves: string[], minute = 0 ) => {
		if ( minute >= endAt ) return [];

		return valves
			.map( valve => {
				const distance = getPathDistance( current, valve );
				const minuteAtArrival = minute + distance;
				let total = getTotalIfOpenedAt( valve, minuteAtArrival );

				const rest = valves.without( valve );
				const path = [ valve ];

				if ( rest.length > 0 ) {
					const nextRanked = rankValves( valve, rest, minuteAtArrival )[ 0 ];
					if ( nextRanked ) {
						total += nextRanked.total;
						path.push( ...nextRanked.path );
					}
				}

				return { path, total }
			} )
			.sortByNumberDesc( 'total' )

	}

	return rankValves( startName, closedValves.valuesArray() )[ 0 ].total;
}

bench( 'part 1 example', () => part1( example, 'AA', 30 ), 1651 );

bench( 'part 1 input', () => part1( input, 'AA', 30 ) );

function part2( input: string, startName: string, endAt: number ) {
	const {
		closedValves,
		cacheValveTotals,
		pathDistances,
		getPathDistance,
	} = parse( input );

	const valveTotalCache = cacheValveTotals( endAt );

	const getTotalIfOpenedAt = ( valve: string, minute: number ) => {
		return valveTotalCache[ valve ][ minute ] ?? 0
	}

	// console.log( 'Valve Total Cache:' );
	// console.table( valveTotalCache );

	// console.log( 'Path Distance Cache:' );
	// console.table( pathDistances );

	const rankCache = new Map<string, { path: string[], total: number }[]>()

	const rankValves = ( current: string, valves: string[], minute = 0 ) => {
		if ( minute >= endAt ) return [];

		const cacheKey = `${current} ${valves.join()} ${minute}`;
		if ( rankCache.has( cacheKey ) ) {
			return rankCache.get( cacheKey )!
		}

		const output = valves
			.map( valve => {
				const distance = getPathDistance( current, valve );
				const minuteAtArrival = minute + distance;
				let total = getTotalIfOpenedAt( valve, minuteAtArrival );

				const rest = valves.without( valve );
				const path = [ valve ];

				if ( rest.length > 0 ) {
					const nextRanked = rankValves( valve, rest, minuteAtArrival )[ 0 ];
					if ( nextRanked ) {
						total += nextRanked.total;
						path.push( ...nextRanked.path );
					}
				}

				return { path, total }
			} )
			.sortByNumberDesc( 'total' )

		rankCache.set( cacheKey, output );

		return output;
	}

	const possiblePaths = combinations( closedValves.valuesArray(), Math.floor( closedValves.size / 2 ) );

	return possiblePaths
		.map( path => {
			const otherPath = closedValves.valuesArray().without( ...path );

			return rankValves( startName, path )[ 0 ].total + rankValves( startName, otherPath )[ 0 ].total;
		} )
		.max()
}

bench( 'part 2 example', () => part2( example, 'AA', 26 ), 1707 );

bench( 'part 2 input', () => part2( input, 'AA', 26 ) );
