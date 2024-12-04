import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function overlappingMatches( input: string, regex: RegExp ): RegExpStringIterator<RegExpExecArray> {
	const flags = regex.global
		? regex.flags
		: regex.flags + 'g';

	return input.matchAll( new RegExp( `(?=${regex.source})`, flags ) );
}

function part1( input: string ): number {
	const width = input.match( /^.+/ )![ 0 ].length;

	const word = 'XMAS';
	const reverse = word.split( '' ).toReversed().join( '' );
	const flags = 'sg';

	const search0 = new RegExp( word, flags );
	const search45 = new RegExp( word.split( '' ).join( `.{${width + 1}}` ), flags );
	const search90 = new RegExp( word.split( '' ).join( `.{${width + 0}}` ), flags );
	const search135 = new RegExp( word.split( '' ).join( `.{${width - 1}}` ), flags );
	const search180 = new RegExp( reverse, flags );
	const search225 = new RegExp( reverse.split( '' ).join( `.{${width + 1}}` ), flags );
	const search270 = new RegExp( reverse.split( '' ).join( `.{${width + 0}}` ), flags );
	const search315 = new RegExp( reverse.split( '' ).join( `.{${width - 1}}` ), flags );

	return Array.from( overlappingMatches( input, search0 ) ).length
		+ Array.from( overlappingMatches( input, search45 ) ).length
		+ Array.from( overlappingMatches( input, search90 ) ).length
		+ Array.from( overlappingMatches( input, search135 ) ).length
		+ Array.from( overlappingMatches( input, search180 ) ).length
		+ Array.from( overlappingMatches( input, search225 ) ).length
		+ Array.from( overlappingMatches( input, search270 ) ).length
		+ Array.from( overlappingMatches( input, search315 ) ).length
}

bench( 'part 1 example', () => part1( example ), 18 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const width = input.match( /^.+/ )![ 0 ].length;

	const flags = 'sg';
	const wrap = `.{${width - 2}}`;

	const search0 = new RegExp( `(?=M.S${wrap}.A.${wrap}M.S)`, flags );
	const search90 = new RegExp( `(?=S.M${wrap}.A.${wrap}S.M)`, flags );
	const search180 = new RegExp( `(?=M.M${wrap}.A.${wrap}S.S)`, flags );
	const search270 = new RegExp( `(?=S.S${wrap}.A.${wrap}M.M)`, flags );

	return Array.from( overlappingMatches( input, search0 ) ).length
		+ Array.from( overlappingMatches( input, search90 ) ).length
		+ Array.from( overlappingMatches( input, search180 ) ).length
		+ Array.from( overlappingMatches( input, search270 ) ).length
}

bench( 'part 2 example', () => part2( example ), 9 );

bench( 'part 2 input', () => part2( input ) );
