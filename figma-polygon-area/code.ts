/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 300, height: 125 });

let selectedShape: SceneNode | null = null;
let previousPathData: string | null = null;
let intervalId: number | null = null;

// **Extract points from VectorPath data**
function parsePathData(pathData: string): { x: number; y: number }[] {
    const commands = pathData.match(/[ML]\s*[-\d.]+\s+[-\d.]+/g);
    if (!commands) return [];

    return commands.map(cmd => {
        const [_, x, y] = cmd.split(/\s+/);
        return { x: parseFloat(x), y: parseFloat(y) };
    });
}

// **Calculate polygon area using Shoelace formula**
function calculatePolygonArea(points: { x: number; y: number }[]): number {
    if (points.length < 3) return 0;

    let area = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].x * points[j].y - points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
}

// **Update area display based on selection**
function updateShapeArea() {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
        figma.ui.postMessage("Select a single shape" );
        stopPolling();
        return;
    }

    const shape = selection[0];

    // If a new shape is selected, reset polling
    if (selectedShape !== shape) {
        selectedShape = shape;
        previousPathData = null;
        startPolling();
    }

    if (shape.type === "RECTANGLE") {
        const rect = shape as RectangleNode;
        figma.ui.postMessage({ area: rect.width * rect.height });
        return;
    }

    if (shape.type === "ELLIPSE") {
        const ellipse = shape as EllipseNode;
        const rx = ellipse.width / 2;
        const ry = ellipse.height / 2;
        const area = Math.PI * rx * ry;
        figma.ui.postMessage({ area });
        return;
    }

    if (shape.type === "VECTOR") {
        const vector = shape as VectorNode;

        if (!vector.vectorPaths || vector.vectorPaths.length === 0) {
            figma.ui.postMessage({ error: "No valid vector path found" });
            return;
        }

        const pathData = vector.vectorPaths[0].data;
        const points = parsePathData(pathData);
        if (points.length < 3) {
            figma.ui.postMessage({ error: "Invalid polygon shape" });
            return;
        }

        const area = calculatePolygonArea(points);
        figma.ui.postMessage({ area });
        return;
    }

    figma.ui.postMessage({ error: "Unsupported shape. Please select a rectangle, polygon, or ellipse." });
}

// **Polling to detect changes**
function startPolling() {
    if (intervalId !== null) return;

    intervalId = setInterval(() => {
        if (!selectedShape) return;

        if (selectedShape.type === "VECTOR") {
            const vector = selectedShape as VectorNode;
            const currentPathData = vector.vectorPaths?.[0]?.data || "";

            if (currentPathData !== previousPathData) {
                previousPathData = currentPathData;
                updateShapeArea();
            }
        } else if (selectedShape.type === "RECTANGLE" || selectedShape.type === "ELLIPSE") {
            updateShapeArea();
        }
    }, 250);
}

// **Stop polling when deselecting the shape**
function stopPolling() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    selectedShape = null;
}

// Listen for selection changes
figma.on("selectionchange", updateShapeArea);

// Run once when the plugin starts
updateShapeArea();
