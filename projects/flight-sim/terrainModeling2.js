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
    for (i = 0; i < vertexArray.length; i += 1) {
        normalArray.push(0.0);
    }
    
    
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
        normalArray[faceArray[i + 0] * 3 + 0] += n[0];
        normalArray[faceArray[i + 0] * 3 + 1] += n[1];
        normalArray[faceArray[i + 0] * 3 + 2] += n[2];
        
        normalArray[faceArray[i + 1] * 3 + 0] += n[0];
        normalArray[faceArray[i + 1] * 3 + 1] += n[1];
        normalArray[faceArray[i + 1] * 3 + 2] += n[2];
        
        normalArray[faceArray[i + 2] * 3 + 0] += n[0];
        normalArray[faceArray[i + 2] * 3 + 1] += n[1];
        normalArray[faceArray[i + 2] * 3 + 2] += n[2];
        
    }
    
    for(i = 0; i < normalArray.length; i += 3) {
        var n = vec3.fromValues(normalArray[i],
                                normalArray[i + 1],
                                normalArray[i + 2]);
        var nn = vec3.create();
        vec3.normalize(nn, n);
        
        normalArray[i] =     -nn[0];
        normalArray[i + 1] = -nn[1];
        normalArray[i + 2] = -nn[2];
    }
    
    console.log(normalArray.length / 3.0 + " vertices in the normal array.", normalArray);
    
    debugArray = normalArray;
    
    return normalArray;
}


//-------------------------------------------------------------------------










function createColorHeightMapFromHAM(heights, moisture, colors) {
    //var colors = [];
    
    for (var i in heights) {
        for (var j in heights) {
            if (heights[i][j] < 0.087) {
                colors.push(15.0/255.0);
                colors.push(20.0/255.0);                
                colors.push(50.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if (heights[i][j] < 0.10) {
                colors.push(68.0/255.0);
                colors.push(68.0/255.0);                
                colors.push(122.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if (heights[i][j] < 0.13) {
                colors.push(157.0/255.0);
                colors.push(139.0/255.0);                
                colors.push(127.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if (heights[i][j] < 0.3) {
                if(moisture[i][j] < 0.3) {
                    colors.push(209.0/255.0);
                    colors.push(185.0/255.0);                
                    colors.push(139.0/255.0);               
                    colors.push(1.0);
                    continue;
                }
                if(moisture[i][j] < 0.6) {
                    colors.push(85.0/255.0);
                    colors.push(153.0/255.0);                
                    colors.push(68.0/255.0);               
                    colors.push(1.0);
                    continue;
                }
                colors.push(52.0/255.0);
                colors.push(119.0/255.0);                
                colors.push(84.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if (heights[i][j] < 0.45) {
                if(moisture[i][j] < 0.2) {
                    colors.push(201.0/255.0);
                    colors.push(210.0/255.0);                
                    colors.push(155.0/255.0);               
                    colors.push(1.0);
                    continue;
                }
                if(moisture[i][j] < 0.4) {
                    colors.push(103.0/255.0);
                    colors.push(149.0/255.0);                
                    colors.push(87.0/255.0);               
                    colors.push(1.0);
                    continue;
                }
                colors.push(68.0/255.0);
                colors.push(136.0/255.0);                
                colors.push(87.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if(heights[i][j] < 0.67) {
                if(moisture[i][j] < 0.3) {
                    colors.push(201.0/255.0);
                    colors.push(210.0/255.0);                
                    colors.push(155.0/255.0);               
                    colors.push(1.0);
                    continue;
                }
                if(moisture[i][j] < 0.6) {
                    colors.push(136.0/255.0);
                    colors.push(153.0/255.0);                
                    colors.push(121.0/255.0);               
                    colors.push(1.0);
                    continue;
                }
                colors.push(153.0/255.0);
                colors.push(169.0/255.0);                
                colors.push(120.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if(moisture[i][j] < 0.3) {
                colors.push(136.0/255.0);
                colors.push(136.0/255.0);                
                colors.push(136.0/255.0);               
                colors.push(1.0);
                continue;
            }
            if(moisture[i][j] < 0.6) {
                colors.push(186.0/255.0);
                colors.push(187.0/255.0);                
                colors.push(171.0/255.0);               
                colors.push(1.0);
                continue;
            }
            colors.push(221.0/255.0);
            colors.push(221.0/255.0);                
            colors.push(229.0/255.0);               
            colors.push(1.0);
            continue;
        }
    }
    
    console.log("Generated (attempting to send) " + colors.length / 4.0 + " colors in the color array.");
    
    return colors;
}






/**
* sdfdsafasdfasdfasdfadsfasdf
* @param {array} level - detail level of array, or num of verts on a side of 
*   the plane.
* @param {float} moisture - array of terrain moisture noise for coloring
* @return {float} heights - array of terrain heights
*/
function generateHAMFromPerlinNoise(level, heights, moisture) {
    var height = level,
        width = level;
    
    //Create 2 seeds, one for elevation and one for moisture
    var seed1 = 1, seed2 = 2;
    
    var rng1 = new Alea(new Date().getTime());
    var rng2 = new Alea(new Date().getTime() + 1);
    
    
    //Generate two noise grids, from which we'll pull noise values
    var gen1 = new SimplexNoise(rng1);
    var gen2 = new SimplexNoise(rng2);
    
    //Create two noise functions, which we'll use to get 
    
    function noise1(nx, ny) { return gen1.noise2D(nx, ny)/2 + 0.5; }
    function noise2(nx, ny) { return gen2.noise2D(nx, ny)/2 + 0.5; }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {      
        var nx = x/width - 0.5, ny = y/height - 0.5;
        var e = (1.00 * noise1( 1 * nx,  1 * ny)
               + 0.58 * noise1( 2 * nx,  2 * ny)
               + 0.25 * noise1( 4 * nx,  4 * ny)
               + 0.13 * noise1( 8 * nx,  8 * ny)
               + 0.06 * noise1(16 * nx, 16 * ny)
               + 0.03 * noise1(32 * nx, 32 * ny));
        e /= (1.00+0.58+0.25+0.13+0.06+0.03);
        e = Math.pow(e, 5.00);
        heights[y][x] = e * inten;
          
        var m = (1.00 * noise2( 1 * nx,  1 * ny)
               + 0.75 * noise2( 2 * nx,  2 * ny)
               + 0.33 * noise2( 4 * nx,  4 * ny)
               + 0.33 * noise2( 8 * nx,  8 * ny)
               + 0.33 * noise2(16 * nx, 16 * ny)
               + 0.50 * noise2(32 * nx, 32 * ny));
        m /= (1.00+0.75+0.33+0.33+0.33+0.50);
        moisture[y][x] = m;
        /* draw biome(e, m) at x,y */
      }
    }
    
    return heights;
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
function create3DTerrainArrayFromHAM(vertexArray, faceArray, normalArray, colorArray, xMin, xMax, yMin, yMax, gridN) {
    var n = Math.pow(2, gridN);
    var heightsArray = [], 
        moistureArray = [];
    
    var i;
    for (i = 0; i < n + 1; i += 1) {
        heightsArray.push([]);
        moistureArray.push([]);
    }
    
    generateHAMFromPerlinNoise(n + 1, heightsArray, moistureArray);
    
    var N = n + 1;
    var xWidth = (xMax - xMin) / n;
    var yWidth = (yMax - yMin) / n;

    var numTris = 0;
    
    var i, j;
    for(i = 0; i < n + 1; i++) {
        for(j = 0; j < n + 1; j++) {
            vertexArray.push(xMin + xWidth * i);
            vertexArray.push(yMin + yWidth * j);
            vertexArray.push(heightsArray[i][j]);
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
    
    colorArray = createColorHeightMapFromHAM(heightsArray, moistureArray, colorArray);
    
    //debugArray = vertexArray;
    findVertexBoundaries(vertexArray);
    console.log(faceArray.length / 3.0 + " faces generated in internal function.");
    console.log(vertexArray.length / 3.0 + " vertices generated in internal function.");
    console.log(normalArray.length / 3.0 + " normals generated in internal function.");
    console.log(colorArray.length / 4.0 + " colors generated in internal function.");
    
    return numTris;
}








/**
* Create a basic 3D Cube with +Y = Green, -Y = Red, +X = Blue, 
* -X = Orange, -Z = Purple, and +Z = Yellow. Dimensions are length 2
* sides centered at the origin.
*
* @param vertices
* @param faces
* @param normals
* @param colors
*/
function create3DCube(vertices, faces, normals, colors) {
    var numT = 8;
    
    vertices = [
        -1.0, 1.0, 1.0,   //left  top    back  0
        -1.0, 1.0, -1.0,  //left  top    front 1
        -1.0, -1.0, -1.0, //left  bottom front 2
        -1.0, -1.0, 1.0,  //left  bottom back  3 
         1.0, 1.0, 1.0,    //right top    back  4
         1.0, 1.0, -1.0,   //right top    front 5
         1.0, -1.0, -1.0,  //right bottom front 6
         1.0, -1.0, 1.0   //right bottom back  7
    ]
    
    faces = [
        0, 1, 4, // top 1
        1, 4, 5, // top 2
        2, 3, 6, // bottom 1 
        3, 6, 7, // bottom 2
        4, 5, 6, // right 1
        5, 6, 7, // right 2
        0, 1, 2, // left 1
        1, 2, 3, // left 2
        1, 2, 5, // front 1
        2, 5, 6, // front 2
        0, 3, 4, // back 1
        3, 4, 7  // back 2
    ]
    
    normals = setNorms(faces, vertices, normals);
    /*DEBUG*///debugArray = normals;
    
    colors = [
        1.0, 1.0, 1.0, 1.0, //white for  LTB
        1.0, 0.0, 0.0, 1.0, //red for    LTF
        1.0, 0.5, 0.0, 1.0, //orange for LBF
        1.0, 1.0, 0.0, 1.0, //yellow for LBB
        0.0, 1.0, 0.0, 1.0, //green for  RTB
        0.0, 0.0, 1.0, 1.0, //blue for   RTF
        0.3, 0.0, 0.5, 1.0, //purple for RBF
        1.0, 0.0, 1.0, 1.0  //pink for   RBB
    ];
    
    console.log("Create a 3D cube with 8 vertices.")
    
    return numT;
}

