debugList = {};

//-------------------------------------------------------------------------
function planeFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(maxY-deltaY*i);
           vertexArray.push(0);
       }

    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+(n+1));
           faceArray.push(vid+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+(n+1));
           faceArray.push((vid+1) +(n+1));
       }
    //console.log(vertexArray);
    //console.log(faceArray);
}

//-------------------------------------------------------------------------

function pushVertex(v, vArray)
{
 for(i=0;i<3;i++)
 {
     vArray.push(v[i]);
 }  
}

//-------------------------------------------------------------------------
function divideTriangle(a,b,c,numSubDivs, vertexArray,fa)
{
    if (numSubDivs>0)
    {
        var numT=0;
        var ab =  vec4.create();
        vec4.lerp(ab,a,b,0.5+Math.random()*.3);
        var ac =  vec4.create();
        vec4.lerp(ac,a,c,0.5+Math.random()*.3);
        var bc =  vec4.create();
        vec4.lerp(bc,b,c,0.5+Math.random()*.3);
        
        numT+=divideTriangle(a,ab,ac,numSubDivs-1, vertexArray,fa);
        numT+=divideTriangle(ab,b,bc,numSubDivs-1, vertexArray,fa);
        numT+=divideTriangle(bc,c,ac,numSubDivs-1, vertexArray,fa);
        numT+=divideTriangle(ab,bc,ac,numSubDivs-1, vertexArray,fa);
        return numT;
    }
    else
    {
        // Add 3 vertices to the array
        
        pushVertex(a,vertexArray);
        fa.push(vertexArray.length-3);
        pushVertex(b,vertexArray);
        fa.push(vertexArray.length-6);
        pushVertex(c,vertexArray);
        fa.push(vertexArray.length-9);
        return 1;
        
    }   
}

//-------------------------------------------------------------------------
function planeFromSubdivision(n, minX,maxX,minY,maxY, vertexArray,faceArray,normalArray)
{
    var numT=0;
    var va = vec4.fromValues(minX,minY,0,0);
    var vb = vec4.fromValues(maxX,minY,Math.random(),0);
    var vc = vec4.fromValues(maxX,maxY,Math.random(),0);
    var vd = vec4.fromValues(minX,maxY,1.0,0);
    
    numT+=divideTriangle(va,vb,vd,n, vertexArray,faceArray);
    numT+=divideTriangle(vb,vc,vd,n, vertexArray,faceArray);
    
    for(var i=0; i<vertexArray.length; i=i+3)
    {
         normalArray.push(0);
         normalArray.push(0);
         normalArray.push(1);
    }
    
    return numT;
    
}

//-----------------------------------------------------------
function sphDivideTriangle(a,b,c,numSubDivs, vertexArray,normalArray)
{
    if (numSubDivs>0)
    {
        var numT=0;
        
        var ab =  vec4.create();
        vec4.lerp(ab,a,b,0.5);
        vec4.normalize(ab,ab);
        
        var ac =  vec4.create();
        vec4.lerp(ac,a,c,0.5);
        vec4.normalize(ac,ac);
        
        var bc =  vec4.create();
        vec4.lerp(bc,b,c,0.5);
        vec4.normalize(bc,bc);
        
        numT+=sphDivideTriangle(a,ab,ac,numSubDivs-1, vertexArray, normalArray);
        numT+=sphDivideTriangle(ab,b,bc,numSubDivs-1, vertexArray, normalArray);
        numT+=sphDivideTriangle(bc,c,ac,numSubDivs-1, vertexArray, normalArray);
        numT+=sphDivideTriangle(ab,bc,ac,numSubDivs-1, vertexArray, normalArray);
        return numT;
    }
    else
    {
        // Add 3 vertices to the array
        
        pushVertex(a,vertexArray);
        pushVertex(b,vertexArray);
        pushVertex(c,vertexArray);
        
        //normals are the same as the vertices for a sphere
        
        pushVertex(a,normalArray);
        pushVertex(b,normalArray);
        pushVertex(c,normalArray);
        
        return 1;
        
    }   
}

//-------------------------------------------------------------------------
function sphereFromSubdivision(numSubDivs, vertexArray, normalArray)
{
    var numT=0;
    var a = vec4.fromValues(0.0,0.0,-1.0,0);
    var b = vec4.fromValues(0.0,0.942809,0.333333,0);
    var c = vec4.fromValues(-0.816497,-0.471405,0.333333,0);
    var d = vec4.fromValues(0.816497,-0.471405,0.333333,0);
    
    numT+=sphDivideTriangle(a,b,c,numSubDivs, vertexArray, normalArray);
    numT+=sphDivideTriangle(d,c,b,numSubDivs, vertexArray, normalArray);
    numT+=sphDivideTriangle(a,d,b,numSubDivs, vertexArray, normalArray);
    numT+=sphDivideTriangle(a,c,d,numSubDivs, vertexArray, normalArray);
    return numT;
}


    
    




















/*TEAPOT IS BELOW*/
























function setUpTeapotBuffers() {
    startTeapotBuffers();
}
function startTeapotBuffers() {
	var teapotVertices = [],
        teapotFaces = [],
        teapotNormals = [];
    
    generateTeapot(teapotVertices, teapotFaces, teapotNormals);
}
function completeTeapotBuffers(vertexArray, faceArray, normalArray, numTris) {
    var teapotVertices = vertexArray, 
        teapotFaces = faceArray,
        numT = numTris;
    var teapotNormals = setNormals(teapotVertices, teapotFaces, normalArray);
    
    if(teapotVertices.length != teapotNormals.length) {
        teapotNormals.length = teapotVertices.length;
        /*DEBUG*/ console.log("Had to remove extraneous data on either vertices or normals.");
    }
    
    /*DEBUG*/ debugList["teapotNormals"] = teapotNormals; //(bcdang2: looks correct here.)
    
    /*DEBUG*/ console.log("Sending " + teapotFaces.length + " faces to WebGL.");
    /*DEBUG*/ console.log("Sending " + teapotVertices.length / 3.0 + " vertices to WebGL.");
    /*DEBUG*/ console.log("Sending " + teapotNormals.length / 3.0 + " normals to WebGL.");
    /*DEBUG*/ console.log("Sending " + teapotColors.length / 4.0 + " colors to WebGL.");
    
    console.log("Normals about to be sent: ", teapotNormals);
    
    // Specify vertices.
	teapotVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotVertices), gl.STATIC_DRAW);
	teapotVertexPositionBuffer.itemSize = 3;
	teapotVertexPositionBuffer.numItems = teapotVertices.length / 3;
    
    // Specify face indices.
	teapotFaceIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotFaceIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotFaces), gl.STATIC_DRAW);
	teapotFaceIndexBuffer.itemSize = 1;
	teapotFaceIndexBuffer.numItems = teapotFaces.length;

	// Specify normals to be able to do lighting calculations
	teapotVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotNormals), gl.STATIC_DRAW); //WebGLUtils interface says it's receiving it.
	teapotVertexNormalBuffer.itemSize = 3;
	teapotVertexNormalBuffer.numItems = teapotNormals.length / 3;
    
    // Specify colors.
    teapotColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotColors),
                 gl.STATIC_DRAW);
    teapotColorBuffer.itemSize = 4;
    teapotColorBuffer.numItems = teapotColors.length / 4.0;
    
    if((teapotVertices.length - teapotNormals.length) == 0) {
        console.log("Teapot appears to have been loaded correctly.")
    } else {
        alert("Warning: teapot appears to have been loaded incorrectly. " + 
              "Refresh the page to try again.");
    }
    
    //Signal to the draw function that the teapot is ready to draw.
    teapotLoaded = 1;
}

//-------------------------------------------------------------------------
/**
* Draws teapot from teapot buffers
*/
function drawTeapot() {
    // Bind vertex position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           teapotVertexPositionBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);

	// Bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
                           teapotVertexNormalBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);
    
    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                          teapotColorBuffer.itemSize, gl.FLOAT,
                          false, 0, 0);
    
	// Bind face buffer and draw it.
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotFaceIndexBuffer);
	gl.drawElements(gl.TRIANGLES, teapotFaceIndexBuffer.numItems, 
                    gl.UNSIGNED_SHORT, 0);
}






/*FROM SIMPLEMODELING.JS OF TEAPOT PROJECT*/
/*
* @author CS418-SP17 Course Staff
* @author bcdang2 
*/

var numTris = -1,
    teapotLoaded = 0;

/* DEBUG */ var debug0;

/**
* Populates normalArray with the per-vertex normals calculated from vertexArray and faceArray.
* 
* @param faceArray - 
* @param vertexArray - 
* @param normalArray - array to be modified. NOTE: Anything in this array will be overwritten.
* 
*/
function setNormals(vertexArray, faceArray, normalArray) {
    var i;
    var debugNormX = "",
        debugNormY = "",
        debugNormZ = "";
    
    var debugAlreadyPopulated = false;
    
    var normArray = [];
    for(i = 0; i < vertexArray.length; i += 1) {
        normArray[i] = 0.0;//Math.random();
        if(false && normalArray.length > 0 && normalArray[i] != 0) {
            debugAlreadyPopulated = false;
            console.log("Normal Array already populated with ", normalArray.length / 3.0, " normals.");
            return normalArray;
        }
    }
    
    console.log("Normal array unpopulated.  Now populating this: ", normArray);
    
    //return normArray;
    
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
        n = vec3.cross(n, v1, v2); 
        
        //add the face normal to the relevant vertex normals.
        normArray[faceArray[i + 0] * 3 + 0] += n[0]; //normal ax
        normArray[faceArray[i + 0] * 3 + 1] += n[1]; //normal ay
        normArray[faceArray[i + 0] * 3 + 2] += n[2]; //normal az
        
        normArray[faceArray[i + 1] * 3 + 0] += n[0]; //normal bx
        normArray[faceArray[i + 1] * 3 + 1] += n[1]; //normal by
        normArray[faceArray[i + 1] * 3 + 2] += n[2]; //normal bz
        
        normArray[faceArray[i + 2] * 3 + 0] += n[0]; //normal cx
        normArray[faceArray[i + 2] * 3 + 1] += n[1]; //normal cy
        normArray[faceArray[i + 2] * 3 + 2] += n[2]; //normal cz
        
        /*DEBUG*/ /* console.log("Adding normals to indices", 
                    faceArray[i + 0] * 3 + 0, ", ", 
                    faceArray[i + 0] * 3 + 1, ", ", 
                    faceArray[i + 0] * 3 + 2); */
        /*DEBUG*/ /* console.log("and ", 
                    faceArray[i + 1] * 3 + 0, ", ", 
                    faceArray[i + 1] * 3 + 1, ", ", 
                    faceArray[i + 1] * 3 + 2); */
        /*DEBUG*/ /* console.log("and ", 
                    faceArray[i + 2] * 3 + 0, ", ", 
                    faceArray[i + 2] * 3 + 1, ", ", 
                    faceArray[i + 2] * 3 + 2, "."); */
    }
    
    
    for(i = 0; i < normArray.length; i += 3) {
        var n = vec3.fromValues(normArray[i],
                                normArray[i+1],
                                normArray[i+2]);
        var nn = vec3.create();
        vec3.normalize(nn, n); 
        
        normArray[i] = nn[0];
        normArray[i+1] = nn[1];
        normArray[i+2] = nn[2];
        
        /*DEBUG*/ //debugNormX += (nn[0] + "\n");
        /*DEBUG*/ //debugNormY += (nn[1] + "\n");
        /*DEBUG*/ //debugNormZ += (nn[2] + "\n");
    }
    
    /*DEBUG*/ debug0 = normArray;
    
    /*DEBUG*/ console.log("Generated " + normArray.length / 3.0 + " normals in the setNormals function.")
    
    /*DEBUG*/ //console.log("X", debugNormX);
    /*DEBUG*/ //console.log("Y", debugNormY);
    /*DEBUG*/ //console.log("Z", debugNormZ);
    
    return normArray;
}

/**
 * Gets a file from the server for processing on the client side.
 * 
 * @param  file - A string that is the name of the file to get
 * @param  callbackFunction - The name of function (NOT a string) that will 
 *                            receive a string holding the file contents.
 * 
 */
function readTextFile(file, callbackFunction)
{
    console.log("Reading " + file);
    var rawFile = new XMLHttpRequest();
    var allText = [];
    rawFile.open("GET", file, true);
    
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                 callbackFunction(rawFile.responseText);
                 //console.log("Got text file!");
            }
        }
    }
    rawFile.send(null);
}

/**
* Populates vertex and face buffers based on raw OBJ-formatted text input.
* NOTE: this function is not meant for use with large files.  
* 
* @param file - input OBJ file.
* @param vertexArray - output GLSL-compatible vertex array.
* @param faceArray - output GLSL-compatible face array.
* @return - Number of triangles generated.
* 
*/
function populateGeometryFromOBJ(text, vertexArray, faceArray, normalArray, callback) {
    var numTriangles = 0,
        lines = text.split('\n');
    
    /*DEBUG*/ console.log("File is " + lines.length + " lines long.");
    
    vertexArray = [];
    faceArray = [];
    normalArray = [];
    
//debug variables
    var numVerticesPushed = 0,
        numFacesPushed = 0,
        othersPushed = 0;
    
    /* @TODO: move this */ teapotColors = [];
    
    for (var i in lines) {
        var elems = lines[i].split(/\s+/g);
        if (elems[0] == "v") {
            vertexArray.push(parseFloat(elems[1]));
            vertexArray.push(parseFloat(elems[2]));
            vertexArray.push(parseFloat(elems[3]));
            
            /* @TODO: Integrate this into the teapot function. */
            teapotColors.push(1.0);
            teapotColors.push(1.0);
            teapotColors.push(1.0);
            teapotColors.push(1.0);
            
            /* DEBUG */ var debugMin = 0, debugMax = 10;
            /* DEBUG */ if(numVerticesPushed >= debugMin && numVerticesPushed <= debugMax) {
            /* DEBUG *///    console.log("Vertex line " + i + ": " + lines[i]);
            /* DEBUG */ }
            
            numVerticesPushed += 1;
        }
        else if (elems[0] == "f") { // Note: here we adjust the face index from the OBJ 1-indexed value to the WebGL 0-indexed value.
            if(elems[1].indexOf("/") == -1) {
                faceArray.push(parseInt(elems[1], 10) - 1);
                faceArray.push(parseInt(elems[2], 10) - 1);
                faceArray.push(parseInt(elems[3], 10) - 1);
            } else {
                faceArray.push(parseInt(elems[1].split("/")[0], 10) - 1);
                faceArray.push(parseInt(elems[2].split("/")[0], 10) - 1);
                faceArray.push(parseInt(elems[3].split("/")[0], 10) - 1);
            }
        
            /* DEBUG */ var debugMin = 0, debugMax = 10;
            /* DEBUG */ if(numFacesPushed >= debugMin && numFacesPushed <= debugMax) {
            /* DEBUG *///    console.log("Face line " + i + ": " + elems);
            /* DEBUG */ }
            numFacesPushed += 1;
            numTriangles += 1;
        }
        else if (elems[0] == "vn") {
            normalArray.push(parseFloat(elems[1]));
            normalArray.push(parseFloat(elems[2]));
            normalArray.push(parseFloat(elems[3]));
        }
        else {
            console.log("Ignoring line " + i + ": " + lines[i]);
            othersPushed += 1;
        }
    }
    
    /*DEBUG*/ console.log("File contained ", numVerticesPushed, " vertices, ", numFacesPushed, "faces, and ", othersPushed, "other lines.");
	/*DEBUG*/ console.log("Generated ", numTriangles, " triangles for the following callback function: ", callback);
    
    debug0 = teapotColors;
    debugTeapotBuffer = vertexArray;
    
    callback(vertexArray, faceArray, normalArray, numTriangles);
}

/**
* Generates a teapot from a text file and populates the appropriate buffers.
* 
* @param vertexArray - output GLSL-compatible vertex array.
* @param faceArray - output GLSL-compatible face array.
* @return - Number of triangles generated.
*
*/
function generateTeapot(vertexArray, faceArray, normalArray) {
    var teapotLocation = "/teapot_0.obj",
        teapotLoaded = 0;
    
    /*DEBUG*/ teapotLocation = "debugTeapot.obj";
    
    readTextFile(teapotLocation, function (text) {
       populateGeometryFromOBJ(text, vertexArray, faceArray, normalArray, completeTeapotBuffers);
    });
    
    return numTris;
}
