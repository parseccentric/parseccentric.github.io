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
 * Set TBN Matrices for the vertices
 * @param   {[[Type]]} faceArray   [[Description]]
 * @param   {[[Type]]} vertexArray [[Description]]
 * @param   {Array}    normalArray [[Description]]
 * @param   {Array}    tangentArray [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
function setTanAndBitan(faceArray, vertexArray, normalArray, tangentArray, bitangentArray) {
    var i;
    for (i = 0; i < vertexArray.length; i += 1) {
        tangentArray.push(0.0);
        bitangentArray.push(0.0);
    }

    for(i = 0; i < faceArray.length; i += 3) {
        //grab the relevant vertices
        var ax = vertexArray[faceArray[i] * 3 + 0],
            ay = vertexArray[faceArray[i] * 3 + 1],
            az = vertexArray[faceArray[i] * 3 + 2];
        var bx = vertexArray[faceArray[i + 1] * 3 + 0],
            by = vertexArray[faceArray[i + 1] * 3 + 1],
            bz = vertexArray[faceArray[i + 1] * 3 + 2];
        var cx = vertexArray[faceArray[i + 2] * 3 + 0],
            cy = vertexArray[faceArray[i + 2] * 3 + 1],
            cz = vertexArray[faceArray[i + 2] * 3 + 2];

        //compute u components from the vertices
        var nax = normalArray[faceArray[i]     * 3],
            ua = Math.asin(nax) / Math.PI / 2.0 + 0.5;
        var nbx = normalArray[faceArray[i + 1] * 3],
            ub = Math.asin(nbx) / Math.PI / 2.0 + 0.5;
        var ncx = normalArray[faceArray[i + 2] * 3],
            uc = Math.asin(ncx) / Math.PI / 2.0 + 0.5;

        //compute v components from the vertices
        var nay = normalArray[faceArray[i]     * 3 + 1],
            va = Math.asin(nay) / Math.PI / 2.0 + 0.5;
        var nby = normalArray[faceArray[i + 1] * 3 + 1],
            vb = Math.asin(nby) / Math.PI / 2.0 + 0.5;
        var ncy = normalArray[faceArray[i + 2] * 3 + 1],
            vc = Math.asin(ncy) / Math.PI / 2.0 + 0.5; 
        /*console.log("NAY, VA, NBY, VB, NCY, VC: ", 
                    nay, va, nby, vb, ncy, vc);
*/
        //compute the edge vectors and u and v differences
        var p1 = vec3.fromValues(bx - ax, by - ay, bz - az),
            p2 = vec3.fromValues(cx - ax, cy - ay, cz - az);
        var u1 = ub - ua, 
            u2 = uc - ua; 
        var v1 = vb - va,
            v2 = vc - va; 
        /*console.log("U1, U2, V1, P1, P2: ", u1, u2, v1, v2, p1, p2);*/

        //compute T
        var outT = vec3.create(); 
        var topTTerm1 = vec3.create(); vec3.scale(topTTerm1, p1, v2);
        var topTTerm2 = vec3.create(); vec3.scale(topTTerm2, p2, v1);
        var topTTerm = vec3.create();  vec3.subtract(topTTerm, topTTerm1, topTTerm2);
        vec3.scale(outT, topTTerm, 1.0 / (u1 * v2 - v1 * u2));
        tangentArray[faceArray[i] * 3 + 0]     += outT[0];
        tangentArray[faceArray[i] * 3 + 1]     += outT[1];
        tangentArray[faceArray[i] * 3 + 2]     += outT[2];
        tangentArray[faceArray[i + 1] * 3 + 0] += outT[0];
        tangentArray[faceArray[i + 1] * 3 + 1] += outT[1];
        tangentArray[faceArray[i + 1] * 3 + 2] += outT[2];
        tangentArray[faceArray[i + 2] * 3 + 0] += outT[0];
        tangentArray[faceArray[i + 2] * 3 + 1] += outT[1];
        tangentArray[faceArray[i + 2] * 3 + 2] += outT[2];

        //compute B
        var outB = vec3.create(); 
        var topBTerm1 = vec3.create(); vec3.scale(topBTerm1, p1, u2);
        var topBTerm2 = vec3.create(); vec3.scale(topBTerm2, p2, u1);
        var topBTerm = vec3.create();  vec3.subtract(topBTerm, topBTerm1, topBTerm2);
        vec3.scale(outB, topBTerm, 1.0 / (v1 * u2 - u1 * v2));
        bitangentArray[faceArray[i] * 3 + 0]     += outB[0];
        bitangentArray[faceArray[i] * 3 + 1]     += outB[1];
        bitangentArray[faceArray[i] * 3 + 2]     += outB[2];
        bitangentArray[faceArray[i + 1] * 3 + 0] += outB[0];
        bitangentArray[faceArray[i + 1] * 3 + 1] += outB[1];
        bitangentArray[faceArray[i + 1] * 3 + 2] += outB[2];
        bitangentArray[faceArray[i + 2] * 3 + 0] += outB[0];
        bitangentArray[faceArray[i + 2] * 3 + 1] += outB[1];
        bitangentArray[faceArray[i + 2] * 3 + 2] += outB[2];

        if(faceArray[i + 2] * 3 + 2 > normalArray.length) {
            console.log("Potential error in setTanAndBitan function.");
        }
    }

    for(i = 0; i < normalArray.length; i += 3) {
        var n = vec3.fromValues(normalArray[i],
                                normalArray[i + 1],
                                normalArray[i + 2]);

        //Gram-Schmidt Orthogonalize and normalize T
        var t = vec3.fromValues(tangentArray[i],
                                tangentArray[i + 1],
                                tangentArray[i + 2]);
        var oT = vec3.create(); 
        var nTimesNDotT = vec3.create(); vec3.scale(n, vec3.dot(n, t));
        vec3.subtract(oT, t, nTimesNDotT); //note that n is already norm'd
        vec3.normalize(oT, oT);

        tangentArray[i] = oT[0];
        tangentArray[i + 1] = oT[1];
        tangentArray[i + 2] = oT[2];

        //Gram-Schmidt Orthogonalize and normalize B
        var b = vec3.fromValues(bitangentArray[i],
                                bitangentArray[i + 1],
                                bitangentArray[i + 2]);

        var oB = vec3.create(); 
        var nTimesNDotB = vec3.create(); vec3.scale(n, vec3.dot(n, b));
        var tTimesTDotB = vec3.create(); vec3.scale(oT, vec3.dot(n, oT));
        vec3.subtract(oB, b, nTimesNDotB); vec3.subtract(oB, t, tTimesTDotB); //n & t already norm'd
        vec3.normalize(oB, oB);

        bitangentArray[i] = oB[0];
        bitangentArray[i + 1] = oB[1];
        bitangentArray[i + 2] = oB[2];
    }

    debugArray = normalArray;

    return {
        tangentArray: tangentArray,
        bitangentArray: bitangentArray
    };
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
function sphDivideTriangle(a, b, c, numSubDivs, 
                            vertexArray, normalArray, faceArray) {
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

        numT += sphDivideTriangle(a, ab, ac, 
                                  numSubDivs-1, vertexArray, normalArray, faceArray);
        numT += sphDivideTriangle(ab, b, bc, 
                                  numSubDivs-1, vertexArray, normalArray, faceArray);
        numT += sphDivideTriangle(bc, c, ac, 
                                  numSubDivs-1, vertexArray, normalArray, faceArray);
        numT += sphDivideTriangle(ab, bc, ac, 
                                  numSubDivs-1, vertexArray, normalArray, faceArray);
        return numT;
    } else {
        // Add 3 vertices to the array
        pushVertex(a, vertexArray);
        faceArray.push(vertexArray.length / 3 - 1);
        pushVertex(b, vertexArray);
        faceArray.push(vertexArray.length / 3 - 1);
        pushVertex(c, vertexArray);
        faceArray.push(vertexArray.length / 3 - 1);

        //normals are the same as the vertices for a sphere
        pushVertex(a, normalArray);
        pushVertex(b, normalArray);
        pushVertex(c, normalArray);

        //calculate texture coordinates u and v based on angle
        var u = Math.asin(a.x) / Math.PI / 2.0 + 0.5,
            v = Math.asin(a.y) / Math.PI / 2.0 + 0.5;

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
function sphereFromSubdivision(numSubDivs, vertexArray, normalArray, faceArray) {
    var numT = 0;
    var a = vec4.fromValues(0.0, 0.0, -1.0, 0);
    var b = vec4.fromValues(0.0, 0.942809, 0.333333, 0);
    var c = vec4.fromValues(-0.816497, -0.471405, 0.333333, 0);
    var d = vec4.fromValues(0.816497, -0.471405, 0.333333, 0);

    numT += sphDivideTriangle(a, b, c, numSubDivs, vertexArray, normalArray, faceArray);
    numT += sphDivideTriangle(d, c, b, numSubDivs, vertexArray, normalArray, faceArray);
    numT += sphDivideTriangle(a, d, b, numSubDivs, vertexArray, normalArray, faceArray);
    numT += sphDivideTriangle(a, c, d, numSubDivs, vertexArray, normalArray, faceArray);

    /*DEBUG*/ console.log(getSphereStats(vertexArray));

    return numT;
}

function applyBumpMap(imageObject, textureObject) {
    //Assign to texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageObject);
    
    //Set parameters: mipmapping
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    //Set parameters: wrapping
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function loadAndApplyBumpMap() {
    textureObject = gl.createTexture();
    imageObject = new Image();
    imageObject.src = textureFiles[textureIndex];
    imageObject.onload = function () {
        applyBumpMap(imageObject, textureObject);
    }
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













