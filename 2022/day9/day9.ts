import { filledArray } from '../helpers';
import example from './example';
import example2 from './example2';
import input from './input';

type Direction = 'U' | 'D' | 'R' | 'L';

type Pair = [ number, number ];

function part1( input: string ) {

	const moves = input.split( '\n' )
		.flatMap( line => {
			const [ direction, amount ] = line.split( ' ' );
			return new Array( parseInt( amount ) ).fill( direction as Direction );
		} ) as Direction[];

	let headX = 0;
	let headY = 0;
	let tailX = 0;
	let tailY = 0;

	const visited = new Set<string>();

	function touching() {
		return tailX <= headX + 1 && tailX >= headX - 1
			&& tailY <= headY + 1 && tailY >= headY - 1;
	}

	function moveY( amount: number ) {
		headY += amount;

		if ( touching() ) return;

		tailY += amount;

		if ( headX !== tailX ) {
			tailX = headX;
		}
	}

	function moveX( amount: number ) {
		headX += amount;

		if ( touching() ) return;

		tailX += amount;

		if ( headY !== tailY ) {
			tailY = headY;
		}
	}

	visited.add( `${tailX},${tailY}` );

	for ( const direction of moves ) {

		switch ( direction ) {
			case 'U':
				moveY( 1 );
				break;
			case 'D':
				moveY( -1 );
				break;
			case 'L':
				moveX( -1 );
				break;
			case 'R':
				moveX( 1 );
				break;
		}

		visited.add( `${tailX},${tailY}` );

	}

	return visited.size;

}

console.assert( part1( example ) === 13 );

console.log( part1( input ) );

function followTheLeader( [ leaderX, leaderY ]: Pair, [ followX, followY ]: Pair ): Pair {
	const offsetX = leaderX - followX;
	const offsetY = leaderY - followY;

	switch ( true ) {
		case offsetX === 1 && offsetY === 2: // NNE
		case offsetX === 2 && offsetY === 1: // ENE
			return [ followX + 1, followY + 1 ];

		case offsetX === -1 && offsetY === 2: // NNW
		case offsetX === -2 && offsetY === 1: // WNW
			return [ followX - 1, followY + 1 ];

		case offsetX === 1 && offsetY === -2: // SSE
		case offsetX === 2 && offsetY === -1: // ESE
			return [ followX + 1, followY - 1 ];

		case offsetX === -1 && offsetY === -2: // SSW
		case offsetX === -2 && offsetY === -1: // WSW
			return [ followX - 1, followY - 1 ];

		case offsetX === 2 && offsetY === 0: // E
			return [ followX + 1, followY ];

		case offsetX === -2 && offsetY === 0: // W
			return [ followX - 1, followY ];

		case offsetX === 0 && offsetY === 2: // N
			return [ followX, followY + 1 ];

		case offsetX === 0 && offsetY === -2: // S
			return [ followX, followY - 1 ];

		case offsetX === 2 && offsetY === 2: // NE
			return [ followX + 1, followY + 1 ];

		case offsetX === -2 && offsetY === 2: // NW
			return [ followX - 1, followY + 1 ];

		case offsetX === 2 && offsetY === -2: // SE
			return [ followX + 1, followY - 1 ];

		case offsetX === -2 && offsetY === -2: // SW
			return [ followX - 1, followY - 1 ];
	}

	return [ followX, followY ];
}

function move( [ x, y ]: Pair, direction: Direction ): Pair {
	switch ( direction ) {
		case 'U': return [ x, y + 1 ];
		case 'D': return [ x, y - 1 ];
		case 'L': return [ x - 1, y ];
		case 'R': return [ x + 1, y ];
	}
}

function part2( input: string ) {

	const moves = input.split( '\n' )
		.flatMap( line => {
			const [ direction, amount ] = line.split( ' ' );
			return new Array( parseInt( amount ) ).fill( direction as Direction );
		} ) as Direction[];

	const knots = filledArray( 10, () => [ 0, 0 ] as Pair );

	const allPositions: string[][] = filledArray( knots.length, () => [] );
	const tailVisited = new Set<string>();

	tailVisited.add( `0,0` );

	for ( const direction of moves ) {
		for ( const index of knots.keys() ) {
			const leader = knots[ index - 1 ];
			const isHead = !leader;
			const isTail = index === ( knots.length - 1 );

			if ( isHead ) {
				knots[ index ] = move( knots[ index ], direction );
			} else {
				knots[ index ] = followTheLeader( leader, knots[ index ] );
			}

			if ( isTail ) {
				tailVisited.add( knots[ index ].join( ',' ) );
			}

			allPositions[ index ].push( knots[ index ].join( ',' ) );
		}

	}

	return tailVisited.size;

}

console.assert( part2( example2 ) === 36 );

console.log( part2( input ) );
