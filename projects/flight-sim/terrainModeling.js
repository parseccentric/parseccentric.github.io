/*@author Brandon Dang
@author UIUC SP17 CS418 Course Staff */

var terrainColors = [
        [141., 143., 117., 1.],
        [88.,  93.,   73., 1.],
        [105., 108.,  75., 1.],
        [141., 135., 102., 1.],
        [139., 127., 101., 1.],
        [170., 159., 133., 1.],
        [137., 146., 137., 1.],
        [114., 134., 134., 1.]
];
var terrainLevels = [0.14, 0.19, 0.3, 0.450, 0.55, 0.75, 0.9];

//-------------------------------------------------------------------------
//sets the normals of the new terrain FILL OUT THIS FUNCTION
function setNorms(faceArray, vertexArray, normalArray) {
    var i;
    for(i = 0; i < faceArray.length; i += 3) {
        //grab the relevant vertices
        var ax = vertexArray[faceArray[i] * 3 + 0];
        var ay = vertexArray[faceArray[i] * 3 + 1];
        var az = vertexArray[faceArray[i] * 3 + 2];
        var bx = vertexArray[faceArray[i + 1] * 3 + 0];
        var by = vertexArray[faceArray[i + 1] * 3 + 1];
        var bz = vertexArray[faceArray[i + 1] * 3 + 2];
        var cx = vertexArray[faceArray[i + 2] * 3 + 0];
        var cy = vertexArray[faceArray[i + 2] * 3 + 1];
        var cz = vertexArray[faceArray[i + 2] * 3 + 2];
        
        //compute the edge vectors
        var v1 = vec3.fromValues(bx - ax, by - ay, bz - az);
        var v2 = vec3.fromValues(cx - ax, cy - ay, cz - az);
        
        //compute the face normal
        var n = vec3.create();
        vec3.cross(n, v1, v2);
        
        //add the face normal to the relevant vertex normals.
        normalArray[faceArray[i+0]*3+0] += n[0];
        normalArray[faceArray[i+0]*3+1] += n[1];
        normalArray[faceArray[i+0]*3+2] += n[2];
        
        normalArray[faceArray[i+1]*3+0] += n[0];
        normalArray[faceArray[i+1]*3+1] += n[1];
        normalArray[faceArray[i+1]*3+2] += n[2];
        
        normalArray[faceArray[i+2]*3+0] += n[0];
        normalArray[faceArray[i+2]*3+1] += n[1];
        normalArray[faceArray[i+2]*3+2] += n[2];
        
    }
    for(i = 0; i < normalArray.length; i += 3) {
        var n = vec3.fromValues(normalArray[i],
                                normalArray[i+1],
                                normalArray[i+2]);
        var nn = vec3.create();
        vec3.normalize(nn, n);
        
        normalArray[i] = nn[0];
        normalArray[i+1] = nn[1];
        normalArray[i+2] = nn[2];
    }
    console.log(normalArray.length / 3.0 + " vertices in the normal array.")
    return normalArray;
}


//-------------------------------------------------------------------------











//begin Brandon Dang
/**Take an array of 3D vertex coordinates and return a height-based color map.
* @param {array} vertexArray - 1D vertex array, where each triplet represents a point in 3D space
*/
function createColorHeightMap(vertexArray) {
    var maxHeight = -Number.MAX_SAFE_INTEGER;  
    var minHeight = Number.MAX_SAFE_INTEGER;
    var i;
    var colorArray = [];
    var percentBounds = terrainLevels; //user-defined in globals
    var boundColors = terrainColors; //user-defined in globals
    
    //find the maxHeight and minHeight.
    
    for(i = 2; i < vertexArray.length; i += 3) {
        if(vertexArray[i] > maxHeight) {
            maxHeight = vertexArray[i];
        }
        if(vertexArray[i] < minHeight) {
            minHeight = vertexArray[i];
        }
    }
    
    console.log(minHeight);
    console.log(maxHeight);
    
    //bounds.zMin = minHeight - 2 * Math.abs(maxHeight - minHeight);
    //bounds.zMax = maxHeight + 5 * Math.abs(maxHeight - minHeight);
    //maxHeight = inten;
    //minHeight = -inten;
    
    //treat like a percentage.
    for(i = 2; i < vertexArray.length; i += 3) {
        var percentHeight = Math.abs((vertexArray[i] - minHeight) / (maxHeight - minHeight));
        if(percentHeight < percentBounds[0]) {
                colorArray.push(boundColors[0][0]/256.0);
                colorArray.push(boundColors[0][1]/256.0);
                colorArray.push(boundColors[0][2]/256.0);
                colorArray.push(boundColors[0][3]/256.0); 
        }
        for(j = 0; j < percentBounds.length - 1; j++) { 
            if(percentHeight >= percentBounds[j] && percentHeight < percentBounds[j+1]) {
                colorArray.push(boundColors[j + 1][0]/256.0);
                colorArray.push(boundColors[j + 1][1]/256.0);
                colorArray.push(boundColors[j + 1][2]/256.0);
                colorArray.push(boundColors[j + 1][3]/256.0); 
            }
        }
        if(percentHeight >= percentBounds[percentBounds.length - 1]) {
                colorArray.push(boundColors[percentBounds.length][0]/256.0);
                colorArray.push(boundColors[percentBounds.length][1]/256.0);
                colorArray.push(boundColors[percentBounds.length][2]/256.0);
                colorArray.push(boundColors[percentBounds.length][3]/256.0); 
        }
        
    }
     console.log(colorArray.length / 4.0 + " colors in the color array."  )
    return colorArray;
    
}








/**Take an array that represents the heights of vertices according to their indices and 
* returns an array of 3D vertices
* @param {array} vertexArray - 1D vertex array
* @param {array} faceArray - 1D face array using indices to indicate vertices
* @param {array} normalArray - 1D normal array
* @param {float} xMin - start of the plane in 3d space, x
* @param {float} xMax - end of the plane in 3d space, x
* @param {float} yMin - start of the plane in 3d space, y
* @param {float} yMax - end of the plane in 3d space, y
* @param {int} n - number of subdivisions
*/
function create3DTerrainArray(vertexArray, faceArray, normalArray, xMin, xMax, yMin, yMax, gridN) {
    var heightsArray = generateTerrainFrom2DArray(gridN);
    
    var n = Math.pow(2, gridN);
    var N = n + 1;
    var xWidth = (xMax - xMin) / n;
    var yWidth = (yMax - yMin) / n;

    var numTris = 0;
    
    var i, j;
    for(i = 0; i <= n; i++) {
        for(j = 0; j <= n; j++) {
            vertexArray.push(xMin + xWidth * i);
            vertexArray.push(yMin + yWidth * j);
            vertexArray.push(heightsArray[i][j]);
            
            normalArray.push(0.0);
            normalArray.push(0.0);
            normalArray.push(0.0);
        }
    }
    //for every "smallest square" of vertices
    for(i = 0; i <= n - 1; i++) {
        for(j = 0; j <= n - 1; j++) {
            //push indices of upper left triangle
            faceArray.push(j + i * N); //upper left
            faceArray.push(j + i * N + 1); //upper right
            faceArray.push(j + (i + 1) * N); //lower left
            //push indices of upper right triangle
            faceArray.push(j + (i + 1) * N); //lower left
            faceArray.push(j + i * N + 1); //upper right
            faceArray.push(j + (i + 1) * N + 1); //lower right
            //keep track of the number of triangles
            numTris += 2;
        }
    }
    
    normalArray = setNorms(faceArray, vertexArray, normalArray);
    
    console.log(vertexArray.length / 3.0 + " vertices in the vertex array.")
    console.log(faceArray.length / 3.0 + " faces in the face array.")
    return numTris;
}








/** 
* Create a terrain using Diamond-Square with specified detail level and 
* return a 2D Array Heightmap.
* @param {int} level - degree of subdivisions (calculated as 2^{level})
*/
function generateTerrainFrom2DArray(level) {
    var array = [];
    var i, j;
    for(i = 0; i < Math.pow(2, level) + 1; i++) {
        array.push([]);
        for(j = 0; j < Math.pow(2, level) + 1; j++) {
            array[i][j] = 0.0;
        }
    }
    //initialize four corners
    array[0][0] = 0;
    array[Math.pow(2, level)][0] = 0;
    array[Math.pow(2, level)][Math.pow(2, level)] = 0;
    array[0][Math.pow(2, level)] = 0;
    
    //do the thing!
    diamondSquareDistort(array, array.length, 0, 0, array.length, inten);
    
    return array;
}






/** 
* Run diamond square algorithm on a given 2D Array whose entries 
* are height values for point indices.
* @param {array} array - a 2D array with domain (x, y) and range z.
* @param {int} arrayLen - the maximum length along either dimension of array.
* @param {int} startX - the index of the leftmost vertex
* @param {int} startY - the index of the topmost vertex
* @param {int} sideLen - the number of vertices in one side of the current square of vertices
* @param {float} intensity - the degree to which point heights are influenced by randomness
*/
function diamondSquareDistort(array, arrayLen, startX, startY, sideLen, intensity) {
    if(sideLen == 2) {
        return;
    }
    var DEBUG_HERE = 3;
    var numRows = 1;
    var curSize, sqXStart, sqYStart;
    for(curSize = sideLen; curSize >= 3; curSize = (curSize - 1) / 2 + 1) {
        var curDiff = curSize - 1;
        for(sqXStart = 0; sqXStart < sideLen - 1; sqXStart += (sideLen - 1)/ numRows) {
            for(sqYStart = 0; sqYStart < sideLen - 1; sqYStart += (sideLen - 1) / numRows) {
                //store various coordinates for convenience
                var left = sqXStart;
                var right = sqXStart + curDiff;
                var middleX = ((left + right) / 2);
                var top = sqYStart;
                var bottom = sqYStart + curDiff;
                var middleY = ((top + bottom) / 2);
                
                //diamond step
                var avgVal = (array[left][top] + array[right][top] + 
                              array[left][bottom] + array[right][bottom]) / 4;
                avgVal += (Math.random() - 0.5) * 2 * intensity;
                array[middleX][middleY] = avgVal;


                //square step
                var aboveValue = array[middleX][mod((middleY - curDiff), arrayLen)];
                var aboveAdd = 1;
                if(isNaN(aboveValue)) {
                    aboveValue = 0;
                    aboveAdd = 0;
                }
                
                var rightValue = array[mod((middleX + curDiff), arrayLen)][middleY];
                var rightAdd = 1;
                if(isNaN(rightValue)) {
                    rightValue = 0;
                    rightAdd = 0;
                }
                
                var belowValue = array[middleX][mod((middleY + curDiff), arrayLen)];
                var belowAdd = 1;
                if(isNaN(belowValue)) {
                    belowValue = 0;
                    belowAdd = 0;
                }

                var leftValue = array[mod((middleX - curDiff), arrayLen)][middleY];
                var leftAdd = 1;
                if(isNaN(leftValue)) {
                    leftValue = 0;
                    leftAdd = 0;
                }
                
                array[middleX][top] = (array[left][top] + 
                                       array[right][top] + 
                                       array[middleX][middleY] + 
                                       aboveValue) / (3 + aboveAdd)  + 
                                        (Math.random() - 0.5) * 2 * intensity;
                array[right][middleY] = (array[right][top] + 
                                         rightValue +
                                         array[right][bottom] + 
                                         array[middleX][middleY]) / (3 + rightAdd) +
                                        (Math.random() - 0.5) * 2 * intensity;
                array[middleX][bottom] = (array[middleX][middleY] + 
                                          array[right][bottom] + 
                                          belowValue + 
                                          array[left][bottom]) / (3 + belowAdd) +
                                          (Math.random() - 0.5) * 2 * intensity;
                array[left][middleY] = (array[left][top] + 
                                        array[middleX][middleY] + 
                                        array[left][bottom] + 
                                        leftValue) / (3 + leftAdd) +   
                                        (Math.random() - 0.5) * 2 * intensity;
            }
        }
        intensity /= 1.9;
        numRows *= 2;
    }
}
//
//end Brandon Dang

