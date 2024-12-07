export type Cycle<T> = {
	start: T[],
	cycle: T[],
}

export type CycleSkipperOptions<State, Id> = {
	start: State,
	transition: ( input: State, index: number ) => State,
	iterations: number,
	identity: ( state: State ) => Id,
	getResult?: ( result: Cycle<State> ) => void,
}

export function cycleSkipper<State, Id extends string | number | bigint>( options: CycleSkipperOptions<State, Id> ): State {
	const { start, transition, iterations, identity, getResult } = options;
	const seenIndex = new Map<Id, number>();

	const result: Cycle<State> = {
		start: [],
		cycle: [],
	};

	let state = start;
	let detected = false;

	for ( let i = 0; isFinite( i ) && i < iterations; i++ ) {
		if ( !detected ) {
			const key = identity( state );
			const loopStart = seenIndex.get( key );

			if ( typeof loopStart === 'number' ) {
				detected = true;
				const loopSize = i - loopStart;
				const loopsRemaining = Math.floor( ( iterations - i ) / loopSize );
				i += loopsRemaining * loopSize;
				seenIndex.clear();

				if ( getResult ) {
					result.cycle = result.start.splice( loopStart, loopSize );
				}
			} else {
				if ( getResult ) {
					result.start.push( state );
				}
			}

			seenIndex.set( key, i );
		}

		state = transition( state, i );
	}

	if ( getResult ) {
		getResult( result );
	}

	return state;
}

export function cycleValue<T>( cycle: Cycle<T>, iteration: number ): T {
	if ( iteration < cycle.start.length ) {
		return cycle.start[ iteration ];
	}

	return cycle.cycle[ ( iteration - cycle.start.length ) % cycle.cycle.length ];
}
