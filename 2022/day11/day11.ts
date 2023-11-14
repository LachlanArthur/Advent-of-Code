import { bench } from '../../bench.ts';
import '../../extensions.ts';

// import example from './example.ts';
// import input from './input.ts';

export class Monkey {
	public inspectCount = 0;

	constructor(
		public items: number[],
		public operation: ( old: number ) => number,
		public modulus: number,
		public trueMonkey: number,
		public falseMonkey: number,
	) { }

	test( item: number ) {
		return item % this.modulus === 0;
	}

	turn( worryDecreaser: ( worry: number ) => number ): Record<string, number[]> {
		const throws = {};

		for ( const item of this.items ) {
			this.inspectCount++;

			let newValue = item;

			// Inspect item, update worry
			newValue = this.operation( item );

			// Decrease worry
			newValue = worryDecreaser( newValue );

			// Throw item
			const target = this.test( newValue ) ? this.trueMonkey : this.falseMonkey;

			( throws[ target ] ??= [] ).push( newValue );
		}

		this.items = [];

		return throws;
	}
}

const exampleMonkeys = () => [
	new Monkey(
		[ 79, 98 ],
		old => old * 19,
		23,
		2,
		3,
	),
	new Monkey(
		[ 54, 65, 75, 74 ],
		old => old + 6,
		19,
		2,
		0,
	),
	new Monkey(
		[ 79, 60, 97 ],
		old => old * old,
		13,
		1,
		3,
	),
	new Monkey(
		[ 74 ],
		old => old + 3,
		17,
		0,
		1,
	),
]

const inputMonkeys = () => [
	new Monkey(
		[ 63, 57 ],
		( old ) => old * 11,
		7,
		6,
		2,
	),
	new Monkey(
		[ 82, 66, 87, 78, 77, 92, 83 ],
		( old ) => old + 1,
		11,
		5,
		0,
	),
	new Monkey(
		[ 97, 53, 53, 85, 58, 54 ],
		( old ) => old * 7,
		13,
		4,
		3,
	),
	new Monkey(
		[ 50 ],
		( old ) => old + 3,
		3,
		1,
		7,
	),
	new Monkey(
		[ 64, 69, 52, 65, 73 ],
		( old ) => old + 6,
		17,
		3,
		7,
	),
	new Monkey(
		[ 57, 91, 65 ],
		( old ) => old + 5,
		2,
		0,
		6,
	),
	new Monkey(
		[ 67, 91, 84, 78, 60, 69, 99, 83 ],
		( old ) => old * old,
		5,
		2,
		4,
	),
	new Monkey(
		[ 58, 78, 69, 65 ],
		( old ) => old + 7,
		19,
		5,
		1,
	),
]

function part1( monkeys: Monkey[], rounds: number, worryDecreaser: ( worry: number ) => number ) {
	for ( let i = 0; i < rounds; i++ ) {
		for ( const monkey of monkeys ) {
			const throws = monkey.turn( worryDecreaser );

			for ( const [ throwIndex, items ] of Object.entries( throws ) as [ string, number[] ][] ) {
				monkeys[ parseInt( throwIndex ) ].items.push( ...items );
			}
		}
	}

	return monkeys
		.pluck( 'inspectCount' )
		.sortByNumberDesc()
		.takeFirst( 2 )
		.product()
}

const part1WorryDecreaser = ( x: number ) => Math.floor( x / 3 );

bench( 'part 1 example', () => part1( exampleMonkeys(), 20, part1WorryDecreaser ), 10605 );

bench( 'part 1 input', () => part1( inputMonkeys(), 20, part1WorryDecreaser ) );

const part2WorryDecreaser = ( monkeys: Monkey[] ) => {
	const modulus = monkeys.pluck( 'modulus' ).product();
	return ( x: number ) => x %= modulus;
}

bench( 'part 2 example', () => part1( exampleMonkeys(), 10000, part2WorryDecreaser( exampleMonkeys() ) ), 2713310158 );

bench( 'part 2 input', () => part1( inputMonkeys(), 10000, part2WorryDecreaser( inputMonkeys() ) ) );
