const { firstBy } = ( await import( 'npm:thenby' ) ).default;
import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

enum DamageType {
	slashing,
	bludgeoning,
	fire,
	cold,
	radiation,
}

enum Army {
	immune,
	infection,
}

class Group {
	constructor(
		public army: Army,
		public id: number,
		public units: number,
		public hp: number,
		public attack: number,
		public initiative: number,
		public damageType: DamageType,
		public immunities: DamageType[],
		public weaknesses: DamageType[],
	) { }
	get power() {
		return this.units * this.attack;
	}
	potentialDamage( target: Group ): number {
		if ( this.army === Army.infection && this.id === 1 && target.id === 2 ) {
			debugger;
		}
		if ( target.immunities.includes( this.damageType ) ) {
			return 0;
		}
		if ( target.weaknesses.includes( this.damageType ) ) {
			return this.power * 2;
		}
		return this.power;
	}
}

function parse( input: string ) {
	return input.split( '\n\n' )
		.flatMap( ( group, groupIndex ) => {
			const army = groupIndex as Army;
			return group
				.lines()
				.skipFirst()
				.map( ( line, groupIndex ) => {
					const id = groupIndex + 1;
					const [ units, hp, attack, initiative ] = line.extractNumbers();
					const damageType = DamageType[ line.match( /(\w+) damage/ )![ 1 ] as keyof typeof DamageType ];
					const modifiers = ( line + '()' ).match( /\(([^)]*)\)/ )![ 1 ];
					const immunities: DamageType[] = ( modifiers.match( /immune to (.+?)(?:$|;)/ )?.[ 1 ] ?? '' )
						.split( ', ' )
						.filter( String )
						.map( d => DamageType[ d as keyof typeof DamageType ] );
					const weaknesses: DamageType[] = ( modifiers.match( /weak to (.+?)(?:$|;)/ )?.[ 1 ] ?? '' )
						.split( ', ' )
						.filter( String )
						.map( d => DamageType[ d as keyof typeof DamageType ] );

					return new Group( army, id, units, hp, attack, initiative, damageType, immunities, weaknesses );
				} )
		} )
}

function simulate( groups: Group[] ): Group[] {
	const targets = new Map<Group, Group | undefined>();
	const deadGroups = new Set<Group>();

	while ( groupsOf( Army.immune ).length && groupsOf( Army.infection ).length ) {

		let totalUnits = groups.pluck( 'units' ).sum();

		// for ( const group of groups.toSorted( firstBy( 'army' ).thenBy( 'id' ) ) ) {
		// 	console.log( `${Army[ group.army ]} ${group.id} contains ${group.units} units` )
		// }
		// console.log( '' );

		for ( const group of groups.toSorted( firstBy( 'power', 'desc' ).thenBy( 'initiative', 'desc' ) ) ) {
			targets.set( group, groups
				.filter( target =>
					target.army !== group.army &&
					!targets.valuesArray().includes( target ) &&
					group.potentialDamage( target ) > 0
				)
				.toSorted(
					firstBy( ( target: Group ) => group.potentialDamage( target ), 'desc' )
						.thenBy( 'power', 'desc' )
						.thenBy( 'initiative', 'desc' )
				)
				.at( 0 ) );
		}

		for ( const attacker of groups.toSorted( firstBy( 'initiative', 'desc' ) ) ) {
			if ( deadGroups.has( attacker ) ) {
				// console.log( `${Army[ attacker.army ]} ${attacker.id} would have taken their turn, if they weren't dead` );
				continue;
			}

			const defender = targets.get( attacker );

			if ( !defender ) {
				// console.log( `${Army[ attacker.army ]} ${attacker.id} does not attack` );
				continue;
			}

			const damage = attacker.potentialDamage( defender );
			const deathToll = Math.min( defender.units, Math.floor( damage / defender.hp ) );
			// console.log( `${Army[ attacker.army ]} ${attacker.id} attacks ${Army[ defender.army ]} ${defender.id} for ${damage}, killing ${deathToll} units` );
			defender.units -= deathToll;

			if ( defender.units === 0 ) {
				// console.log( `${Army[ defender.army ]} ${defender.id} has been wiped out` );
				deadGroups.add( defender );
			}
		}
		// console.log( '' );

		groups = groups.filter( group => !deadGroups.has( group ) );

		targets.clear();
		deadGroups.clear();

		if ( totalUnits === groups.pluck( 'units' ).sum() ) {
			throw new Error( 'Stalemate' );
		}
	}

	// console.log( 'Remaining group units', groups.pluck( 'units' ) );

	return groups;

	function groupsOf( army: Army ) {
		return groups.filter( group => group.army === army );
	}
}

function part1( input: string ) {
	let groups = parse( input );

	// console.table(
	// 	groups.map( group => {
	// 		return {
	// 			army: Army[ group.army ],
	// 			id: group.id,
	// 			units: group.units,
	// 			hp: group.hp,
	// 			attack: group.attack,
	// 			initiative: group.initiative,
	// 			power: group.power,
	// 			damageType: DamageType[ group.damageType ],
	// 			immunities: group.immunities.map( x => DamageType[ x ] ),
	// 			weaknesses: group.weaknesses.map( x => DamageType[ x ] ),
	// 		};
	// 	} )
	// );

	const remainingGroups = simulate( groups );

	return remainingGroups.pluck( 'units' ).sum();
}

bench( 'part 1 example', () => part1( example ), 5216 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const groups = parse( input );

	const boosted = ( boost: number ) => groups.map( group => new Group(
		group.army,
		group.id,
		group.units,
		group.hp,
		group.attack + ( group.army === Army.immune ? boost : 0 ),
		group.initiative,
		group.damageType,
		group.immunities,
		group.weaknesses,
	) );

	let boost = 1;

	while ( true ) {
		try {
			const remainingGroups = simulate( boosted( boost ) );

			if ( remainingGroups.find( group => group.army === Army.immune ) ) {
				return remainingGroups.pluck( 'units' ).sum();
			}
		} catch ( e ) { }

		boost++;
	}
}

bench( 'part 2 example', () => part2( example ), 51 );

bench( 'part 2 input', () => part2( input ) );
