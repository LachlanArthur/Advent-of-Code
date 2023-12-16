import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { CharGrid } from '../../grid.ts';

import example from './example.ts';
import input from './input.ts';

enum Direction {
	up,
	down,
	left,
	right,
}

type Beam = {
	x: number,
	y: number,
	d: Direction,
}

type GridChar = '.' | '|' | '-' | '\\' | '/';

const beamUp = ( { x, y }: Beam ): Beam => ( { x, y: y - 1, d: Direction.up } );
const beamDown = ( { x, y }: Beam ): Beam => ( { x, y: y + 1, d: Direction.down } );
const beamLeft = ( { x, y }: Beam ): Beam => ( { x: x - 1, y, d: Direction.left } );
const beamRight = ( { x, y }: Beam ): Beam => ( { x: x + 1, y, d: Direction.right } );

const directionMap: Record<GridChar, Record<Direction, ( beam: Beam ) => Beam[]>> = {
	'.': {
		[ Direction.up ]: beam => [ beamUp( beam ) ],
		[ Direction.down ]: beam => [ beamDown( beam ) ],
		[ Direction.left ]: beam => [ beamLeft( beam ) ],
		[ Direction.right ]: beam => [ beamRight( beam ) ],
	},
	'|': {
		[ Direction.up ]: beam => [ beamUp( beam ) ],
		[ Direction.down ]: beam => [ beamDown( beam ) ],
		[ Direction.left ]: beam => [ beamUp( beam ), beamDown( beam ) ],
		[ Direction.right ]: beam => [ beamUp( beam ), beamDown( beam ) ],
	},
	'-': {
		[ Direction.up ]: beam => [ beamLeft( beam ), beamRight( beam ) ],
		[ Direction.down ]: beam => [ beamLeft( beam ), beamRight( beam ) ],
		[ Direction.left ]: beam => [ beamLeft( beam ) ],
		[ Direction.right ]: beam => [ beamRight( beam ) ],
	},
	'\\': {
		[ Direction.up ]: beam => [ beamLeft( beam ) ],
		[ Direction.down ]: beam => [ beamRight( beam ) ],
		[ Direction.left ]: beam => [ beamUp( beam ) ],
		[ Direction.right ]: beam => [ beamDown( beam ) ],
	},
	'/': {
		[ Direction.up ]: beam => [ beamRight( beam ) ],
		[ Direction.down ]: beam => [ beamLeft( beam ) ],
		[ Direction.left ]: beam => [ beamDown( beam ) ],
		[ Direction.right ]: beam => [ beamUp( beam ) ],
	},
}

function part1( input: string, start: Beam ) {
	const grid = new CharGrid<GridChar>( input );

	let beams: Beam[] = [ start ];

	const energised = new Set<string>();
	const seen = new Set<string>();

	while ( beams.length > 0 ) {
		for ( const { x, y, d } of beams ) {
			energised.add( `${x},${y}` );
			seen.add( `${x},${y},${d}` );
		}

		beams = beams
			.flatMap<Beam>( beam =>
				directionMap[ grid.get( beam.x, beam.y )! ][ beam.d ]( beam )
			)
			.filter( ( { x, y, d } ) =>
				x >= 0 && x < grid.width &&
				y >= 0 && y < grid.height &&
				!seen.has( `${x},${y},${d}` )
			)
	}

	return energised.size;
}

const part1Start: Beam = { x: 0, y: 0, d: Direction.right };
bench( 'part 1 example', () => part1( example, part1Start ), 46 );

bench( 'part 1 input', () => part1( input, part1Start ) );

function part2( input: string ) {
	const grid = new CharGrid( input );

	const startPositions: Beam[] = [];

	for ( let x = 0; x < grid.width; x++ ) {
		startPositions.push(
			{ x, y: 0, d: Direction.down },
			{ x, y: grid.height - 1, d: Direction.up },
		)
	}

	for ( let y = 0; y < grid.height; y++ ) {
		startPositions.push(
			{ x: 0, y, d: Direction.right },
			{ x: grid.width - 1, y, d: Direction.left },
		)
	}

	return startPositions.map( start => part1( input, start ) ).max()
}

bench( 'part 2 example', () => part2( example ), 51 );

bench( 'part 2 input', () => part2( input ) );
