import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

function part1( input: string ) {
	const [ rulesInput, patternsInput ] = input.split( '\n\n' );

	const rules = rulesInput.split( ', ' );
	const patterns = patternsInput.split( '\n' );

	const uniqueRules: string[] = rules
		.filter( rule => !new RegExp( `^(${rules.without( rule ).join( '|' )})+$` ).test( rule ) );

	const uniqueCombinedRule = new RegExp( `^(${uniqueRules.join( '|' )})+$` );

	return patterns.filter( pattern => uniqueCombinedRule.test( pattern ) ).length;
}

bench( 'part 1 example', () => part1( example ), 6 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const [ rulesInput, patternsInput ] = input.split( '\n\n' );

	const rules = rulesInput.split( ', ' );
	const patterns = patternsInput.split( '\n' );

	const ruleSet = new Set( rules );
	const cache = new Map<string, number>();

	function arrangements( input: string ) {
		if ( cache.has( input ) ) {
			return cache.get( input )!;
		}

		let result = 0;

		if ( ruleSet.has( input ) ) {
			result++;
		}

		if ( input.length > 1 ) {
			for ( let i = 1; i < input.length; i++ ) {
				const left = input.slice( 0, i );
				const right = input.slice( i );

				if ( !ruleSet.has( left ) ) {
					continue;
				}

				result += arrangements( right );
			}
		}

		cache.set( input, result );

		return result;
	}

	return patterns.map( arrangements ).sum();
}

bench( 'part 2 example', () => part2( example ), 16 );

bench( 'part 2 input', () => part2( input ) );
