import { bench } from '../../bench.ts';
import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

function parseInput( input: string ) {
	const [ stackString, moveString ] = input.split( '\n\n' );

	return {
		stacks: parseStacks( stackString ),
		moves: parseMoves( moveString ),
	}
}

function parseStacks( input: string ): string[][] {
	const stackInputLines = input.split( '\n' );
	const stackInputLength = stackInputLines.pop()!.length;

	stackInputLines.reverse();

	const stacks: string[][] = [];

	for ( let letterIndex = 1; letterIndex < stackInputLength; letterIndex += 4 ) {
		const stack: string[] = [];

		for ( const line of stackInputLines ) {
			const value = line.substring( letterIndex, letterIndex + 1 );
			if ( value !== ' ' ) {
				stack.push( value );
			}
		}

		stacks.push( stack );
	}

	return stacks;
}

function parseMoves( input: string ) {
	return input
		.split( '\n' )
		.map( line => line.match( /^move (?<move>\d+) from (?<from>\d+) to (?<to>\d+)$/ )!.groups! )
		.map( ( { move, from, to } ) => ( {
			move: parseInt( move ),
			from: parseInt( from ) - 1,
			to: parseInt( to ) - 1,
		} ) )
}

function part1( input: string ) {
	const { stacks, moves } = parseInput( input );

	for ( const { move, from, to } of moves ) {
		const items = stacks[ from ].splice( 0 - move );
		stacks[ to ].push( ...items.reverse() );
	}

	return stacks.map( stack => stack.pop() ).join('');
}

bench( 'part 1 example', () => part1( example ), 'CMZ' );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const { stacks, moves } = parseInput( input );

	for ( const { move, from, to } of moves ) {
		const items = stacks[ from ].splice( 0 - move );
		stacks[ to ].push( ...items );
	}

	return stacks.map( stack => stack.pop() ).join('');
}

bench( 'part 2 example', () => part2( example ), 'MCD' );

bench( 'part 2 input', () => part2( input ) );
