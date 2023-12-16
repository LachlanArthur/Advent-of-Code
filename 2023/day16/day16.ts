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

function part1( input: string, start: Beam ) {
	const grid = new CharGrid( input );

	let beams: Beam[] = [ start ];

	const energised = new Set<string>();
	const seen = new Set<string>();

	while ( beams.length > 0 ) {
		for ( const { x, y, d } of beams ) {
			energised.add( `${x},${y}` );
			seen.add( `${x},${y},${d}` );
		}

		beams = beams
			.flatMap<Beam>( ( { x, y, d } ) => {
				const gridChar = grid.get( x, y );

				switch ( gridChar ) {
					default:
						throw new Error( `Unknown grid char ${gridChar}` );

					case '.':
						switch ( d ) {
							case Direction.up: return [ { x, y: y - 1, d } ];
							case Direction.down: return [ { x, y: y + 1, d } ];
							case Direction.left: return [ { x: x - 1, y, d } ];
							case Direction.right: return [ { x: x + 1, y, d } ];
						}

					case '|':
						switch ( d ) {
							case Direction.up: return [ { x, y: y - 1, d } ];
							case Direction.down: return [ { x, y: y + 1, d } ];
							case Direction.left:
							case Direction.right: return [
								{ x, y: y - 1, d: Direction.up },
								{ x, y: y + 1, d: Direction.down },
							];
						}

					case '-':
						switch ( d ) {
							case Direction.up:
							case Direction.down: return [
								{ x: x - 1, y, d: Direction.left },
								{ x: x + 1, y, d: Direction.right },
							];
							case Direction.left: return [ { x: x - 1, y, d } ];
							case Direction.right: return [ { x: x + 1, y, d } ];
						}

					case '\\':
						switch ( d ) {
							case Direction.up: return [ { x: x - 1, y, d: Direction.left } ];
							case Direction.down: return [ { x: x + 1, y, d: Direction.right } ];
							case Direction.left: return [ { x, y: y - 1, d: Direction.up } ];
							case Direction.right: return [ { x, y: y + 1, d: Direction.down } ];
						}

					case '/':
						switch ( d ) {
							case Direction.up: return [ { x: x + 1, y, d: Direction.right } ];
							case Direction.down: return [ { x: x - 1, y, d: Direction.left } ];
							case Direction.left: return [ { x, y: y + 1, d: Direction.down } ];
							case Direction.right: return [ { x, y: y - 1, d: Direction.up } ];
						}
				}

			} )
			.filter( ( { x, y, d } ) => x >= 0 && y >= 0 && x < grid.width && y < grid.height && !seen.has( `${x},${y},${d}` ) )
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
