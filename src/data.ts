/*
@license
Copyright 2019 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

/*
 * Metadata for each point. Each metadata is a set of key/value pairs
 * where the value can be a string or a number.
 */

export interface PointMetadata {
    label?: string;

    [key: string]: number | string | undefined;
}

/** Matches the json format of `projector_config.proto` */
export interface SpriteMetadata {
    spriteImage?: HTMLImageElement | string;
    singleSpriteSize: [number, number];
}

/** A single collection of points which make up a sequence through space. */
export interface Sequence {
    /** Indices into the DataPoints array in the Data object. */
    indices: number[];
}

export type Point2D = [number, number];
export type Point3D = [number, number, number];
export type Points = Array<Point2D | Point3D>;

const DIMENSIONALITY_ERROR_MESSAGE =
    'Points must be an array of either 2 or 3 dimensional number arrays';

export interface DatasetInterface {
    spriteMetadata?: SpriteMetadata;
    dimensions: number;
    metadata: PointMetadata[],

    getX(index: number): number;

    getY(index: number): number;

    getZ(index: number): number;

    npoints(): number;
}

export class DatasetArray implements DatasetInterface {
    public spriteMetadata?: SpriteMetadata;
    public dimensions: number;

    /**
     *
     * @param x the x data as an array
     * @param y the y data as an array
     * @param z the z data as an array
     * @param metadata an array of point metadata, corresponding to each point
     */
    constructor(public x: number[], public y: number[], public z: number[] | null = null, public metadata: PointMetadata[] = []) {
        this.dimensions = z == null ? 2 : 3;
    }

    setSpriteMetadata(spriteMetadata: SpriteMetadata) {
        this.spriteMetadata = spriteMetadata;
    }

    getX(index: number): number {
        return this.x[index];
    }

    getY(index: number): number {
        return this.y[index];
    }

    getZ(index: number): number {
        return this.z![index];
    }

    npoints(): number {
        return this.x.length;
    }
}

export class Dataset implements DatasetInterface {
    public spriteMetadata?: SpriteMetadata;
    public dimensions: number;

    /**
     *
     * @param points the data as an array of 2d or 3d number arrays
     * @param metadata an array of point metadata, corresponding to each point
     * @param sequences a collection of points that make up a sequence
     */
    constructor(public points: Points, public metadata: PointMetadata[] = []) {
        const dimensions = points[0].length;
        if (!(dimensions === 2 || dimensions === 3)) {
            throw new Error(DIMENSIONALITY_ERROR_MESSAGE);
        }
        for (const point of points) {
            if (dimensions !== point.length) {
                throw new Error(DIMENSIONALITY_ERROR_MESSAGE);
            }
        }
        this.dimensions = dimensions;
    }

    setSpriteMetadata(spriteMetadata: SpriteMetadata) {
        this.spriteMetadata = spriteMetadata;
    }

    getX(index: number): number {
        return this.points[index][0];
    }

    getY(index: number): number {
        return this.points[index][1];
    }

    getZ(index: number): number {
        return this.points[index][2]!;
    }

    npoints(): number {
        return this.points.length;
    }
}
