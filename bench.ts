export function bench<T>( name: string, func: () => T, expected?: T ) {
	const start = performance.now();
	const result = func();
	const end = performance.now();

	let duration = end - start;

	const assert = typeof expected !== 'undefined' && result !== expected ? ` !!! EXPECTED ${expected} !!!` : '';

	if ( typeof result === 'string' && /\n/.test( result ) ) {
		console.log( '%s: [%s]%c%s', name, duration.toFixed( 2 ) + 'ms', 'color: red', assert );
		console.log( result );
		return;
	}

	console.log( '%s: %o [%s]%c%s', name, result, duration.toFixed( 2 ) + 'ms', 'color: red', assert );
}
