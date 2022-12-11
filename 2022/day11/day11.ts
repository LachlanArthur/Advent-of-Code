import '../../extensions';

// import * as example from './example';
// import input, { monkeys } from './input';

export class Monkey {
	public inspectCount = 0;

	constructor(
		public items: number[],
		public operation: ( old: number ) => number,
		public test: ( worry: number ) => boolean,
		public trueMonkey: number,
		public falseMonkey: number,
	) { }

	turn(): Record<string, number[]> {
		const throws = {};

		for ( const item of this.items ) {
			this.inspectCount++;

			let newValue = item;

			// Inspect item, update worry
			newValue = this.operation( item );

			// Decrease worry

			// Part 1 decreaser
			newValue = Math.floor( newValue / 3 );

			// Part 2 decreaser - example
			// newValue %= 23 * 19 * 13 * 17;

			// Part 2 decreaser
			// newValue %= 7 * 11 * 13 * 3 * 17 * 2 * 5 * 19;

			// Throw
			const target = this.test( newValue ) ? this.trueMonkey : this.falseMonkey;
			( throws[ target ] ??= [] ).push( newValue );
		}

		this.items = [];

		return throws;
	}
}

export const exampleMonkeys = [
	new Monkey(
		[ 79, 98 ],
		old => old * 19,
		worry => worry % 23 === 0,
		2,
		3,
	),
	new Monkey(
		[ 54, 65, 75, 74 ],
		old => old + 6,
		worry => worry % 19 === 0,
		2,
		0,
	),
	new Monkey(
		[ 79, 60, 97 ],
		old => old * old,
		worry => worry % 13 === 0,
		1,
		3,
	),
	new Monkey(
		[ 74 ],
		old => old + 3,
		worry => worry % 17 === 0,
		0,
		1,
	),
]

export const inputMonkeys = [
	new Monkey(
		[ 63, 57 ],
		( old ) => old * 11,
		( worry ) => worry % 7 === 0,
		6,
		2,
	),
	new Monkey(
		[ 82, 66, 87, 78, 77, 92, 83 ],
		( old ) => old + 1,
		( worry ) => worry % 11 === 0,
		5,
		0,
	),
	new Monkey(
		[ 97, 53, 53, 85, 58, 54 ],
		( old ) => old * 7,
		( worry ) => worry % 13 === 0,
		4,
		3,
	),
	new Monkey(
		[ 50 ],
		( old ) => old + 3,
		( worry ) => worry % 3 === 0,
		1,
		7,
	),
	new Monkey(
		[ 64, 69, 52, 65, 73 ],
		( old ) => old + 6,
		( worry ) => worry % 17 === 0,
		3,
		7,
	),
	new Monkey(
		[ 57, 91, 65 ],
		( old ) => old + 5,
		( worry ) => worry % 2 === 0,
		0,
		6,
	),
	new Monkey(
		[ 67, 91, 84, 78, 60, 69, 99, 83 ],
		( old ) => old * old,
		( worry ) => worry % 5 === 0,
		2,
		4,
	),
	new Monkey(
		[ 58, 78, 69, 65 ],
		( old ) => old + 7,
		( worry ) => worry % 19 === 0,
		5,
		1,
	),
]

function part1( monkeys: Monkey[] ) {
	const rounds = 20;

	for ( let i = 0; i < rounds; i++ ) {
		for ( const [ monkeyIndex, monkey ] of monkeys.entries() ) {
			const throws = monkey.turn();

			for ( const [ throwIndex, items ] of Object.entries( throws ) as [ string, number[] ][] ) {
				monkeys[ parseInt( throwIndex ) ].items.push( ...items );
			}
		}
	}

	return monkeys.map( monkey => monkey.inspectCount )
		.sortByNumberDesc()
		.takeFirst( 2 )
		.product()
}

console.assert( part1( exampleMonkeys ) === 10605 );

console.log( part1( inputMonkeys ) );

function part2( monkeys: Monkey[] ) {
	const rounds = 10000;

	for ( let i = 0; i < rounds; i++ ) {
		for ( const [ monkeyIndex, monkey ] of monkeys.entries() ) {
			const throws = monkey.turn();

			for ( const [ throwIndex, items ] of Object.entries( throws ) as [ string, number[] ][] ) {
				monkeys[ parseInt( throwIndex ) ].items.push( ...items );
			}
		}
	}

	return monkeys.map( monkey => monkey.inspectCount )
		.sortByNumberDesc()
		.takeFirst( 2 )
		.product()
}

console.assert( part2( exampleMonkeys ) === 2713310158 );

console.log( part2( inputMonkeys ) );
