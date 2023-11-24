import { minMax } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { renderGridSpec } from '../../debug.ts';
import { type Tuple, tuple } from '../../structures.ts';

import example from './example.ts';
import input from './input.ts';

type Point = [ number, number ];

function parse( input: string ) {
	const clay: Point[] = input
		.lines()
		.flatMap( line => {
			const [ x, y ] = line.split( ', ' )
				.sort()
				.map( s => s
					.match( /(\d+)(?:\.\.(\d+))?$/ )!
					.slice( 1 )
					.filter( Boolean )
					.map( Number ) );

			const [ xMin, xMax ] = x.length === 2 ? x : [ x[ 0 ], x[ 0 ] ];
			const [ yMin, yMax ] = y.length === 2 ? y : [ y[ 0 ], y[ 0 ] ];
			const coords: Point[] = [];

			for ( let x = xMin; x <= xMax; x++ ) {
				for ( let y = yMin; y <= yMax; y++ ) {
					coords.push( [ x, y ] );
				}
			}

			return coords;
		} );

	return {
		clay,
	};
}

function simulate( input: string ) {
	const { clay: clayCoords } = parse( input );

	// Pad the grid on the x-axis to allow overflow
	{
		const [ minX, maxX, minY ] = clayCoords.aggregateColumns( minMax ).flat( 1 );
		clayCoords.push( [ minX - 3, minY ] );
		clayCoords.push( [ maxX + 3, minY ] );
	}

	const [ minX, maxX, minY, maxY ] = clayCoords.aggregateColumns( minMax ).flat( 1 );

	// The spring is immediately above the grid
	const spring = tuple( 500, minY - 1 );
	const clay = new Set( clayCoords.map( ( [ x, y ] ) => tuple( x, y ) ) );
	const flowing = new Set<Tuple>();
	const still = new Set<Tuple>();
	const open = new Set<Tuple>( [ goDown( spring ) ] );


	let currentY = minY;

	while ( currentY <= maxY ) {
		const current = openAtCurrentY().first();

		if ( !current ) {
			currentY++;
			continue;
		}

		open.delete( current );
		flowing.add( current );

		const down = goDown( current );
		const downValue = getCell( down );

		switch ( downValue ) {
			default:
				throw new Error( `Unexpected value ${downValue} below ${current}` );

			case undefined:
				// Falling off the map
				continue;

			case '.':
				// Falling through open air
				open.add( down );
				continue;

			case '|':
				// Merge with existing flow
				continue;

			case '#':
			case '~': {
				// Hit an obstacle, flow sideways

				const maxFlow = ( dx: number ): number => {
					let distance = dx;
					while (
						( getCell( go( current, distance, 0 ) ) === '.' || getCell( go( current, distance, 0 ) ) === '|' ) &&
						( getCell( go( current, distance, 1 ) ) === '#' || getCell( go( current, distance, 1 ) ) === '~' )
					) {
						distance += dx;
					}
					return distance;
				}

				const leftFlow = maxFlow( -1 );
				const rightFlow = maxFlow( 1 );

				const leftFlowValue = getCell( go( current, leftFlow, 0 ) );
				const rightFlowValue = getCell( go( current, rightFlow, 0 ) );

				// Contained, fill with still water
				if ( leftFlowValue === '#' && rightFlowValue === '#' ) {
					for ( let x = leftFlow + 1; x < rightFlow; x++ ) {
						const s = go( current, x, 0 );
						still.add( s );
						flowing.delete( s );

						// Any flowing cell above becomes open again
						if ( getCell( goUp( s ) ) === '|' ) {
							open.add( goUp( s ) );
						}
					}
					// Re-run the previous row
					currentY--;
					break;
				}

				for ( let x = leftFlow + 1; x < rightFlow; x++ ) {
					flowing.add( go( current, x, 0 ) );
				}

				// Left flow into empty space becomes open
				if ( leftFlowValue === '.' ) {
					flowing.delete( go( current, leftFlow, 0 ) );
					open.add( go( current, leftFlow, 0 ) );
				}

				// Right flow into empty space becomes open
				if ( rightFlowValue === '.' ) {
					flowing.delete( go( current, rightFlow, 0 ) );
					open.add( go( current, rightFlow, 0 ) );
				}

				break;
			}
		}
	}

	// display();

	return {
		flowing: flowing.size,
		still: still.size,
	};

	function getCell( xy?: Tuple | undefined ) {
		if ( !xy ) return undefined;
		if ( xy[ 0 ] < minX || xy[ 0 ] > maxX || xy[ 1 ] < minY || xy[ 1 ] > maxY ) return undefined;
		if ( spring === xy ) return '+';
		if ( clay.has( xy ) ) return '#';
		if ( open.has( xy ) ) return '?';
		if ( flowing.has( xy ) ) return '|';
		if ( still.has( xy ) ) return '~';
		return '.';
	}

	function go( xy: Tuple, dx = 0, dy = 0 ) {
		return tuple( xy[ 0 ] + dx, xy[ 1 ] + dy );
	}

	function goUp( xy: Tuple, d = 1 ) {
		return go( xy, 0, -d );
	}

	function goRight( xy: Tuple, d = 1 ) {
		return go( xy, d, 0 );
	}

	function goDown( xy: Tuple, d = 1 ) {
		return go( xy, 0, d );
	}

	function goLeft( xy: Tuple, d = 1 ) {
		return go( xy, -d, 0 );
	}

	function openAtCurrentY() {
		return open.valuesArray().filter( xy => xy[ 1 ] === currentY );
	}

	function display() {
		renderGridSpec(
			minX, maxX, minY, maxY,
			( x, y ) => getCell( tuple( x, y ) )!,
			( y, row ) => {
				let meta = '';

				meta += ` y=${y.toString().padStart( 4, ' ' )}`;

				const flowCount = flowing.valuesArray().filter( xy => xy[ 1 ] === y ).length;
				const stillCount = still.valuesArray().filter( xy => xy[ 1 ] === y ).length;

				meta += ' : ' + [
					openAtCurrentY().length.toString().padStart( 3, ' ' ) + ' open',
					flowCount.toString().padStart( 3, ' ' ) + ' flowing',
					stillCount.toString().padStart( 3, ' ' ) + ' still',
				].join( ', ' );

				return meta;
			},
		);
	}
}

function part1( input: string ) {
	const { flowing, still } = simulate( input );

	return flowing + still;
}

bench( 'part 1 example', () => part1( example ), 57 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const { still } = simulate( input );

	return still;
}

bench( 'part 2 example', () => part2( example ), 29 );

bench( 'part 2 input', () => part2( input ) );
