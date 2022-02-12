/* @author Brandon Dang
*/

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
        
        normalArray[i] = nn[0];
        normalArray[i + 1] = nn[1];
        normalArray[i + 2] = nn[2];
    }
    
    console.log(normalArray.length / 3.0 + " vertices in the normal array.", normalArray);
    
    debugArray = normalArray;
    
    return normalArray;
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
    var numT = 12;
    
    var v = [
        -1.0, 1.0, 1.0,   //left  top    back  0
        -1.0, 1.0, -1.0,  //left  top    front 1
        -1.0, -1.0, -1.0, //left  bottom front 2
        -1.0, -1.0, 1.0,  //left  bottom back  3 
        1.0, 1.0, 1.0,    //right top    back  4
        1.0, 1.0, -1.0,   //right top    front 5
        1.0, -1.0, -1.0,  //right bottom front 6
        1.0, -1.0, 1.0   //right bottom back  7
    ];
    
    for (var i in v) {
        vertices.push(v[i]);
    }
    
    var f = [
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
    ];
    
    for (var i in f) {
        faces.push(f[i]);
    }
    
    var n = setNorms(faces, vertices, normals);
    /*DEBUG*/debugArray = normals;
    
    for (var i in n) {
        normals.push(n[i]);
    }
    
    var c = [
        1.0, 1.0, 1.0, 1.0, //white for  LTB
        1.0, 0.0, 0.0, 1.0, //red for    LTF
        1.0, 0.5, 0.0, 1.0, //orange for LBF
        1.0, 1.0, 0.0, 1.0, //yellow for LBB
        0.0, 1.0, 0.0, 1.0, //green for  RTB
        0.0, 0.0, 1.0, 1.0, //blue for   RTF
        0.3, 0.0, 0.5, 1.0, //purple for RBF
        1.0, 0.0, 1.0, 1.0  //pink for   RBB
    ];
    
    for (var i in c) {
        colors.push(c[i]);
    }
    
    console.log("Create a 3D cube with 8 vertices.")
    
    return numT;
}