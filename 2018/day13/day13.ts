import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

type CartAction = '\\' | '|' | '/';
type CartDirection = '^' | 'v' | '<' | '>';
type Curve = '\\' | '/';

class Cart {
	private static readonly actions: CartAction[] = [ '\\', '|', '/' ];

	constructor(
		public x: number,
		public y: number,
		public direction: CartDirection,
	) { }

	private actionIndex = 0;
	intersection(): void {
		this.direction = intersectionMap[ this.direction ][ Cart.actions[ this.actionIndex % Cart.actions.length ] ];
		this.actionIndex++;
	}

	get key(): string {
		return `${this.x},${this.y}`;
	}
}

function parse( input: string ): { map: string[][], carts: Cart[] } {
	const map = input
		.lines()
		.map( line => line.chars() );

	const carts: Cart[] = [];

	for ( const [ y, line ] of map.entries() ) {
		for ( const [ x, char ] of line.entries() ) {
			switch ( char ) {
				case '^':
				case 'v':
					carts.push( new Cart( x, y, char as CartDirection ) );
					map[ y ][ x ] = '|';
					break;
				case '<':
				case '>':
					carts.push( new Cart( x, y, char as CartDirection ) );
					map[ y ][ x ] = '-';
					break;
			}
		}
	}

	return {
		map,
		carts,
	}
}

function nextCoordinate( x: number, y: number, direction: CartDirection ): [ number, number ] {
	switch ( direction ) {
		default: throw new Error( `unknown direction ${direction}` );
		case '^': return [ x, y - 1 ];
		case 'v': return [ x, y + 1 ];
		case '<': return [ x - 1, y ];
		case '>': return [ x + 1, y ];
	}
}

const curveMap: Record<CartDirection, Record<Curve, CartDirection>> = {
	'^': {
		'/': '>',
		'\\': '<',
	},
	'v': {
		'/': '<',
		'\\': '>',
	},
	'<': {
		'/': 'v',
		'\\': '^',
	},
	'>': {
		'/': '^',
		'\\': 'v',
	},
}

const intersectionMap: Record<CartDirection, Record<CartAction, CartDirection>> = {
	'^': {
		'\\': '<',
		'|': '^',
		'/': '>',
	},
	'v': {
		'\\': '>',
		'|': 'v',
		'/': '<',
	},
	'<': {
		'\\': 'v',
		'|': '<',
		'/': '^',
	},
	'>': {
		'\\': '^',
		'|': '>',
		'/': 'v',
	},
}

function part1( input: string ): string {
	const { map, carts } = parse( input );
	const cartKeyIndex = new Map<string, number>( carts.map( ( cart, i ) => [ cart.key, i ] ) );
	let collision: [ number, number ];

	gameLoop: for ( let tick = 1; true; tick++ ) {
		for ( const [ cartIndex, cart ] of carts.entries() ) {
			const [ x, y ] = nextCoordinate( cart.x, cart.y, cart.direction );
			const key = `${x},${y}`;

			// Check collision
			if ( cartKeyIndex.has( key ) ) {
				collision = [ x, y ];
				break gameLoop;
			}

			// Move the cart, updating collision index
			cartKeyIndex.delete( cart.key );
			cart.x = x;
			cart.y = y;
			cartKeyIndex.set( cart.key, cartIndex );

			// Update direction based on new cell contents
			const cell = map[ y ][ x ];
			switch ( cell ) {
				default:
					throw new Error( `[tick ${tick}] Unknown map tile "${cell}" at [${key}]` );

				case ' ':
					throw new Error( `[tick ${tick}] Cart went off the rails at [${key}] going ${cart.direction}` );

				case '|':
				case '-':
					// No change
					break;

				case '\\':
				case '/':
					cart.direction = curveMap[ cart.direction ][ cell as Curve ];
					break;

				case '+':
					cart.intersection();
					break;
			}
		}

		carts.sort( ( a, b ) => ( a.y === b.y ) ? ( a.x - b.x ) : ( a.y - b.y ) );
	}

	return collision.join( ',' );
}

bench( 'part 1 example', () => part1( example ), '7,3' );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ): string {
	let { map, carts } = parse( input );
	const cartKeyIndex = new Map<string, number>( carts.map( ( cart, i ) => [ cart.key, i ] ) );
	const crashedCarts = new Set<number>();

	for ( let tick = 1; true; tick++ ) {
		for ( const [ cartIndex, cart ] of carts.entries() ) {
			if ( crashedCarts.has( cartIndex ) ) {
				continue;
			}

			const [ x, y ] = nextCoordinate( cart.x, cart.y, cart.direction );
			const key = `${x},${y}`;

			// Check collision
			if ( cartKeyIndex.has( key ) ) {
				crashedCarts.add( cartIndex );
				crashedCarts.add( cartKeyIndex.get( key )! );
				continue;
			}

			// Move the cart, updating collision index
			cartKeyIndex.delete( cart.key );
			cart.x = x;
			cart.y = y;
			cartKeyIndex.set( cart.key, cartIndex );

			// Update direction based on new cell contents
			const cell = map[ y ][ x ];
			switch ( cell ) {
				default:
					throw new Error( `[tick ${tick}] Unknown map tile "${cell}" at [${key}]` );

				case ' ':
					throw new Error( `[tick ${tick}] Cart went off the rails at [${key}] going ${cart.direction}` );

				case '|':
				case '-':
					// No change
					break;

				case '\\':
				case '/':
					cart.direction = curveMap[ cart.direction ][ cell as Curve ];
					break;

				case '+':
					cart.intersection();
					break;
			}
		}

		for ( const crashedCartIndex of crashedCarts ) {
			cartKeyIndex.delete( carts[ crashedCartIndex ].key );
		}

		carts = carts.filter( ( _, index ) => !crashedCarts.has( index ) );

		crashedCarts.clear();

		if ( carts.length === 0 ) {
			throw new Error( `[tick ${tick}] all carts crashed` );
		}

		if ( carts.length === 1 ) {
			break;
		}

		carts.sort( ( a, b ) => ( a.y === b.y ) ? ( a.x - b.x ) : ( a.y - b.y ) );
	}

	return carts.first()!.key;
}

bench( 'part 2 example', () => part2( example2 ), '6,4' );

bench( 'part 2 input', () => part2( input ) );
