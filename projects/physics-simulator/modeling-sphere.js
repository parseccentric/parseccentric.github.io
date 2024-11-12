/***
 *    ███████╗██████╗ ██╗  ██╗███████╗██████╗ ███████╗
 *    ██╔════╝██╔══██╗██║  ██║██╔════╝██╔══██╗██╔════╝
 *    ███████╗██████╔╝███████║█████╗  ██████╔╝█████╗  
 *    ╚════██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗██╔══╝  
 *    ███████║██║     ██║  ██║███████╗██║  ██║███████╗
 *    ╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
 *                                                    
 */

/**
 * For debugging purposes, get sphere statistics.
 */
function getSphereStats(vertices) {
    var retval;
    
    var leftmost = [0.0, 0.0, 0.0], 
        rightmost = [0.0, 0.0, 0.0],
        uppermost = [0.0, 0.0, 0.0],
        lowermost = [0.0, 0.0, 0.0],
        frontmost = [0.0, 0.0, 0.0],
        backmost = [0.0, 0.0, 0.0],
        average = [0.0, 0.0, 0.0];
    
    for (var i = 0; i < vertices.length; i += 3) {
        if (vertices[i] < leftmost[0]) {
            leftmost = [];
            leftmost.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }
        if (vertices[i] > rightmost[0]) {
            rightmost = [];
            rightmost.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }
        if (vertices[i + 1] < lowermost[1]) {
            lowermost = [];
            lowermost.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }
        if (vertices[i + 1] > uppermost[1]) {
            uppermost = [];
            uppermost.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }
        if (vertices[i + 2] < backmost[2]) {
            backmost = [];
            backmost.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }
        if (vertices[i + 2] > frontmost[2]) {
            frontmost = [];
            frontmost.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }
        average[0] += vertices[i];
        average[1] += vertices[i + 1];
        average[2] += vertices[i + 2];
    }
    average[0] /= vertices.length / 3.0;
    average[1] /= vertices.length / 3.0;
    average[2] /= vertices.length / 3.0;
    
    retval = {
        leftmost: leftmost,
        rightmost: rightmost,
        uppermost: uppermost,
        lowermost: lowermost,
        frontmost: frontmost,
        backmost: backmost,
        average: average
    }
    
    return retval;
}

/**
 * Push a vertex component-by-component into an array.
 * @param {[[Type]]} v      [[Description]]
 * @param {Array}    vArray [[Description]]
 */
function pushVertex(v, vArray) {
    for (i = 0; i < 3; i += 1) {
        vArray.push(v[i]);
    }  
}

/**
 * Given an existing sphere, subdivide its triangles.
 * @param   {[[Type]]} a           [[Description]]
 * @param   {[[Type]]} b           [[Description]]
 * @param   {[[Type]]} c           [[Description]]
 * @param   {[[Type]]} numSubDivs  [[Description]]
 * @param   {[[Type]]} vertexArray [[Description]]
 * @param   {[[Type]]} normalArray [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
function sphDivideTriangle(a, b, c, numSubDivs, vertexArray,normalArray) {
    if (numSubDivs > 0) {
        var numT = 0;

        var ab =  vec4.create();
        vec4.lerp(ab, a, b, 0.5);
        vec4.normalize(ab, ab);

        var ac =  vec4.create();
        vec4.lerp(ac, a, c, 0.5);
        vec4.normalize(ac, ac);

        var bc =  vec4.create();
        vec4.lerp(bc, b, c, 0.5);
        vec4.normalize(bc, bc);

        numT += sphDivideTriangle(a, ab, ac, numSubDivs-1, vertexArray, normalArray);
        numT += sphDivideTriangle(ab, b, bc, numSubDivs-1, vertexArray, normalArray);
        numT += sphDivideTriangle(bc, c, ac, numSubDivs-1, vertexArray, normalArray);
        numT += sphDivideTriangle(ab, bc, ac, numSubDivs-1, vertexArray, normalArray);
        return numT;
    } else {
        // Add 3 vertices to the array
        pushVertex(a, vertexArray);
        pushVertex(b, vertexArray);
        pushVertex(c, vertexArray);

        //normals are the same as the vertices for a sphere
        pushVertex(a, normalArray);
        pushVertex(b, normalArray);
        pushVertex(c, normalArray);

        return 1; 
    }   
}

/**
 * Create a sphere and populate vertex and normal arrays.
 * @param   {[[Type]]} numSubDivs  [[Description]]
 * @param   {[[Type]]} vertexArray [[Description]]
 * @param   {[[Type]]} normalArray [[Description]]
 * @returns {numT} Number of triangles generated
 */
function sphereFromSubdivision(numSubDivs, vertexArray, normalArray) {
    var numT = 0;
    var a = vec4.fromValues(0.0, 0.0, -1.0, 0);
    var b = vec4.fromValues(0.0, 0.942809, 0.333333, 0);
    var c = vec4.fromValues(-0.816497, -0.471405, 0.333333, 0);
    var d = vec4.fromValues(0.816497, -0.471405, 0.333333, 0);

    numT += sphDivideTriangle(a, b, c, numSubDivs, vertexArray, normalArray);
    numT += sphDivideTriangle(d, c, b, numSubDivs, vertexArray, normalArray);
    numT += sphDivideTriangle(a, d, b, numSubDivs, vertexArray, normalArray);
    numT += sphDivideTriangle(a, c, d, numSubDivs, vertexArray, normalArray);
    
    /*DEBUG*/ console.log(getSphereStats(vertexArray));
    
    return numT;
}

/***
 *    ██████╗  ██████╗ ██╗  ██╗
 *    ██╔══██╗██╔═══██╗╚██╗██╔╝
 *    ██████╔╝██║   ██║ ╚███╔╝ 
 *    ██╔══██╗██║   ██║ ██╔██╗ 
 *    ██████╔╝╚██████╔╝██╔╝ ██╗
 *    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
 *                             
 */
/**
 * Generate a box based on depth and specified dimensions.
 * @param {[[Type]]} depth [[Description]]
 * @param {[[Type]]} xMin  [[Description]]
 * @param {[[Type]]} xMax  [[Description]]
 * @param {[[Type]]} yMin  [[Description]]
 * @param {[[Type]]} yMax  [[Description]]
 * @param {[[Type]]} zMin  [[Description]]
 * @param {[[Type]]} zMax  [[Description]]
 */
function generateBox(depth, xMin, xMax, yMin, yMax, zMin, zMax) {
    var retval = {
        faceArray: [],
        vertexArray: [],
        normalArray: [],
        colorArray: []
    };

    //push vertices
    retval.vertexArray.push(xMin, yMin, zMin); //0 left bottom front 
    retval.vertexArray.push(xMin, yMin, zMax); //1 left bottom back
    retval.vertexArray.push(xMin, yMax, zMin); //2 left top front
    retval.vertexArray.push(xMin, yMax, zMax); //3 left top back
    retval.vertexArray.push(xMax, yMin, zMin); //4 right bottom front
    retval.vertexArray.push(xMax, yMin, zMax); //5 right bottom back
    retval.vertexArray.push(xMax, yMax, zMin); //6 right top front
    retval.vertexArray.push(xMax, yMax, zMax); //7 right top back

    //push faces
    retval.faceArray.push(0, 1, 2); //left 1
    retval.faceArray.push(1, 2, 3); //left 2
    retval.faceArray.push(4, 5, 6); //right 1
    retval.faceArray.push(5, 6, 7); //right 2
    retval.faceArray.push(0, 1, 4); //bottom 1
    retval.faceArray.push(1, 4, 5); //bottom 2
    retval.faceArray.push(2, 3, 6); //top 1
    retval.faceArray.push(3, 6, 7); //top 2
    retval.faceArray.push(0, 2, 4); //front 1
    retval.faceArray.push(2, 4, 6); //front 2
    retval.faceArray.push(1, 3, 5); //back 1
    retval.faceArray.push(3, 5, 7); //back 2

    //push normals
    var normals = retval.normalArray;
    for(var i = 0; i < normals; i++) {
        
    }
    
    //push colors
    
    return retval;
}













