/// <reference types="@figma/plugin-typings" />
figma.showUI(__html__, { width: 300, height: 125 });
var selectedShape = null;
var previousPathData = null;
var intervalId = null;
// **Extract points from VectorPath data**
function parsePathData(pathData) {
    var commands = pathData.match(/[ML]\s*[-\d.]+\s+[-\d.]+/g);
    if (!commands)
        return [];
    return commands.map(function (cmd) {
        var _a = cmd.split(/\s+/), _ = _a[0], x = _a[1], y = _a[2];
        return { x: parseFloat(x), y: parseFloat(y) };
    });
}
// **Calculate polygon area using Shoelace formula**
function calculatePolygonArea(points) {
    if (points.length < 3)
        return 0;
    var area = 0;
    var n = points.length;
    for (var i = 0; i < n; i++) {
        var j = (i + 1) % n;
        area += points[i].x * points[j].y - points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
}
// **Update area display based on selection**
function updateShapeArea() {
    var selection = figma.currentPage.selection;
    if (selection.length !== 1) {
        figma.ui.postMessage("Select a single shape");
        stopPolling();
        return;
    }
    var shape = selection[0];
    // If a new shape is selected, reset polling
    if (selectedShape !== shape) {
        selectedShape = shape;
        previousPathData = null;
        startPolling();
    }
    if (shape.type === "RECTANGLE") {
        var rect = shape;
        figma.ui.postMessage({ area: rect.width * rect.height });
        return;
    }
    if (shape.type === "ELLIPSE") {
        var ellipse = shape;
        var rx = ellipse.width / 2;
        var ry = ellipse.height / 2;
        var area = Math.PI * rx * ry;
        figma.ui.postMessage({ area: area });
        return;
    }
    if (shape.type === "VECTOR") {
        var vector = shape;
        if (!vector.vectorPaths || vector.vectorPaths.length === 0) {
            figma.ui.postMessage({ error: "No valid vector path found" });
            return;
        }
        var pathData = vector.vectorPaths[0].data;
        var points = parsePathData(pathData);
        if (points.length < 3) {
            figma.ui.postMessage({ error: "Invalid polygon shape" });
            return;
        }
        var area = calculatePolygonArea(points);
        figma.ui.postMessage({ area: area });
        return;
    }
    figma.ui.postMessage({ error: "Unsupported shape. Please select a rectangle, polygon, or ellipse." });
}
// **Polling to detect changes**
function startPolling() {
    if (intervalId !== null)
        return;
    intervalId = setInterval(function () {
        var _a, _b;
        if (!selectedShape)
            return;
        if (selectedShape.type === "VECTOR") {
            var vector = selectedShape;
            var currentPathData = ((_b = (_a = vector.vectorPaths) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.data) || "";
            if (currentPathData !== previousPathData) {
                previousPathData = currentPathData;
                updateShapeArea();
            }
        }
        else if (selectedShape.type === "RECTANGLE" || selectedShape.type === "ELLIPSE") {
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
