import { Plane } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import {
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    LineBasicMaterial,
    LineSegments,
} from "three";
import { GRID_PROPS } from "../constants";
import * as THREE from "three";

class CustomGridHelper extends LineSegments {
    constructor(
        xSize = 10,
        ySize = 10,
        mainGridColor,
        subGridColor,
        stepX = 2,
        stepY = 2
    ) {
        mainGridColor = new Color(mainGridColor ?? "black");
        subGridColor = new Color(subGridColor ?? "gray");

        const halfXSize = xSize / 2;
        const halfYSize = ySize / 2;

        const vertices = [];
        const colors = [];

        let colorIndex = 0;

        for (let yIndex = -halfYSize; yIndex <= halfYSize; yIndex += stepY) {
            vertices.push(-halfXSize, 0, yIndex);
            mainGridColor.toArray(colors, colorIndex);
            colorIndex += 3;

            vertices.push(halfXSize, 0, yIndex);
            mainGridColor.toArray(colors, colorIndex);
            colorIndex += 3;
        }
        for (let xIndex = -halfXSize; xIndex <= halfXSize; xIndex += stepX) {
            vertices.push(xIndex, 0, -halfYSize);
            mainGridColor.toArray(colors, colorIndex);
            colorIndex += 3;

            vertices.push(xIndex, 0, halfYSize);
            mainGridColor.toArray(colors, colorIndex);
            colorIndex += 3;
        }

        for (
            let yIndex = -halfYSize + stepY / 2;
            yIndex <= halfYSize;
            yIndex += stepY
        ) {
            vertices.push(-halfXSize, 0, yIndex);
            subGridColor.toArray(colors, colorIndex);
            colorIndex += 3;

            vertices.push(halfXSize, 0, yIndex);
            subGridColor.toArray(colors, colorIndex);
            colorIndex += 3;
        }
        for (
            let xIndex = -halfXSize + stepX / 2;
            xIndex <= halfXSize;
            xIndex += stepX
        ) {
            vertices.push(xIndex, 0, -halfYSize);
            subGridColor.toArray(colors, colorIndex);
            colorIndex += 3;

            vertices.push(xIndex, 0, halfYSize);
            subGridColor.toArray(colors, colorIndex);
            colorIndex += 3;
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute(
            "position",
            new Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

        const material = new LineBasicMaterial({
            vertexColors: true,
            toneMapped: false,
        });

        super(geometry, material);

        this.type = "GridHelper";
    }
}
extend({ CustomGridHelper });

export function GridRenderer() {
    return (
        <>
            <customGridHelper
                args={[GRID_PROPS.size, GRID_PROPS.size, "#7f8284", "#c1c7cb"]}
            />

            {/* <Plane 
            position={[0, -0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            args={[GRID_PROPS.size, GRID_PROPS.size]}
          >
            <meshStandardMaterial attach="material" side={THREE.DoubleSide} color={0xcccccc}/>
          </Plane> */}
        </>
    );
}
