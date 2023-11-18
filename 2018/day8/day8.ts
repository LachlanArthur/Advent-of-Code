import '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import input from './input.ts';

class Node {
	children: Node[] = [];
	data: number[] = [];

	constructor( bytes: number[] ) {
		const [ childCount, dataCount, ...rest ] = bytes;

		for ( let childIndex = 0; childIndex < childCount; childIndex++ ) {
			this.children.push( new Node( rest.slice( this.childSize ) ) );
		}

		this.data = rest.slice( this.childSize, this.childSize + dataCount );
	}

	get childSize(): number {
		return this.children.pluck( 'size' ).sum();
	}

	get size(): number {
		return 2 + this.childSize + this.data.length;
	}

	get dataSum(): number {
		return this.data.sum();
	}

	get dataSumRecursive(): number {
		return this.dataSum + this.children.pluck( 'dataSumRecursive' ).sum();
	}

	get value(): number {
		if ( this.children.length === 0 ) {
			return this.dataSum;
		}

		let total = 0;

		for ( const index of this.data ) {
			total += ( this.children[ index - 1 ]?.value ) ?? 0;
		}

		return total;
	}
}

function part1( input: string ): number {
	const bytes = input
		.split( ' ' )
		.map( Number );

	const root = new Node( bytes );

	return root.dataSumRecursive;
}

bench( 'part 1 example', () => part1( example ), 138 );

bench( 'part 1 input', () => part1( input ) );

function part2( input: string ) {
	const bytes = input
		.split( ' ' )
		.map( Number );

	const root = new Node( bytes );

	return root.value;
}

bench( 'part 2 example', () => part2( example ), 66 );

bench( 'part 2 input', () => part2( input ) );
