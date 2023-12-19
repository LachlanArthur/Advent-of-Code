import '../../extensions.ts';
import { bench100 } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

class Part {
	constructor(
		public x: number,
		public m: number,
		public a: number,
		public s: number,
	) { }
}

type Workflow = ( part: Part ) => string;

function part1( input: string ) {
	const [ workflowStr, partsStr ] = input.split( '\n\n' );

	const workflows = new Map<string, Workflow>();

	for ( const line of workflowStr.split( '\n' ) ) {
		const [ name, ...ruleStrs ] = line.split( /[{}|,]/g ).filter( String );

		const rules = ruleStrs.map( rule => {
			if ( rule.indexOf( ':' ) === -1 ) {
				return () => ( rule as 'A' | 'R' );
			}

			const category = rule.slice( 0, 1 ) as keyof Part;
			const operator = rule.slice( 1, 2 ) as '<' | '>';
			const [ valueStr, result ] = rule.slice( 2 ).split( ':' );
			const value = Number( valueStr );

			switch ( operator ) {
				case '<': return ( part: Part ) => part[ category ] < value ? result : null;
				case '>': return ( part: Part ) => part[ category ] > value ? result : null;
			}
		} );

		const workflow: Workflow = ( part: Part ): string => {
			for ( const rule of rules ) {
				const result = rule( part );
				if ( result !== null ) {
					return result;
				}
			}
			throw new Error( 'Workflow broke' );
		}

		workflows.set( name, workflow );
	}

	const parts: Part[] = [];

	for ( const line of partsStr.split( '\n' ) ) {
		const ratings = Object.fromEntries(
			line.slice( 1, -1 )
				.split( ',' )
				.map( line => {
					const [ category, valueStr ] = line.split( '=' );

					return [ category, Number( valueStr ) ]
				} )
		) as Record<keyof Part, number>;

		parts.push(
			new Part(
				ratings.x ?? 0,
				ratings.m ?? 0,
				ratings.a ?? 0,
				ratings.s ?? 0,
			)
		);
	}

	const accepted: Part[] = [];
	const rejected: Part[] = [];

	for ( const part of parts ) {
		let workflow = 'in';

		while ( true ) {
			const workflowFn = workflows.get( workflow );

			if ( !workflowFn ) {
				throw new Error( `Workflow ${workflow} not found` );
			}

			workflow = workflowFn( part );

			if ( workflow === 'A' ) {
				accepted.push( part );
				break;
			}

			if ( workflow === 'R' ) {
				rejected.push( part );
				break;
			}
		}
	}

	return accepted.map( ( { x, m, a, s } ) => x + m + a + s ).sum();
}

bench100( 'part 1 example', () => part1( example ), 19114 );

bench100( 'part 1 input', () => part1( input ) );

type RuleDef = {
	category: keyof Part,
	operator: '>' | '<',
	value: number,
	result: string,
}

function part2( input: string ) {
	const [ workflowStr, partsStr ] = input.split( '\n\n' );

	const workflows = new Map<string, RuleDef[]>();

	for ( const line of workflowStr.split( '\n' ) ) {
		const [ name, ...ruleStrs ] = line.split( /[{}|,]/g ).filter( String );

		const rules: RuleDef[] = ruleStrs.map( rule => {
			if ( rule.indexOf( ':' ) === -1 ) {
				return {
					category: 'a',
					operator: '>',
					value: 0,
					result: rule,
				}
			}

			const category = rule.slice( 0, 1 ) as keyof Part;
			const operator = rule.slice( 1, 2 ) as '<' | '>';
			const [ valueStr, result ] = rule.slice( 2 ).split( ':' );
			const value = Number( valueStr );

			return {
				category,
				operator,
				value,
				result,
			};
		} );

		workflows.set( name, rules );
	}

	const treeLookup = new Map<string, RuleDef>();
	for ( const [ workflow, rules ] of workflows ) {
		for ( const [ index, rule ] of rules.entries() ) {
			treeLookup.set( `${workflow},${index}`, rule );
		}
	}

	const resultMap = new Map<string, string[]>();
	for ( const [ key, { result } ] of treeLookup ) {
		resultMap.push( result, key );
	}

	const acceptancePathKeys: string[][] = expandPaths( resultMap.get( 'A' )!.map( key => [ key ] ) );
	function expandPaths( paths: string[][] ): string[][] {
		return paths.flatMap( path => {
			const next = resultMap.get( path[ 0 ].split( ',' )[ 0 ] );

			if ( !next ) {
				return [ path ];
			}

			const newPaths = next.map( next => [ next, ...path ] );

			return expandPaths( newPaths );
		} )
	}

	const acceptancePathRules = acceptancePathKeys.map( path => {
		const newPath = path.flatMap<RuleDef>( key => {
			const [ workflow, ruleStr ] = key.split( ',' );
			const ruleIndex = Number( ruleStr );

			const rules = workflows.get( workflow )!;
			const invertedPrevious = rules.slice( 0, ruleIndex )
				.map<RuleDef>( ( { category, operator, value } ) => ( {
					category,
					operator: operator === '<' ? '>' : '<',
					value: operator === '<' ? ( value - 1 ) : ( value + 1 ),
					result: '-',
				} ) )

			const newRules = [
				...invertedPrevious,
				rules[ ruleIndex ],
			];

			return newRules;
		} );
		return newPath;
	} );

	let total = 0;

	for ( const path of acceptancePathRules ) {
		let xMin = 1, xMax = 4000;
		let mMin = 1, mMax = 4000;
		let aMin = 1, aMax = 4000;
		let sMin = 1, sMax = 4000;

		for ( const { category, operator, value } of path ) {
			switch ( operator ) {
				case '>': {
					// Pull up min
					switch ( category ) {
						case 'x': xMin = Math.max( xMin, value + 1 ); break;
						case 'm': mMin = Math.max( mMin, value + 1 ); break;
						case 'a': aMin = Math.max( aMin, value + 1 ); break;
						case 's': sMin = Math.max( sMin, value + 1 ); break;
					}
					break;
				}

				case '<': {
					// Pull down max
					switch ( category ) {
						case 'x': xMax = Math.min( xMax, value - 1 ); break;
						case 'm': mMax = Math.min( mMax, value - 1 ); break;
						case 'a': aMax = Math.min( aMax, value - 1 ); break;
						case 's': sMax = Math.min( sMax, value - 1 ); break;
					}
					break;
				}
			}
		}

		xMin--;
		mMin--;
		aMin--;
		sMin--;

		total += ( xMax - xMin ) * ( mMax - mMin ) * ( aMax - aMin ) * ( sMax - sMin );
	}

	return total;
}

bench100( 'part 2 example', () => part2( example ), 167409079868000 );

bench100( 'part 2 input', () => part2( input ) );
