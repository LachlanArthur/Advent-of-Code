import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const [ inputRules, inputPages ] = input.split( '\n\n' );

	const rules = inputRules
		.lines()
		.map( line => ( {
			valid: new RegExp( line.replace( /(\d+)\|(\d+)/, '\\b$1(,\\d+)*,$2\\b' ) ),
			invalid: new RegExp( line.replace( /(\d+)\|(\d+)/, '\\b$2(,\\d+)*,$1\\b' ) ),
		} ) )

	return inputPages
		.lines()
		.filter( line => rules.every( ( { valid, invalid } ) => !invalid.test( line ) || valid.test( line ) ) )
		.map( line => line.split( ',' ) )
		.map( pages => parseInt( pages[ Math.floor( pages.length / 2 ) ] ) )
		.sum()
}

bench( 'part 1 example', () => part1( example ), 143 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const [ inputRules, inputPages ] = input.split( '\n\n' );

	type Rule = Record<'valid' | 'invalid', RegExp>;

	const rules = inputRules
		.lines()
		.map<Rule>( line => ( {
			valid: new RegExp( line.replace( /(\d+)\|(\d+)/, '\\b($1)((?:,\\d+)*),($2)\\b' ) ),
			invalid: new RegExp( line.replace( /(\d+)\|(\d+)/, '\\b($2)((?:,\\d+)*),($1)\\b' ) ),
		} ) )

	const failedRule = ( line: string ): Rule | undefined => rules.find( ( { valid, invalid } ) => invalid.test( line ) && !valid.test( line ) );

	return inputPages
		.lines()
		.filter( line => failedRule( line ) !== undefined )
		.map( line => {
			let failing: Rule | undefined;

			do {
				if ( !( failing = failedRule( line ) ) ) {
					break;
				}

				line = line.replace( failing.invalid, '$3$2,$1' );
			} while ( true );

			return line;
		} )
		.map( line => line.split( ',' ) )
		.map( pages => parseInt( pages[ Math.floor( pages.length / 2 ) ] ) )
		.sum()
}

bench( 'part 2 example', () => part2( example ), 123 );

bench( 'part 2 input', () => part2( input ) );
