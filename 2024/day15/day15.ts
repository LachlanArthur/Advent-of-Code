import '../../extensions.ts';
import { bench } from '../../bench.ts';
import { aocArrow, Grid } from '../../grid.ts';
import { Cell } from '../../grid.ts';

import example1 from './example1.ts';
import example2 from './example2.ts';
import example3 from './example3.ts';
import input from './input.ts';

function part1( input: string ) {
	const [ mapInput, pathInput ] = input.split( '\n\n' );

	const map = Grid.fromString( mapInput );

	const path = Array.from( pathInput.match( /[<>^v]/g )! )
		.map( aocArrow );

	let current = map.findCell( cell => cell.value === '@' )!;

	for ( const step of path ) {
		try {
			const free = current.findInDirection( step, cell => {
				switch ( cell.value ) {
					case '#': throw new Error();
					case '.': return true;
					default: return false;
				}
			} );

			if ( !free ) {
				throw new Error();
			}

			free.value = 'O';
			current[ step ]!.value = '@';
			current.value = '.';

			current = current[ step ]!;
		} catch ( e ) {
			continue;
		}
	}

	return map.findCells( cell => cell.value === 'O' )
		.map( cell => cell.y * 100 + cell.x )
		.sum();
}

bench( 'part 1 example 1', () => part1( example1 ), 10092 );
bench( 'part 1 example 2', () => part1( example2 ), 2028 );

bench( 'part 1 input', () => part1( input ) );

type Map2 = '[' | ']' | '#' | '.' | '@';

function part2( input: string ) {
	const [ mapInput, pathInput ] = input.split( '\n\n' );

	const map = Grid.fromString<Map2>(
		mapInput.replace( /./g, '$&$&' )
			.replace( /OO/g, '[]' )
			.replace( /@@/, '@.' )
	);

	const path = Array.from( pathInput.match( /[<>^v]/g )! )
		.map( aocArrow );

	let current = map.findCell( cell => cell.value === '@' )!;

	function movable( cell: Cell<Map2>, direction: 'up' | 'down' ): Cell<'[' | ']'>[] {
		switch ( cell.value ) {
			case '@': return []; // Invalid, but impossible
			case '.': return [];
			case '[': return [
				cell as Cell<'['>,
				cell.right! as Cell<']'>,
				...movable( cell[ direction ]!, direction ),
				...movable( cell.right![ direction ]!, direction ),
			].unique();
			case ']': return [
				cell.left! as Cell<'['>,
				cell as Cell<']'>,
				...movable( cell.left![ direction ]!, direction ),
				...movable( cell[ direction ]!, direction ),
			].unique();
			case '#': throw new Error();
		}
	}

	for ( const step of path ) {
		try {
			const free = current.findInDirection( step, cell => {
				switch ( cell.value ) {
					case '#': throw new Error();
					case '.': return true;
					default: return false;
				}
			} );

			if ( !free ) {
				throw new Error();
			}

			switch ( step ) {
				case 'up':
				case 'down': {
					let moving = movable( current[ step ]!, step );
					let shift = 0;

					if ( step === 'up' ) {
						moving = moving.sortByNumberAsc( 'y' );
						shift = -1;
					} else {
						moving = moving.sortByNumberDesc( 'y' );
						shift = 1;
					}

					for ( const cell of moving ) {
						map.getCell( cell.x, cell.y + shift )!.value = cell.value;
						map.getCell( cell.x, cell.y )!.value = '.';
					}

					break;
				}
				case 'left': {
					const min = free.x + 1;
					const max = current[ step ]!.x;
					for ( let x = min; x <= max; x++ ) {
						const cell = map.getCell( x, current.y )!;
						cell.left!.value = cell.value;
					}
					break;
				}
				case 'right': {
					const min = current[ step ]!.x;
					const max = free.x - 1;
					for ( let x = max; x >= min; x-- ) {
						const cell = map.getCell( x, current.y )!;
						cell.right!.value = cell.value;
					}
					break;
				}
			}

			current[ step ]!.value = '@';
			current.value = '.';

			current = current[ step ]!;

		} catch ( e ) {
			continue;
		}
	}

	return map.findCells( cell => cell.value === '[' )
		.map( cell => cell.y * 100 + cell.x )
		.sum();
}

bench( 'part 2 example 1', () => part2( example1 ), 9021 );

bench( 'part 2 input', () => part2( input ) );
