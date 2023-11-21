import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { AStar, Vertex } from '../../pathfinder.ts';
import { renderCoords } from '../../debug.ts';

import examples from './example.ts';
import input from './input.ts';

const DEBUG_ACTIONS = false;
const DEBUG_MAP = false;
const DEBUG_PATHS = false;

abstract class Combatant {
	hp = 200;
	power = 3;
	constructor( public index: number ) { }
}
class Elf extends Combatant { }
class Goblin extends Combatant { }

export class PathfinderVertex implements Vertex {
	edges = new Map<PathfinderVertex, number>();
	traversible = true;

	constructor( public readonly index: number ) { }

	is( other: PathfinderVertex ): boolean {
		return this.index === other.index;
	}
}

class Pathfinder extends AStar<PathfinderVertex> {
	constructor( public readonly battlefield: Battlefield ) {
		super();
	}

	protected heuristic( a: PathfinderVertex, b: PathfinderVertex ): number {
		const [ ax, ay ] = this.battlefield.fromIndex( a.index );
		const [ bx, by ] = this.battlefield.fromIndex( b.index );
		return Math.abs( ax - bx ) + Math.abs( ay - by ) * this.battlefield.width; // Prioritise horizontal movement
	}
}

class Battlefield {
	readonly width!: number;
	readonly height!: number;
	obstacles = new Set<number>();
	elves = new Map<number, Elf>();
	goblins = new Map<number, Goblin>();
	pathfinderVertices = new Map<number, PathfinderVertex>();
	pathfinder: Pathfinder;

	constructor( map: string ) {
		this.pathfinder = new Pathfinder( this );

		for ( const [ y, row ] of map.lines().entries() ) {
			this.width = row.length;
			this.height = y + 1;

			for ( const [ x, cell ] of row.chars().entries() ) {
				const i = this.toIndex( x, y );

				switch ( cell ) {
					default: throw new Error( `Unknown cell ${cell}` );
					case '#':
						this.obstacles.add( i );
						break;
					case 'E':
						this.moveElfTo( new Elf( i ), i );
						this.addPathfinderVertex( i ).traversible = false;
						break;
					case 'G':
						this.moveGoblinTo( new Goblin( i ), i );
						this.addPathfinderVertex( i ).traversible = false;
						break;
					case '.':
						this.addPathfinderVertex( i ).traversible = true;
						break;
				}
			}
		}

		const directionWeights = [ this.width, 1, 1, this.width ]; // Prioritise horizontal movement

		for ( const [ index, vertex ] of this.pathfinderVertices ) {
			for ( const [ weightIndex, directionIndex ] of this.nwes( index ).entries() ) {
				if ( typeof directionIndex === 'undefined' ) continue;

				const directionVertex = this.pathfinderVertices.get( directionIndex );

				if ( !directionVertex ) continue;

				vertex.edges.set( directionVertex, directionWeights[ weightIndex ] );
			}
		}
	}

	protected addPathfinderVertex( i: number ): PathfinderVertex {
		const vertex = new PathfinderVertex( i );
		this.pathfinderVertices.set( i, vertex );
		return vertex;
	}

	toIndex( x: number, y: number ): number {
		return y * this.width + x;
	}

	fromIndex( i: number ): [ number, number ] {
		return [
			i % this.width,
			( i / this.width ) << 0,
		];
	}

	/**
	 * What's there?
	 *
	 * Return types:
	 * - `Elf`
	 * - `Goblin`
	 * - `true`: obstacle
	 * - `false`: empty space
	 * - `undefined`: out of bounds, or no arguments provided
	 */
	objectAt( i?: number ): Elf | Goblin | boolean | undefined;
	objectAt( x?: number, y?: number ): Elf | Goblin | boolean | undefined;
	objectAt( x?: number, y?: number ): Elf | Goblin | boolean | undefined {
		if ( typeof x === 'undefined' ) return undefined;

		const i = ( typeof y === 'number' ) ? this.toIndex( x, y ) : x;

		if ( this.obstacles.has( i ) ) return true;

		return this.elves.get( i ) ?? this.goblins.get( i ) ?? false;
	}

	north( i: number ): number | undefined {
		if ( i < this.width ) return undefined;
		return i - this.width;
	}

	south( i: number ): number | undefined {
		if ( i >= this.width * ( this.height - 1 ) ) return undefined;
		return i + this.width;
	}

	east( i: number ): number | undefined {
		if ( i % this.width === this.width - 1 ) return undefined;
		return i + 1;
	}

	west( i: number ): number | undefined {
		if ( i % this.width === 0 ) return undefined;
		return i - 1;
	}

	nwes( i: number ): [ number | undefined, number | undefined, number | undefined, number | undefined ] {
		return [ this.north( i ), this.west( i ), this.east( i ), this.south( i ) ];
	}

	objectsAround( i: number ): [ number | undefined, Elf | Goblin | boolean | undefined ][] {
		return this.nwes( i ).map( i => [ i, this.objectAt( i ) ] );
	}

	emptySpaceAround( i: number ): number[] {
		return this.nwes( i )
			.flatMap( i => {
				if ( typeof i === 'undefined' ) return [];
				return this.objectAt( i ) === false ? [ i ] : [];
			} );
	}

	elvesAround( i: number ): Elf[] {
		return this.combatantsAround( this.elves, i );
	}

	goblinsAround( i: number ): Goblin[] {
		return this.combatantsAround( this.goblins, i );
	}

	protected combatantsAround<T extends Combatant>( combatantMap: Map<number, T>, i: number ): T[] {
		return this
			.nwes( i )
			.flatMap<T>( i => {
				if ( isDefined( i ) ) {
					const combatant = combatantMap.get( i );
					if ( isDefined( combatant ) ) {
						return [ combatant ];
					}
				}
				return [];
			} )
			.sort( ( a, b ) => {
				if ( a.hp === b.hp ) {
					return a.index - b.index;
				}
				return a.hp - b.hp;
			} );
	}

	opponentsNear( combatant: Elf ): Goblin[];
	opponentsNear( combatant: Goblin ): Elf[];
	opponentsNear( combatant: Elf | Goblin ): Elf[] | Goblin[] {
		if ( combatant instanceof Elf ) {
			return this.goblinsAround( combatant.index );
		}

		if ( combatant instanceof Goblin ) {
			return this.elvesAround( combatant.index );
		}

		throw new Error( `Unknown combatant ${combatant}` );
	}

	moveElfTo( elf: Elf, i: number ) {
		return this.moveCombatantTo( this.elves, elf, i, );
	}

	moveGoblinTo( goblin: Goblin, i: number ) {
		return this.moveCombatantTo( this.goblins, goblin, i );
	}

	protected moveCombatantTo<T extends Combatant>( combatantMap: Map<number, T>, object: T, i: number ) {
		const oldIndex = object.index;

		if ( typeof oldIndex !== 'undefined' ) {
			combatantMap.delete( oldIndex );
		}

		object.index = i;
		combatantMap.set( i, object );
	}

	*turns(): Generator<[ number, Elf | Goblin ], number, undefined> {
		let round = 1;

		while ( true ) {
			const turns = [
				...this.elves.entriesArray(),
				...this.goblins.entriesArray(),
			].sortByNumberAsc( '0' );

			for ( const [ , combatant ] of turns ) {
				if ( this.ended ) {
					return round - 1;
				}

				if ( combatant.hp <= 0 ) {
					continue;
				}

				yield [ round, combatant ];
			}

			if ( this.ended ) {
				return round;
			}

			round++;
		}
	}

	allOpponents( combatant: Elf ): Map<number, Goblin>;
	allOpponents( combatant: Goblin ): Map<number, Elf>;
	allOpponents( combatant: Elf | Goblin ): Map<number, Elf> | Map<number, Goblin> {
		if ( combatant instanceof Elf ) {
			return this.goblins;
		}
		return this.elves;
	}

	attack( a: Elf, b: Goblin ): boolean;
	attack( a: Goblin, b: Elf ): boolean;
	attack( a: Elf | Goblin, b: Elf | Goblin ): boolean {
		DEBUG_ACTIONS && console.log( '💥 %o 💫 %o', a, b );

		if ( a.hp <= 0 ) {
			throw new Error( `${a} is dead` );
		}

		if ( b.hp <= 0 ) {
			throw new Error( `${b} is dead` );
		}

		if ( ( a instanceof Elf && b instanceof Elf ) || ( a instanceof Goblin && b instanceof Goblin ) ) {
			throw new Error( 'Friendly fire!' );
		}

		b.hp -= a.power;

		if ( b.hp > 0 ) {
			return false;
		}

		DEBUG_ACTIONS && console.log( '💀 %o', b );

		if ( b instanceof Elf ) {
			this.elves.delete( b.index );
		} else {
			this.goblins.delete( b.index );
		}

		this.pathfinderVertices.get( b.index )!.traversible = true;

		return true;
	}

	move( combatant: Elf | Goblin ): boolean {
		if ( combatant.hp <= 0 ) {
			throw new Error( `${combatant} is dead` );
		}

		const pathsByLength = new Map<number, number[][]>();

		const destinations: number[] = this.allOpponents( combatant )
			.valuesArray()
			.flatMap<number>( target => this.emptySpaceAround( target.index ) );

		for ( const startIndex of this.emptySpaceAround( combatant.index ) ) {
			const paths: number[][] = destinations
				.map( destination => this.pathfinder
					.path(
						this.pathfinderVertices.get( startIndex )!,
						this.pathfinderVertices.get( destination )!,
					)
					.map( vertex => vertex.index )
				)
				.filter( path => path.length > 0 );

			for ( const path of paths ) {
				pathsByLength.push( path.length, path );
			}
		}

		if ( pathsByLength.size === 0 ) {
			DEBUG_ACTIONS && console.log( `🚷 %o can't find a path to any targets`, combatant );
			return false;
		}

		if ( DEBUG_PATHS ) {
			console.log( '🌏 Paths %o is considering', combatant )
			for ( const path of pathsByLength.valuesArray().flat( 1 ) ) {
				console.log( '🦶 Length %o [%s]', path.length, path.join( ',' ) );
				const pathChars: [ number, string ][] = [
					...this.obstacles.valuesArray().map( i => [ i, '#' ] as [ number, string ] ),
					...path.map( i => [ i, '?' ] as [ number, string ] ),
				];
				renderCoords( [
					...this.debugCoords(),
					...pathChars.map( ( [ i, c ] ) => [ ...this.fromIndex( i ), c ] as [ number, number, string ] ),
				] );
			}
		}

		const shortestPaths = pathsByLength.get( pathsByLength.keysArray().min()! )!;

		// Tiebreak by the "reading order" of the target
		const shortestPath = shortestPaths.sort( ( a, b ) => a.last()! - b.last()! ).first()!;

		const newIndex = shortestPath.first()!;

		const directionIcon = {
			[ -this.width ]: '▲',
			[ -1 ]: '◀',
			[ 1 ]: '▶',
			[ this.width ]: '▼',
		}[ newIndex - combatant.index ];

		DEBUG_ACTIONS && console.log( '💨 %o moved %s to %o', combatant, directionIcon, newIndex );
		this.updateIndex( combatant, newIndex );

		return true;
	}

	updateIndex( combatant: Elf | Goblin, i: number ) {
		const nextVertex = this.pathfinderVertices.get( i );
		if ( !nextVertex ) {
			throw new Error( 'Moved outside the battlefield' );
		}

		const storage = combatant instanceof Elf ? this.elves : this.goblins;

		storage.delete( combatant.index );
		this.pathfinderVertices.get( combatant.index )!.traversible = true;

		combatant.index = i;

		storage.set( i, combatant );
		nextVertex.traversible = false;
	}

	get ended(): boolean {
		return this.elves.size === 0 || this.goblins.size === 0;
	}

	debugCoords() {
		return [
			...this.obstacles.valuesArray().map( i => [ ...this.fromIndex( i ), '#' ] ),
			...this.elves.keysArray().map( i => [ ...this.fromIndex( i ), 'E' ] ),
			...this.goblins.keysArray().map( i => [ ...this.fromIndex( i ), 'G' ] ),
		] as [ number, number, string ][];
	}

	render() {
		renderCoords(
			this.debugCoords(),
			( y: number ) => {
				return '  ' + [
					...this.elves.valuesArray(),
					...this.goblins.valuesArray(),
				]
					.filter( combatant => this.fromIndex( combatant.index )[ 1 ] === y )
					.sortByNumberAsc( 'index' )
					.map( combatant => ( combatant instanceof Elf ? 'E' : 'G' ) + `(📦 ${combatant.index} 🧡 ${combatant.hp})` )
					.join( ', ' );
			}
		);
	}
}

function isDefined<T>( x: T | undefined ): x is T {
	return typeof x !== 'undefined';
}

function part1( input: string ) {
	const battlefield = new Battlefield( input );

	let previousRound = 0;
	let actionsTaken = 0;
	let renderMap = true;

	const turns = battlefield.turns();
	let turn: IteratorResult<[ number, Elf | Goblin ], number>;

	while ( !( turn = turns.next() ).done ) {
		const [ round, combatant ] = turn.value;

		if ( previousRound !== round ) {
			DEBUG_MAP && renderMap && battlefield.render();

			if ( actionsTaken === 0 && previousRound > 0 ) {
				throw new Error( `🛑 Stalemate on round ${round}` );
			}

			previousRound = round;
			actionsTaken = 0;
			renderMap = false;
			DEBUG_ACTIONS && console.log( '🔔 Round %o', round );
		}

		let target: Elf | Goblin | undefined = battlefield.opponentsNear( combatant ).first();

		if ( !target && battlefield.move( combatant ) ) {
			actionsTaken++;
			renderMap = true;
			target = battlefield.opponentsNear( combatant ).first();
		}

		if ( target ) {
			if ( battlefield.attack( combatant, target ) ) {
				renderMap = true;
			}
			actionsTaken++;
		}
	}

	DEBUG_ACTIONS && console.log( '🛑 End of battle. The %s win!', battlefield.elves.size === 0 ? 'Goblins' : 'Elves' );
	DEBUG_MAP && battlefield.render();

	const finalRound = turn.value;
	const winnerHp = (
		battlefield.elves.size === 0
			? battlefield.goblins
			: battlefield.elves
	).valuesArray().pluck( 'hp' ).sum();

	return `${finalRound} * ${winnerHp} = ${finalRound * winnerHp}`;
}

for ( const [ example, answer ] of examples ) {
	bench( 'part 1 example', () => part1( example ), answer );
	// break;
}

bench( 'part 1 input', () => part1( input ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
