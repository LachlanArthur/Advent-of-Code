import './extensions';

export type Interval = [ number, number ];

export function intervalsFullyOverlap( a: Interval, b: Interval ) {
	return ( a[ 0 ] >= b[ 0 ] && a[ 1 ] <= b[ 1 ] )
		|| ( a[ 0 ] <= b[ 0 ] && a[ 1 ] >= b[ 1 ] );
}

export function intervalsPartiallyOverlap( a: Interval, b: Interval ) {
	return ( a[ 0 ] >= b[ 0 ] && a[ 0 ] <= b[ 1 ] )
		|| ( a[ 1 ] >= b[ 0 ] && a[ 1 ] <= b[ 1 ] )
		|| ( b[ 0 ] >= a[ 0 ] && b[ 0 ] <= a[ 1 ] )
		|| ( b[ 1 ] >= a[ 0 ] && b[ 1 ] <= a[ 1 ] );
}

export function intervalsAreAdjacent( a: Interval, b: Interval ): boolean {
	return b[ 1 ] + 1 === a[ 0 ] || a[ 1 ] + 1 === b[ 0 ];
}

export function combineIntervals( intervals: Interval[], adjacent = false ) {
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
