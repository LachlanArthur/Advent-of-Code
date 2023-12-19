const { firstBy } = ( await import( 'npm:thenby' ) ).default;

import './extensions.ts';

export type Interval = [ number, number ];

export function intervalsFullyOverlap( a: Interval, b: Interval ): boolean {
	return ( a[ 0 ] >= b[ 0 ] && a[ 1 ] <= b[ 1 ] )
		|| ( a[ 0 ] <= b[ 0 ] && a[ 1 ] >= b[ 1 ] );
}

export function intervalsPartiallyOverlap( a: Interval, b: Interval ): boolean {
	return ( a[ 0 ] >= b[ 0 ] && a[ 0 ] <= b[ 1 ] )
		|| ( a[ 1 ] >= b[ 0 ] && a[ 1 ] <= b[ 1 ] )
		|| ( b[ 0 ] >= a[ 0 ] && b[ 0 ] <= a[ 1 ] )
		|| ( b[ 1 ] >= a[ 0 ] && b[ 1 ] <= a[ 1 ] );
}

export function intervalsAreAdjacent( a: Interval, b: Interval ): boolean {
	return b[ 1 ] + 1 === a[ 0 ] || a[ 1 ] + 1 === b[ 0 ];
}

export function combineIntervals( intervals: Interval[], adjacent = false ): Interval[] {
	intervals = intervals.sortByNumberAsc( '0' );

	const combined: Interval[] = [];
	const merged = new Set<number>();

	for ( let index = 0; index < intervals.length; index++ ) {
		if ( merged.has( index ) ) continue;

		let interval = intervals[ index ];

		for ( let nextIndex = index + 1; nextIndex < intervals.length; nextIndex++ ) {
			if ( merged.has( nextIndex ) ) continue;

			const nextInterval = intervals[ nextIndex ];

			if ( intervalsPartiallyOverlap( interval, nextInterval ) || ( adjacent && intervalsAreAdjacent( interval, nextInterval ) ) ) {
				interval = [
					Math.min( interval[ 0 ], nextInterval[ 0 ] ),
					Math.max( interval[ 1 ], nextInterval[ 1 ] ),
				];

				merged.add( nextIndex );
			}
		}

		combined.push( interval );
	}

	return combined;
}

export function* splitInterval( interval: [ number, number ], positions: number[] ): Generator<[ number, number ], void, undefined> {
	let [ min, max ] = interval;

	for ( const position of positions.sortByNumberAsc() ) {
		if ( position < min ) continue;
		if ( position < max ) {
			yield [ min, position ];
			min = position;
		} else {
			yield [ min, max ];
			break;
		}
	}
}

export function intervalUnionLength( intervals: [ number, number ][] ): number {
	const events = intervals
		.flatMap( ( [ min, max ] ) => [ [ min, 1 ], [ max, -1 ] ] )
		.sort( firstBy( '0' ).thenBy( '1' as any ) ) as [ number, number ][];

	let previous = 0;
	let overlap = 0;
	let total = 0;

	for ( const [ position, event ] of events ) {
		if ( overlap > 0 ) {
			total += position - previous;
		}
		previous = position;
		overlap += event;
	}

	return total;
}