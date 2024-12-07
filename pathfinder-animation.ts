import { emptyDirSync } from "https://deno.land/std@0.209.0/fs/mod.ts";
import { resolve as resolveFilePath } from "https://deno.land/std@0.209.0/path/mod.ts";
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

import "./extensions.ts";
import { inferno } from "./colourmaps.ts";
import { AStar, Vertex, lineBetween } from "./pathfinder.ts";

export function aStarAnimation<V extends Vertex>(
	pathfinder: AStar<V>,
	start: V,
	end: V,
	folder: string,
	width: number,
	height: number,
	getXY: ( v: V ) => [ number, number ],
	fps = 30,
) {
	const folderPath = resolveFilePath( folder );
	const canvas = createCanvas( width, height );
	const ctx = canvas.getContext( '2d' );

	let frameNumber = 1;
	const previousFrames: [ number, number ][][] = [];
	// Keep two seconds worth of points
	const fadeFrames = fps * 2;
	const drawFrame = ( newPoints: [ number, number ][] ) => {
		ctx.save();

		ctx.fillStyle = 'black';
		ctx.fillRect( 0, 0, width, height );

		previousFrames.unshift( newPoints );
		if ( previousFrames.length > fadeFrames ) {
			previousFrames.pop();
		}

		for ( const [ index, points ] of previousFrames.entriesArray().reverse() ) {
			const strength = ( fadeFrames - index ) / fadeFrames;
			ctx.fillStyle = inferno( strength );
			for ( const [ x, y ] of points ) {
				ctx.fillRect( x, y, 1, 1 );
			}
		}

		Deno.writeFileSync( `${folderPath}/image-${frameNumber.toString().padStart( 10, '0' )}.png`, canvas.toBuffer() );
		frameNumber++;

		ctx.restore();
	}

	emptyDirSync( folderPath );

	const frameFrequency = 1000;
	const steps = pathfinder.pathSteps( start, end );
	let iteration = 1;
	let result;
	while ( !( result = steps.next() ).done ) {
		if ( iteration % frameFrequency === 0 ) {
			drawFrame( result.value.openSet.map( getXY ) );
		}

		iteration++;
	}

	// show the final path for two seconds
	for ( let i = 0; i < fps * 2; i++ ) {
		drawFrame(
			result.value
				.sliding( 2 )
				.flatMap( ( [ a, b ] ) => {
					const points: [ number, number ][] = [];

					const [ ax, ay ] = getXY( a );
					const [ bx, by ] = getXY( b );

					for ( const [ x, y ] of lineBetween( ax, ay, bx, by ) ) {
						points.push( [ x, y ] );
					}

					return points;
				} )
		);
	}

	// fade out for two seconds
	for ( let i = 0; i < fps * 2; i++ ) {
		drawFrame( [] );
	}

	const ffmpegCommand = new Deno.Command( 'ffmpeg', {
		args: [
			'-y',
			'-framerate', `${fps}`,
			'-pattern_type', 'sequence',
			'-i', `${folderPath}/image-%10d.png`,
			'-vf', "scale=w='max(1000,iw)':h='max(1000,ih)':flags=neighbor:force_original_aspect_ratio=increase:force_divisible_by=2",
			'-c:v', 'libx265',
			'-pix_fmt', 'p010le',
			`${folderPath}.mp4`,
		],
	} );

	ffmpegCommand.spawn().ref();
}
