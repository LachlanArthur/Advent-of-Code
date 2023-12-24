import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1(
	input: string,
	minX = -Infinity, maxX = Infinity,
	minY = -Infinity, maxY = Infinity,
	minZ = -Infinity, maxZ = Infinity,
) {
	const hailstones = input.lines()
		.map( line => {
			const [ x, y, z, dx, dy, dz ] = line.extractNumbers();
			return { x, y, z, dx, dy, dz };
		} )

	const intersections = hailstones
		.combinations( 2 )
		.map( ( [ a, b ] ) => {
			const { x: x1, y: y1, dx: dx1, dy: dy1 } = a;
			const { x: x2, y: y2, dx: dx2, dy: dy2 } = b;
			const intersection = intersectLines2D(
				x1, y1, x1 + dx1, y1 + dy1,
				x2, y2, x2 + dx2, y2 + dy2,
			);
			return { a, b, intersection };
		} )

	const intersectionsWithinRange = intersections
		.filter( ( { a, b, intersection } ) => {
			if ( intersection === null ) {
				// Paths did not cross
				return false;
			}

			const { x: ax, y: ay, dx: adx, dy: ady } = a;
			const { x: bx, y: by, dx: bdx, dy: bdy } = b;
			const [ ix, iy ] = intersection;

			if ( !(
				( adx > 0 ? ix >= ax : ix <= ax ) &&
				( ady > 0 ? iy >= ay : iy <= ay ) &&
				( bdx > 0 ? ix >= bx : ix <= bx ) &&
				( bdy > 0 ? iy >= by : iy <= by )
			) ) {
				// Paths crossed in the past
				return false;
			}

			if ( !(
				ix >= minX && ix <= maxX &&
				iy >= minY && iy <= maxY
			) ) {1
				// Paths crossed outside target area
				return false;
			}

			return true;
		} )

	return intersectionsWithinRange.length;
}

bench( 'part 1 example', () => part1( example, 7, 27, 7, 27 ), 2 );

bench( 'part 1 input', () => part1( input, 200000000000000, 400000000000000, 200000000000000, 400000000000000 ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );

function intersectLines2D<N extends number | bigint>(
	x1: N, y1: N, x2: N, y2: N,
	x3: N, y3: N, x4: N, y4: N,
): [ number, number ] | null {
	const x1_ = BigInt( x1 );
	const y1_ = BigInt( y1 );
	const x2_ = BigInt( x2 );
	const y2_ = BigInt( y2 );
	const x3_ = BigInt( x3 );
	const y3_ = BigInt( y3 );
	const x4_ = BigInt( x4 );
	const y4_ = BigInt( y4 );

	const xNumerator = ( x1_ * y2_ - y1_ * x2_ ) * ( x3_ - x4_ ) - ( x1_ - x2_ ) * ( x3_ * y4_ - y3_ * x4_ );
	const yNumerator = ( x1_ * y2_ - y1_ * x2_ ) * ( y3_ - y4_ ) - ( y1_ - y2_ ) * ( x3_ * y4_ - y3_ * x4_ );
	const xDenominator = ( x1_ - x2_ ) * ( y3_ - y4_ ) - ( y1_ - y2_ ) * ( x3_ - x4_ );
	const yDenominator = ( x1_ - x2_ ) * ( y3_ - y4_ ) - ( y1_ - y2_ ) * ( x3_ - x4_ );

	if ( xDenominator === 0n || yDenominator === 0n ) return null;

	const xInt = Number( xNumerator / xDenominator );
	const yInt = Number( yNumerator / yDenominator );

	const xFrac = Number( xNumerator % xDenominator ) / Number( xDenominator );
	const yFrac = Number( yNumerator % yDenominator ) / Number( yDenominator );

	return [ xInt + xFrac, yInt + yFrac ];
}
