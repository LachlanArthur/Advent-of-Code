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

export async function benchAsync<T>( name: string, func: () => Promise<T>, expected?: T ) {
	const start = performance.now();
	const result = await func();
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

export function bench100<T>( name: string, func: () => T, expected?: T ) {
	const result = func();

	const enableConsole = disableConsole();
	const start = performance.now();
	for ( let i = 0; i < 100; i++ ) func();
	const end = performance.now();
	enableConsole();

	let duration = ( end - start ) / 100;

	const assert = typeof expected !== 'undefined' && result !== expected ? ` !!! EXPECTED ${expected} !!!` : '';

	if ( typeof result === 'string' && /\n/.test( result ) ) {
		console.log( '%s: [%s]%c%s', name, duration.toFixed( 4 ) + 'ms', 'color: red', assert );
		console.log( result );
		return;
	}

	console.log( '%s: %o [%s]%c%s', name, result, duration.toFixed( 4 ) + 'ms', 'color: red', assert );
}

function disableConsole(): () => void {
	const assert = globalThis.console.assert;
	const clear = globalThis.console.clear;
	const count = globalThis.console.count;
	const countReset = globalThis.console.countReset;
	const debug = globalThis.console.debug;
	const dir = globalThis.console.dir;
	const dirxml = globalThis.console.dirxml;
	const error = globalThis.console.error;
	const group = globalThis.console.group;
	const groupCollapsed = globalThis.console.groupCollapsed;
	const groupEnd = globalThis.console.groupEnd;
	const info = globalThis.console.info;
	const log = globalThis.console.log;
	const table = globalThis.console.table;
	const time = globalThis.console.time;
	const timeEnd = globalThis.console.timeEnd;
	const timeLog = globalThis.console.timeLog;
	const timeStamp = globalThis.console.timeStamp;
	const trace = globalThis.console.trace;
	const warn = globalThis.console.warn;

	globalThis.console.assert = () => { };
	globalThis.console.clear = () => { };
	globalThis.console.count = () => { };
	globalThis.console.countReset = () => { };
	globalThis.console.debug = () => { };
	globalThis.console.dir = () => { };
	globalThis.console.dirxml = () => { };
	globalThis.console.error = () => { };
	globalThis.console.group = () => { };
	globalThis.console.groupCollapsed = () => { };
	globalThis.console.groupEnd = () => { };
	globalThis.console.info = () => { };
	globalThis.console.log = () => { };
	globalThis.console.table = () => { };
	globalThis.console.time = () => { };
	globalThis.console.timeEnd = () => { };
	globalThis.console.timeLog = () => { };
	globalThis.console.timeStamp = () => { };
	globalThis.console.trace = () => { };
	globalThis.console.warn = () => { };

	return enableConsole;

	function enableConsole() {
		globalThis.console.assert = assert;
		globalThis.console.clear = clear;
		globalThis.console.count = count;
		globalThis.console.countReset = countReset;
		globalThis.console.debug = debug;
		globalThis.console.dir = dir;
		globalThis.console.dirxml = dirxml;
		globalThis.console.error = error;
		globalThis.console.group = group;
		globalThis.console.groupCollapsed = groupCollapsed;
		globalThis.console.groupEnd = groupEnd;
		globalThis.console.info = info;
		globalThis.console.log = log;
		globalThis.console.table = table;
		globalThis.console.time = time;
		globalThis.console.timeEnd = timeEnd;
		globalThis.console.timeLog = timeLog;
		globalThis.console.timeStamp = timeStamp;
		globalThis.console.trace = trace;
		globalThis.console.warn = warn;
	}
}

// function renderDuration( milliseconds: number ): string {


// 	if ( milliseconds < 1 ) {
// 		return `${(milliseconds/1000).toFixed(2)}µs`;
// 	}
// }
