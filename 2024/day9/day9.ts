import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

type FileBlock = {
	id: number,
	size: number,
}

type FreeBlock = {
	id: undefined,
	size: number,
}

type Block = FileBlock | FreeBlock;

function part1( input: string ) {
	const blocks: Array<number | undefined> = input
		.chars()
		.flatMap( ( char, index ) => Array.filled( Number( char ), index % 2 === 0 ? index / 2 : undefined ) )

	let nextFree = () => blocks.findIndex( block => block === undefined );

	let freeIndex: number;

	while ( ( freeIndex = nextFree() ) !== -1 ) {
		blocks[ freeIndex ] = blocks.pop();
	}

	return blocks.map( ( value, index ) => value! * index ).sum();
}

bench( 'part 1 example', () => part1( example ), 1928 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const blocks: Array<Block> = input
		.chars()
		.map( ( char, index ): Block => ( {
			id: index % 2 === 0 ? index / 2 : undefined,
			size: Number( char ),
		} ) )

	const maxId = blocks.last()!.id as number;

	for ( let id = maxId; id >= 0; id-- ) {
		const moveIndex = blocks.findIndex( block => block.id === id );
		const moveBlock = blocks[ moveIndex ] as FileBlock;
		const freeIndex = blocks.findIndex( ( { id, size }, index ) => id === undefined && size >= moveBlock.size && index < moveIndex );

		if ( freeIndex === -1 ) {
			continue;
		}

		let spliceCount = 1;
		let freedIndex = moveIndex;
		let freedSize = moveBlock.size;

		if ( blocks[ moveIndex - 1 ] && blocks[ moveIndex - 1 ].id === undefined ) {
			spliceCount++;
			freedIndex = moveIndex - 1;
			freedSize += blocks[ moveIndex - 1 ].size;
		}

		if ( blocks[ moveIndex + 1 ] && blocks[ moveIndex + 1 ].id === undefined ) {
			spliceCount++;
			freedSize += blocks[ moveIndex + 1 ].size;
		}

		blocks.splice( freedIndex, spliceCount, {
			id: undefined,
			size: freedSize,
		} );

		if ( blocks[ freeIndex ].size === moveBlock.size ) {
			blocks[ freeIndex ] = moveBlock;
		} else {
			blocks.splice( freeIndex, 1, moveBlock, {
				id: undefined,
				size: blocks[ freeIndex ].size - moveBlock.size
			} );
		}
	}

	let checksum = 0;
	let i = 0;
	for ( const block of blocks ) {
		if ( block.id !== undefined ) {
			const blockStart = i;
			const blockEnd = i + block.size;

			for ( let j = blockStart; j < blockEnd; j++ ) {
				checksum += block.id * j;
			}
		}

		i += block.size;
	}

	return checksum;
}

bench( 'part 2 example', () => part2( example ), 2858 );

bench( 'part 2 input', () => part2( input ) );
