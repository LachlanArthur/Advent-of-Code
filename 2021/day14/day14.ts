import example from "./example";
import input from "./input";

type Rules = Record<string, Record<string, string>>;

function parse( input: string ) {
	const [ template, rulesString ] = input.split( '\n\n' );

	const rules: Rules = {};

	rulesString
		.split( '\n' )
		.map( line => line.split( ' -> ' ) )
		.forEach( ( [ pair, insert ] ) => {
			const [ previous, current ] = pair.split( '' );
			( rules[ previous ] ??= {} )[ current ] = insert;
		} );

	// Add a dummy rule for the final space
	rules[ template[ template.length - 1 ] ][ ' ' ] = ' ';
	rules[ ' ' ] = { ' ': ' ' };

	return {
		template: template + ' ',
		rules,
	};
}

function part1( input: string, steps: number ) {
	const { template, rules } = parse( input );

	const outputs: string[] = [
		template,
	];

	for ( let step = 0; step < steps; step++ ) {
		outputs.push( applyRulesToString( outputs[ step ], rules ) );
	}

	const final = outputs.pop()!;

	const counts = Object.values( countLetters( final ) );

	return Math.max( ...counts ) - Math.min( ...counts );
}

function applyRulesToString( template: string, rules: Rules ): string {
	let output = '';

	for ( let char = 0; char < template.length; char++ ) {
		if ( char > 0 ) {
			output += rules[ template[ char - 1 ] ][ template[ char ] ];
		}

		output += template[ char ];
	}

	return output;
}

function countLetters( input: string ): Record<string, number> {
	const counts: Record<string, number> = {};

	for ( let i = 0; i < input.length; i++ ) {
		counts[ input[ i ] ] ??= 0;
		counts[ input[ i ] ]++;
	}

	return sortObjectValues( counts, ( a, b ) => b - a );
}

function sortObjectValues<T>( input: Record<string, T>, sorter: ( a: T, b: T ) => number ) {
	return Object.fromEntries(
		Object.entries( input )
			.sort( ( a, b ) => sorter( a[ 1 ], b[ 1 ] ) )
	)
}

const exampleOut = part1( example, 10 );
console.log( exampleOut );
console.assert( exampleOut === 1588 );

console.time( 'part1' );
console.log( part1( input, 10 ) );
console.timeEnd( 'part1' );

function part2( input: string, steps = 10 ): number {
	const { template, rules } = parse( input );

	const outputs: Map<string, number>[] = [
		countPairs( template ),
	];

	for ( let step = 0; step < steps; step++ ) {
		outputs.push( expandPairs( outputs[ step ], rules ) );
	}

	const finalCounts = outputs.pop()!;

	console.group( 'Pair counts' );
	console.table( finalCounts );
	console.groupEnd();

	const letterCounts = new Map<string, number>();

	for ( const [ pair, count ] of finalCounts ) {
		increment( pair.slice( 0, 1 ), letterCounts, count );
	}

	console.group( 'Letter counts' );
	console.table( letterCounts );
	console.groupEnd();

	const counts = Array.from( letterCounts.values() );

	return Math.max( ...counts ) - Math.min( ...counts );
}

function expandPairs( previousCounts: Map<string, number>, rules: Rules ): Map<string, number> {
	const newCounts = new Map<string, number>();

	for ( const [ pair, count ] of previousCounts ) {
		const triple = applyRulesToString( pair, rules );
		const newPairs = makePairs( triple );

		newPairs.forEach( newPair => increment( newPair, newCounts, count ) );
	}

	return newCounts;
}

function increment( key: string, map: Map<string, number>, amount = 1 ) {
	map.set( key, ( map.get( key ) ?? 0 ) + amount );
}

function countPairs( input: string ): Map<string, number> {
	const output = new Map<string, number>();

	makePairs( input ).forEach( pair => increment( pair, output ) );

	return output;
}

function makePairs( input: string ) {
	return [
		...input.match( /../g )!,
		...input.slice( 1 ).match( /../g )!,
	];
}

const exampleOut2 = part2( example, 10 );
console.log( exampleOut2 );
console.assert( exampleOut2 === 1588 );

console.time( 'part2' );
console.log( part2( input, 40 ) );
console.timeEnd( 'part2' );
