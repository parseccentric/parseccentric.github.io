/*@author bcdang2
@author UIUC SP17 CS418 Course Staff */
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

var tVertexPositionBuffer; // Create a place to store terrain geometry
var tVertexColorBuffer;// Create a place to store terrain color
var tVertexNormalBuffer;//Create a place to store normals for shading
var tIndexTriBuffer;// Create a place to store the terrain triangles
var tIndexEdgeBuffer;//Create a place to store the traingle edges

//matrices.
var nMatrix = mat3.create(); // Create the normal
var mvMatrix = mat4.create(); // Create ModelView matrix
var pMatrix = mat4.create(); // Create Projection matrix
var mvMatrixStack = []; // create a matric stack.

//variables for terrain generation.
var gridN = 7, inten = 7.0;

//dom objects.
var debugDiv;

//debug helpers
var debugMode = 1,
    debugArray = ["uninitialized"];
//start bcdang2

/**Returns the modulo of two numbers.
* @param {int} a - 
* @param {int} b - 
*/
function mod(a, b) {
    return ((a % b) + b) % b;
}


//converts deg to rad
//----------------------------------------------------------------------------------
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//set up terrain buffers and generate terrain
//-------------------------------------------------------------------------
function setupTerrainBuffers() {

    var vTerrain=[];
    var fTerrain=[];
    var cTerrain=[];
    var nTerrain=[];
    var eTerrain=[];

    var numT = ( debugMode ? 
                create3DCube(vTerrain, fTerrain, nTerrain, cTerrain) : 
                create3DTerrainArrayFromHAM(vTerrain, fTerrain, 
                                            nTerrain, cTerrain, bounds.xMin, bounds.xMax, bounds.yMin + 12.0, bounds.yMax - 12.0, gridN) );
    
    console.log("Generated ", numT, " triangles"); 
    //console.log("v", vTerrain, "\nf", fTerrain, "\nn", nTerrain);
    
    console.log(vTerrain.length + " vertices to be sent to WebGL.")
    tVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);      
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTerrain), gl.DYNAMIC_DRAW);
    tVertexPositionBuffer.itemSize = 3;
    //tVertexPositionBuffer.numItems = (gridN+1)*(gridN+1);
    tVertexPositionBuffer.numItems = vTerrain.length / 3;

    console.log(nTerrain.length + " normals to be sent to WebGL.")
    // Specify normals to be able to do lighting calculations
    tVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nTerrain),
                  gl.STATIC_DRAW);
    tVertexNormalBuffer.itemSize = 3;
    tVertexNormalBuffer.numItems = nTerrain.length / 3;
    //tVertexNormalBuffer.numItems = numT*3;

    console.log(fTerrain.length + " faces to be sent to WebGL.")
    // Specify faces of the terrain 
    tIndexTriBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fTerrain),
                  gl.STATIC_DRAW);
    tIndexTriBuffer.itemSize = 1;
    tIndexTriBuffer.numItems = fTerrain.length / 3;


    console.log(cTerrain.length + " colors to be sent to WebGL.")
    // Specify colors of the terrain
    //console.log(cTerrain);
    tVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cTerrain),
                  gl.DYNAMIC_DRAW);
    tVertexColorBuffer.itemSize = 4;
    tVertexColorBuffer.numItems = cTerrain.length / 4;
}


//draws the terrain
//-------------------------------------------------------------------------
function drawTerrain(){
    gl.polygonOffset(0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,             tVertexPositionBuffer.itemSize, 
                           gl.FLOAT, false, 0, 0);

    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                           tVertexNormalBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);   

    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                           tVertexColorBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);  


    //Draw 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.drawElements(gl.TRIANGLES, tIndexTriBuffer.numItems, gl.UNSIGNED_SHORT,0);
    //    gl.drawArrays(gl.TRIANGLES, 0, tVertexPositionBuffer.numItems);      

}









//send mvMatrix to the shader
//-------------------------------------------------------------------------
function uploadModelViewMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

//send pMatrix to shader
//-------------------------------------------------------------------------
function uploadProjectionMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

//send nMatrix to shader
//-------------------------------------------------------------------------
function uploadNormalMatrixToShader() {
    //create your nMatrix here
    //this line sets the nMatrix to the mvMatrix
    mat3.fromMat4(nMatrix, mvMatrix);
    mat3.transpose(nMatrix, nMatrix);
    mat3.invert(nMatrix, nMatrix);

    //this line sends the nMatrix to the shader
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

//push a mvMatrix onto the stack to save transformations
//----------------------------------------------------------------------------------
function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}

//pop a mvMatrix off the stack to erase transformations
//----------------------------------------------------------------------------------
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

//send all matrix to the shader
//----------------------------------------------------------------------------------
function setMatrixUniforms() {
    uploadModelViewMatrixToShader();
    uploadNormalMatrixToShader();
    uploadProjectionMatrixToShader();
}





//creates the web gl canvas
//----------------------------------------------------------------------------------
function createGLContext(canvas) {
    var names = ["webgl", "experimental-webgl"];
    var context = null;
    for (var i=0; i < names.length; i++) {
        try {
            context = canvas.getContext(names[i]);
        } catch(e) {}
        if (context) {
            break;
        }
    }
    if (context) {
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
    } else {
        alert("Failed to create WebGL context!");
    }
    return context;
}

//loads the shaders
//----------------------------------------------------------------------------------
function loadShaderFromDOM(id) {
    var shaderScript = document.getElementById(id);

    // If we don't find an element with the specified id
    // we do an early exit 
    if (!shaderScript) {
        return null;
    }

    // Loop through the children for the found DOM element and
    // build up the shader source code as a string
    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    } 
    return shader;
}

//hooks stuff up to the shaders
//----------------------------------------------------------------------------------
function setupShaders(which) {
    vertexShader = loadShaderFromDOM("shader-vs");
    fragmentShader1 = loadShaderFromDOM("shader-fs1");
    fragmentShader2 = loadShaderFromDOM("shader-fs2");

    if(which == 1.0) {
        shaderProgram = gl.createProgram(); 
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader1);
        gl.linkProgram(shaderProgram); 
    }
    else {
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader2);
        gl.linkProgram(shaderProgram); 
    }

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


    //store vCol in shaderProgram variable, then let gl see it.
    shaderProgram.vertexColorAttribute = 
        gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.vertexNormalAttribute = 
        gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    shaderProgram.uniformLightPositionLoc = 
        gl.getUniformLocation(shaderProgram, "uLightPosition");    
    shaderProgram.uniformAmbientLightColorLoc = 
        gl.getUniformLocation(shaderProgram, "uAmbientLightColor");  
    shaderProgram.uniformDiffuseLightColorLoc = 
        gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
    shaderProgram.uniformSpecularLightColorLoc = 
        gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
}

//send lights to the shader
//-------------------------------------------------------------------------
function uploadLightsToShader(loc, a, d, s) {
    gl.uniform3fv(shaderProgram.uniformLightPositionLoc, loc);
    gl.uniform3fv(shaderProgram.uniformAmbientLightColorLoc, a);
    gl.uniform3fv(shaderProgram.uniformDiffuseLightColorLoc, d);
    gl.uniform3fv(shaderProgram.uniformSpecularLightColorLoc, s);
}











//sets up the buffers for the objects
//----------------------------------------------------------------------------------
function setupBuffers() {
    setupTerrainBuffers();
}

//renders the objects with the specified transfromations
//----------------------------------------------------------------------------------
function draw() { 
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective 
    mat4.perspective(pMatrix, degToRad(60), gl.viewportWidth / 
                     gl.viewportHeight, 0.1, 200.0);


    // We want to look down -z, so create a lookat point in that direction  
    //var viewPt = vec3.create(); vec3.add(viewPt, eyePt, viewDir);
    // Then generate the lookat matrix and initialize the MV matrix to that view
    mat4.lookAt(mvMatrix, eyePt, viewPt, up);
    console.log(eyePt, viewPt, up);
    
    //Draw Terrain
    //vec3.set(transformVec,2.0,2.0,-16.0);
    mvPushMatrix();
    //mat4.translate(mvMatrix, mvMatrix, curPos);
    //mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0.0, -5.0, 0.0));
    //mat4.translate(mvMatrix, mvMatrix, forwardDir);

    //mat4.rotateX(mvMatrix, mvMatrix, 0.25 * Math.sin(offsetAngle) - degToRad(140));
    //mat4.rotateZ(mvMatrix, mvMatrix, degToRad(80));     
    //mat4.rotateZ(mvMatrix, mvMatrix, degToRad(offsetAngle2));
    setMatrixUniforms();

    //sends the lights to the shader, the second prameter is ambient and will set the color of the terrain
    uploadLightsToShader([0, 5, 0], //position
                         [1.0, 1.0, 1.0], //ambient
                         [0.3, 0.3, 0.3], //
                         [0.15, 0.15, 0.15]); //
    drawTerrain();
    mvPopMatrix();   
    
}

//animates the webpage
//----------------------------------------------------------------------------------
function animate() {
    updatePosition();
    updateMetrics();
}

//starts everthing off
//----------------------------------------------------------------------------------
function startup() {
    debugDiv = document.getElementById("debugDiv");
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
    
    setupShaders(fogOn);
    initializeSimulator();
    setupBuffers();
    setUpInput();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    tick();
}

//animates stuff every tick
//----------------------------------------------------------------------------------
function tick() {
    setTimeout(function() {
        requestAnimFrame(tick);
    }, 1000/60);
    draw();
    animate();
}

function debugPrint(string) {
    var args = Array.from(arguments);
    var i;
    for(i in args) {
        debugDiv.innerHTML += args[i];
    }
    debugDiv.innerHTML += "<br>"
}



/*
    // Calculate the vector (l) to the light source
    vec3 L = normalize(uLightPosition - vertexPositionEye3);
    
    // Transform the normal (n) to eye coordinates
    vec3 N = normalize(uNMatrix * aVertexNormal);
    
    // Calculate n dot l for diffuse lighting
    float ldotn = dot(N, L);
                                       
    // Calculate the reflection vector (r) that is needed for specular light
    vec3 R = -normalize(reflect(N, L));
    
    vec3 V = -normalize(vertexPositionEye3);
    
    float rdotv = dot(R, V);
    
    float specWeight = pow(rdotv, shininess);

    vec3 aVertexColorThree = vec3(aVertexColor.x, aVertexColor.y, aVertexColor.z);

    // Sum up all three reflection components and send to the fragment shader    
    vColor = vec4(V, 1.0); vec4((aVertexColorThree + uAmbientLightColor
                + uDiffuseLightColor * ldotn 
                + uSpecularLightColor * specWeight), 1.0); */