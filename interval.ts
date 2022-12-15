import './extensions';

type Point = [ number, number ];

interface End { value: number }
class EndA implements End { constructor( public value: number ) { } }
class EndB implements End { constructor( public value: number ) { } }

export class Interval {

	constructor(
		public a: number,
		public b: number,
	) { }

	toArray(): Point {
		return [ this.a, this.b ];
	}

	static combine( intervals: Interval[], adjacent = false ): Interval[] {
		const endGroups = intervals
			.flatMap( ( { a, b } ) => [ new EndA( a ), new EndB( b ) ] )
			.groupBy( 'value' )
			.entriesArray()
			.sortByNumberAsc( '0' )
			.map( ( [ key, value ] ) => [ key, value.sort( ( a, b ) => {
				if ( a instanceof EndA && b instanceof EndA ) return 0;
				if ( a instanceof EndB && b instanceof EndB ) return 0;
				if ( a instanceof EndA && b instanceof EndB ) return -1;
				return 1;
			} ) ] as [ number, End[] ] )

		const output: Interval[] = []

		let depth = 0;
		let valueA: number | undefined;
		for ( const [ value, ends ] of endGroups ) {
			for ( const end of ends ) {
				if ( end instanceof EndA ) {
					if ( !valueA ) {
						valueA = end.value;
					}
					depth++;
				}
				if ( end instanceof EndB ) {
					depth--;
				}
			}

			if ( depth === 0 ) {
				output.push( new Interval( valueA!, value ) );
				valueA = undefined;
			}
		}

		if ( adjacent ) {
			return output
				.reduce( ( output, interval ) => {
					if ( output[ output.length - 1 ]?.b === interval.a - 1 ) {
						const last = output.pop()!;
						output.push( new Interval( last.a, interval.b ) );
					} else {
						output.push( interval );
					}
					return output;
				}, [] as Interval[] );
		}

		return output;
	}

}
