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

import * as THREE from 'three';
import {ScatterPlotVisualizer} from './scatter_plot_visualizer';
import {RenderContext} from './render';
import {Styles} from "./styles";

/**
 * Creates and maintains a 2d canvas on top of the GL canvas. All labels, when
 * active, are rendered to the 2d canvas as part of the visible render pass.
 */
export class ScatterPlotVisualizerSvgLabels
    implements ScatterPlotVisualizer {
    public id = 'SVG_LABELS';
    private worldSpacePointPositions = new Float32Array(0);
    private labelsActive: boolean = true;
    private labelStrings: string[] = [];
    private fillStyle: string = 'black';
    private shadowColor: string = 'white';
    private font: string = 'bold 14px Roboto Condensed';
    private svgElement: SVGSVGElement;


    constructor(container: HTMLElement, private styles: Styles) {
        this.svgElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );

        this.svgElement.style.height = '100%';
        this.svgElement.style.width = '100%';
        this.svgElement.style.position = 'absolute';
        this.svgElement.style.pointerEvents = 'none';
        container.insertAdjacentElement('afterbegin', this.svgElement);


    }

    private clear() {
        this.svgElement.innerHTML = '';
    }

    setLabels(labelStrings: string[], positions: Float32Array) {
        this.labelStrings = labelStrings;
        this.worldSpacePointPositions = positions;
    }

    private draw(rc: RenderContext) {

        const camera = rc.camera;
        const positions = this.worldSpacePointPositions;
        const pos = new THREE.Vector3();
        const labelStrings = this.labelStrings;
        const widthHalf = (this.svgElement.clientWidth) / 2;
        const heightHalf = (this.svgElement.clientHeight) / 2;
        this.svgElement.style.font = this.font;
        for (let i = 0, k = 0; i < labelStrings.length; i++, k += 3) {
            pos.x = positions[k];
            pos.y = positions[k + 1];
            pos.z = positions[k + 2];
            pos.project(camera);
            pos.x = (pos.x * widthHalf) + widthHalf;
            pos.y = -(pos.y * heightHalf) + heightHalf;
            const label = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'text'
            );
            label.setAttribute('dominant-baseline', "middle");
            label.setAttribute('text-anchor', "middle");
            label.style.textShadow = this.shadowColor + ' -2px -2px 0px, ' + this.shadowColor +
                ' -2px 2px 0px, ' + this.shadowColor + ' 2px -2px 0px, ' + this.shadowColor + ' 2px 2px 0px';
            label.innerHTML = labelStrings[i];
            label.style.fill = this.fillStyle;
            label.setAttribute('x', '' + pos.x)
            label.setAttribute('y', '' + pos.y)
            this.svgElement.appendChild(label);
        }
    }

    onResize(newWidth: number, newHeight: number) {
        this.svgElement.style.width = newWidth + 'px';
        this.svgElement.style.height = newHeight + 'px';
    }

    onRender(rc: RenderContext) {
        this.clear();
        if (this.labelsActive) {
            this.draw(rc);
        }

    }

    dispose() {
        // this.clear();
    }

    onPointPositionsChanged(newPositions: Float32Array) { // ignore

    }

    setScene(scene: THREE.Scene) {
    }

    onPickingRender(renderContext: RenderContext) {
    }


}
