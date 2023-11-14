import { bench } from '../../bench.ts';
import '../../extensions.ts';

import * as example from './example.ts';
import * as input from './input.ts';
import { Facing, Input } from "./shared.ts";

function inverseFacing( facing: Facing ): Facing {
	switch ( facing ) {
		case Facing.Right: return Facing.Left;
		case Facing.Down: return Facing.Up;
		case Facing.Left: return Facing.Right;
		case Facing.Up: return Facing.Down;
	}
	throw new Error( `Unknown facing direction: ${facing} (${Facing[ facing ]})` )
}

function part1( { input }: Input ) {
	const [ board, directions ] = input.split( '\n\n' );
	const boardLines = board.split( '\n' )
	const width = boardLines.pluck( 'length' ).max();

	const chars = boardLines
		.map( line => line.padEnd( width, ' ' ).split( '' ) );

	// Assumes convex board shape
	const edgeBoundsX = chars
		.map( line => [
			line.findIndex( char => char !== ' ' ),
			line.findLastIndex( char => char !== ' ' ),
		] )

	// Assumes convex board shape
	const edgeBoundsY = chars
		.transpose()
		.map( line => [
			line.findIndex( char => char !== ' ' ),
			line.findLastIndex( char => char !== ' ' ),
		] )

	let y = 0,
		x = chars[ 0 ].indexOf( '.' ),
		facing = Facing.Right;

	const turnAnticlockwise = () => facing = ( facing + 4 - 1 ) % 4;
	const turnClockwise = () => facing = ( facing + 4 + 1 ) % 4;

	const nextCoord = () => {
		switch ( facing ) {
			case Facing.Right: return wrapX( x + 1, y );
			case Facing.Down: return wrapY( x, y + 1 );
			case Facing.Left: return wrapX( x - 1, y );
			case Facing.Up: return wrapY( x, y - 1 );
		}
		throw new Error( `Unknown facing direction: ${facing} (${Facing[ facing ]})` )
	}

	const wrapX = ( x: number, y: number ): [ number, number ] => {
		const [ min, max ] = edgeBoundsX[ y ];
		const range = max - min + 1;

		return [
			( ( x + range - min ) % range ) + min,
			y,
		];
	}

	const wrapY = ( x: number, y: number ): [ number, number ] => {
		const [ min, max ] = edgeBoundsY[ x ];
		const range = max - min + 1;

		return [
			x,
			( ( y + range - min ) % range ) + min,
		];
	}

	const moveForwards = ( amount: number ) => {
		for ( let i = 0; i < amount; i++ ) {
			let [ nextX, nextY ] = nextCoord();
			if ( chars[ nextY ][ nextX ] === '.' ) {
				x = nextX;
				y = nextY;
			} else {
				break;
			}
		}
	}

	for ( const [ direction ] of directions.matchAll( /\d+|[LR]/g ) ) {
		switch ( direction ) {
			default: moveForwards( parseInt( direction ) ); break;
			case 'L': turnAnticlockwise(); break;
			case 'R': turnClockwise(); break;
		}
	}

	return 1000 * ( y + 1 ) + 4 * ( x + 1 ) + facing;
}

bench( 'part 1 example', () => part1( example ), 6032 );

bench( 'part 1 input', () => part1( input ) );

function part2( { input, netSize, faceCoords, faceConnections }: Input ) {
	const [ board, directions ] = input.split( '\n\n' );
	const boardLines = board.split( '\n' )
	const width = boardLines.pluck( 'length' ).max();

	const chars = boardLines
		.map( line => line.padEnd( width, ' ' ).split( '' ) );

	const net = Array.filledFromCoordinates( faceCoords, ( coord, index ) => index );
	const [ faceBoundsX, faceBoundsY ] = faceCoords
		.transpose()
		.map( faceBounds => faceBounds
			.map( n => [ n * netSize, n * netSize + netSize - 1 ] )
		);

	// Sanity check each face connection matches its inverse
	for ( const [ faceA, connections ] of faceConnections.entries() ) {
		for ( const [ sideA, { face: faceB, side: sideB } ] of Object.entries( connections ) ) {
			const inverse = faceConnections[ faceB ][ sideB ];
			if ( inverse.face !== faceA || inverse.side.toString() !== sideA ) {
				throw new Error( 'Face Connections not set up correctly' );
			}
		}
	}

	let y = 0,
		x = chars[ 0 ].indexOf( '.' ),
		facing = Facing.Right;

	const turnAnticlockwise = () => facing = ( facing + 4 - 1 ) % 4;
	const turnClockwise = () => facing = ( facing + 4 + 1 ) % 4;

	const nextCoord = () => {
		switch ( facing ) {
			case Facing.Right: return wrap( x + 1, y );
			case Facing.Down: return wrap( x, y + 1 );
			case Facing.Left: return wrap( x - 1, y );
			case Facing.Up: return wrap( x, y - 1 );
		}
		throw new Error( `Unknown facing direction: ${facing} (${Facing[ facing ]})` )
	}

	const faceAt = ( x: number, y: number ): number => {
		const face = net[ Math.floor( y / netSize ) ][ Math.floor( x / netSize ) ];

		if ( typeof face === 'undefined' ) throw new Error( `Invalid face at ${x},${y}` );

		return face;
	}

	const wrap = ( targetX: number, targetY: number ): [ number, number, number ] => {
		if ( targetX !== x && targetY !== y ) {
			throw new Error( 'Tried to move non-orthogonally' );
		}

		const currentFace = faceAt( x, y );
		const [ minX, maxX ] = faceBoundsX[ currentFace ];
		const [ minY, maxY ] = faceBoundsY[ currentFace ];
		const rangeX = maxX - minX;
		const rangeY = maxY - minY;

		if (
			( targetY === y && minX <= targetX && targetX <= maxX ) ||
			( targetX === x && minY <= targetY && targetY <= maxY )
		) {
			// Still on the current face
			return [ targetX, targetY, facing ];
		}

		let wrapSide!: Facing;

		if ( targetY === y ) {
			if ( targetX < minX ) wrapSide = Facing.Left;
			if ( targetX > maxX ) wrapSide = Facing.Right;
		}

		if ( targetX === x ) {
			if ( targetY < minY ) wrapSide = Facing.Up;
			if ( targetY > maxY ) wrapSide = Facing.Down;
		}

		const { face: targetFace, side: targetSide } = faceConnections[ currentFace ][ wrapSide ];
		const [ targetMinX, targetMaxX ] = faceBoundsX[ targetFace ];
		const [ targetMinY, targetMaxY ] = faceBoundsY[ targetFace ];

		if ( wrapSide === targetSide ) {
			// console.log( 'Flip' )
			switch ( wrapSide ) {
				case Facing.Right: // -> Right
					targetY = rangeY - ( targetY - minY ) + targetMinY;
					targetX = targetMaxX;
					break;
				case Facing.Left: // -> Left
					targetY = rangeY - ( targetY - minY ) + targetMinY;
					targetX = targetMinX;
					break;
				case Facing.Up: // -> Up
					targetY = targetMinY;
					targetX = rangeX - ( targetX - minX ) + targetMinX;
					break;
				case Facing.Down: // -> Down
					targetY = targetMaxY;
					targetX = rangeX - ( targetX - minX ) + targetMinX;
					break;
			}
		}

		if ( wrapSide === inverseFacing( targetSide ) ) {
			// console.log( 'Same direction' )
			switch ( wrapSide ) {
				case Facing.Right: // -> Left
					targetX = targetMinX;
					targetY = ( targetY - minY ) + targetMinY;
					break;
				case Facing.Left: // -> Right
					targetX = targetMaxX;
					targetY = ( targetY - minY ) + targetMinY;
					break;
				case Facing.Up: // -> Down
					targetY = targetMaxY;
					targetX = ( targetX - minX ) + targetMinX;
					break;
				case Facing.Down: // -> Up
					targetY = targetMinY;
					targetX = ( targetX - minX ) + targetMinX;
					break;
			}
		}

		if ( ( wrapSide + 1 ) % 4 === targetSide ) {
			// console.log( 'Rotate anticlockwise' )
			switch ( wrapSide ) {
				case Facing.Right: // -> Down
					targetX = ( targetY - minY ) + targetMinX;
					targetY = targetMaxY;
					break;
				case Facing.Left: // -> Up
					targetX = ( targetY - minY ) + targetMinX;
					targetY = targetMinY;
					break;
				case Facing.Up: // -> Right
					targetY = rangeX - ( targetX - minX ) + targetMinY;
					targetX = targetMaxX;
					break;
				case Facing.Down: // -> Left
					targetY = rangeX - ( targetX - minX ) + targetMinY;
					targetX = targetMinX;
					break;
			}
		}

		if ( ( wrapSide + 4 - 1 ) % 4 === targetSide ) {
			// console.log( 'Rotate clockwise' )
			switch ( wrapSide ) {
				case Facing.Right: // -> Up
					targetX = rangeY - ( targetY - minY ) + targetMinX;
					targetY = targetMinY;
					break;
				case Facing.Left: // -> Down
					targetX = rangeY - ( targetY - minY ) + targetMinX;
					targetY = targetMaxY;
					break;
				case Facing.Up: // -> Left
					targetY = ( targetX - minX ) + targetMinY;
					targetX = targetMinX;
					break;
				case Facing.Down: // -> Right
					targetY = ( targetX - minX ) + targetMinY;
					targetX = targetMaxX;
					break;
			}
		}

		// Always moving away from the edge just crossed
		const targetFacing = inverseFacing( targetSide );

		return [ targetX, targetY, targetFacing ];
	}

	const moveForwards = ( amount: number ) => {
		for ( let i = 0; i < amount; i++ ) {
			let [ nextX, nextY, nextFacing ] = nextCoord();
			// console.log( `[${x},${y},${Facing[ facing ]}] => [${nextX},${nextY},${Facing[ nextFacing ]}]` )
			if ( chars[ nextY ][ nextX ] === '.' ) {
				x = nextX;
				y = nextY;
				facing = nextFacing;
			} else {
				// console.warn( 'Blocked' );
				break;
			}
		}
	}

	for ( const [ direction ] of directions.matchAll( /\d+|[LR]/g ) ) {
		// console.log( `[${x},${y},${Facing[ facing ]}] ${direction}` );
		switch ( direction ) {
			default: moveForwards( parseInt( direction ) ); break;
			case 'L': turnAnticlockwise(); break;
			case 'R': turnClockwise(); break;
		}
	}

	// console.log( `[${x},${y},${Facing[ facing ]}] Finished` );

	return 1000 * ( y + 1 ) + 4 * ( x + 1 ) + facing;
}

bench( 'part 2 example', () => part2( example ), 5031 );

bench( 'part 2 input', () => part2( input ) );
