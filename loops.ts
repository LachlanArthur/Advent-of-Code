export type CycleSkipperOptions<State, Id> = {
	start: State,
	transition: ( input: State ) => State,
	iterations: number,
	identity: ( state: State ) => Id
}

export function cycleSkipper<State, Id extends string | number | bigint>( options: CycleSkipperOptions<State, Id> ): State {
	const { start, transition, iterations, identity } = options;
	const seenIndex = new Map<Id, number>();

	let state = start;

	for ( let i = 0; i < iterations; i++ ) {
		const key = identity( state );
		const loopStart = seenIndex.get( key );

		if ( typeof loopStart === 'number' ) {
			const loopSize = i - loopStart;
			const loopsRemaining = Math.floor( ( iterations - i ) / loopSize );
			i += loopsRemaining * loopSize;
			seenIndex.clear();
		}

		seenIndex.set( key, i );

		state = transition( state );
	}

	return state;
}
