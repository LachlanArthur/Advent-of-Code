import { } from '../../extensions.ts';
import { bench, bench100 } from '../../bench.ts';
import { lcm } from '../../maths.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

function part1( input: string ) {
	const [ instructionsStr, nodeStr ] = input.split( '\n\n' );

	const instructions = [ ...instructionsStr ];

	const nodes = new Map<string, [ string, string ]>();
	for ( const line of nodeStr.split( '\n' ) ) {
		const [ a, b, c ] = line.match( /[a-z]+/gi )!;
		nodes.set( a, [ b, c ] );
	}

	let steps = 0;
	let current = nodes.get( 'AAA' )!;
	for ( const dir of instructions.looping() ) {
		steps++;
		const next = current[ dir === 'L' ? 0 : 1 ];
		current = nodes.get( next )!;
		if ( next === 'ZZZ' ) {
			break;
		}
	}

	return steps;
}

bench100( 'part 1 example', () => part1( example ), 2 );

bench100( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const [ instructionsStr, nodeStr ] = input.split( '\n\n' );

	const instructions = [ ...instructionsStr ];

	const nodes = new Map<string, [ string, string ]>();
	for ( const line of nodeStr.split( '\n' ) ) {
		const [ a, b, c ] = line.replaceAll( /[=(),]/g, ' ' ).split( ' ' ).filter( String );
		nodes.set( a, [ b, c ] );
	}

	let currentKeys: string[] = nodes.keysArray().filter( key => key.at( -1 ) === 'A' );

	const steps = currentKeys.map( start => {

		let steps = 0;
		let current = start;
		for ( const dir of instructions.looping() ) {
			if ( current.at( -1 ) === 'Z' ) {
				break;
			}
			steps++;
			current = nodes.get( current )![ dir === 'L' ? 0 : 1 ];
		}

		return steps;
	} );

	return lcm( ...steps );
}

bench100( 'part 2 example', () => part2( example2 ), 6 );

bench100( 'part 2 input', () => part2( input ) );
