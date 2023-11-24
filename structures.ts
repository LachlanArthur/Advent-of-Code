export class Tuple extends Array<number> {
	static #storage = new Map<string, Tuple>();

	constructor( ...values: number[] ) {
		super();

		const key = values.join( ',' );

		if ( Tuple.#storage.has( key ) ) {
			return Tuple.#storage.get( key )!;
		}

		this.push( ...values );

		Tuple.#storage.set( key, this );
	}
}

export function tuple( ...values: number[] ): Tuple {
	return new Tuple( ...values );
}
