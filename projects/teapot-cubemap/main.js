/*@author bcdang2
@author UIUC SP17 CS418 Course Staff */
/* Corresponds to MP3-B-v2 in my personal files */
var gl, canvas, 
    vertexShaderS,    vertexShaderT,
    fragmentShaderS,  fragmentShaderT1,   fragmentShaderT2,
    shaderProgramS,   shaderProgramT1,    shaderProgramT2,
    shaderProgram;
//Transformation Matrices
var nMatrix0, nMatrix1,// = mat3.create(); //normal matrix
    mvMatrix0, mvMatrixT, mvMatrixL,// = mat4.create(); //ModelView matrix
    pMatrix, rMatrix,
    mvMatrixStack, mvMatrixTStack;
//Scene parameters
var timeInc,     teapotScale, teapotPos,
    lightScale,  lightLocX,   lightLocY,    lightLocZ,
    lightAmb,    lightDif,    lightSpec,    lightShin;
// View parameters
var eyePt,  viewDir,  up,  viewPt, 
    curWorldX,  curWorldY,
    textureLoaded; // = vec3.fromValues(0.0, 0.0, 1.0);

//Sphere variables
var sphereVertexPositionBuffer, //buffer for sphere geometry
    sphereVertexNormalBuffer, //buffer for normals
    sphereDetail = 6; //number of subdivisions
//Teapot variables
var teapotVertexPositionBuffer, teapotFaceIndexBuffer,
    teapotVertexNormalBuffer, teapotColorBuffer,
    teapotColors, teapotLoaded, teapotShaderMode;
//Cube Map variables
var cubeImageXP, cubeImageXN, cubeImageYP, cubeImageYN, cubeImageZP, cubeImageZN,
    cubeTexture;

//Debug Variables
var doDebugPrint,
    debugList,
    firstDraw,
    debugTeapotBuffer;

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








function initializeGlobals() {
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
    
    timeInc = 0; teapotScale = 0.1; lightScale = 0.5;
    lightLocX = -10.0; lightLocY = 4.0; lightLocZ = 20.0;
    
    lightAmb = 1.0; lightDif = 1.0; lightSpec = 1.0; lightShin = 500;
    
    sphereDetail = 6;

    teapotPos = -2.0; teapotLoaded = 0; teapotShaderMode = 0;
    
    curWorldX = 0.0; curWorldY = 0.0; textureLoaded = 0;
    
    eyePt = vec3.fromValues(0.0, 0.0, -0.999);
    viewDir = vec3.fromValues(0.0, 0.0, 1.0);
    up = vec3.fromValues(0.0, 1.0, 0.0);
    viewPt = vec3.fromValues(0.0, 0.0, 1.0);
    
    nMatrix0 = mat4.create(); //normal matrix
    nMatrix1 = mat3.create();
    mvMatrix0 = mat4.create(); //ModelView matrix
    mvMatrixT = mat4.create(); //ModelView matrix
    mvMatrixL = mat4.create(); //ModelView matrix
    pMatrix = mat4.create(); //Projection matrix
    rMatrix = mat4.create();
    
    mvMatrixStack = [];
    mvMatrixTStack = [];
    
    doDebugPrint = 0;
    debugList = {};
    firstDraw = 1;
}








/*
* @param gl - 
* @param target - 
* @param texture -
* @param url - 
*/
function loadCubeMapFace(gl, target, object, texture, url) {
    // TODO: Also this.
    /* From "How do I load a cube map texture? */
    /* From "HelloTexture.js" */
    //construct a new Image 
    object = new Image();
    //set the image onload function to 
    object.onload = function () {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, object);
        
        textureLoaded += 1;
    };
    //set the image src to url
    object.src = url;
}

function setUpCubeMap() {
    // TODO: This.  Current State: Filled in from discussion solution...
    /* From "How do I set up a cube map texture? */
    /* and "->demo" */
    /* From demo from lecture */
    /* From solution in discussion */
    cubeTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, 
                  gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    
    //clamp texture edges to edges
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //use bilinear interpolation
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    //load each face in.
    loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
                    cubeImageXP, cubeTexture, "imgxpos.jpg");//http://i.imgur.com/AQ2J9ar.jpg");//imgxpos.jpg");
    loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                    cubeImageXN, cubeTexture, "imgxneg.jpg");//http://i.imgur.com/GKaf5Ze.jpg"); //"/imgxneg.jpg");
    loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
                    cubeImageYP, cubeTexture, "imgypos.jpg");//http://i.imgur.com/KOCRidV.jpg"); //"/imgypos.jpg");
    loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                    cubeImageYN, cubeTexture, "imgyneg.jpg");//http://i.imgur.com/7OeHfgm.jpg"); //"/imgyneg.jpg");
    loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
                    cubeImageZP, cubeTexture, "imgzpos.jpg");//http://i.imgur.com/7c72D83.jpg"); //"/imgzpos.jpg");
    loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
                    cubeImageZN, cubeTexture, "imgzneg.jpg");//http://i.imgur.com/vaJljbd.jpg"); //"/imgzneg.jpg");
}

//-------------------------------------------------------------------------
/**
* Populates buffers with data for spheres
*/
function setUpSphereBuffers() {
    var sphereSoup = [],
        sphereNormals = [],
        numT = sphereFromSubdivision(sphereDetail, sphereSoup, sphereNormals);
    /*DEBUG*/ console.log("Generated ", numT, " triangles");
    
    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereSoup), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = numT * 3;
    /*DEBUG*/ console.log(sphereSoup.length / 9);

    // Specify normals to be able to do lighting calculations
    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals),
                  gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = numT * 3;

    /*DEBUG*/// console.log("Normals ", sphereNormals);
    console.log("Loaded sphere data into WebGL buffers.");
}

//-------------------------------------------------------------------------
/**
* Draws a sphere from the sphere buffer
*/
function drawSphere() {
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramS.vertexPositionAttribute,
                           sphereVertexPositionBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);

    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgramS.vertexNormalAttribute,
                           sphereVertexNormalBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);
    
    //Draw it
    gl.drawArrays(gl.TRIANGLES, 0, sphereVertexPositionBuffer.numItems);
}








//push a mvMatrix onto the stack to save transformations
//----------------------------------------------------------------------------------
function mvPushMatrix(which) {
    var copy = mat4.clone(mvMatrixT);
    mvMatrixStack.push(copy);
}

//pop a mvMatrix off the stack to erase transformations
//----------------------------------------------------------------------------------
function mvPopMatrix(which) {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrixT = mvMatrixStack.pop();
}

//send all matrix to the shader
//----------------------------------------------------------------------------------
function setSkyboxMatrixUniforms() {
    shaderProgram = shaderProgramS;
    //ModelView Matrices
    gl.uniformMatrix4fv(shaderProgramS.mvMatrixUniform, false, mvMatrix0);
    //Projection Matrix
    gl.uniformMatrix4fv(shaderProgramS.pMatrixUniform, false, pMatrix);
    //Normal Matrix
    mat3.fromMat4(nMatrix1, mvMatrix0);
    mat3.invert(nMatrix1, nMatrix1);
    mat3.transpose(nMatrix1, nMatrix1);
    gl.uniformMatrix3fv(shaderProgramS.nMatrixUniform, false, nMatrix1);
}

function setTeapotMatrixUniforms(which) {
    if(which == 0) {
        //ModelView Matrices
        gl.uniformMatrix4fv(shaderProgramT1.mvMatrixUniform, false, mvMatrix0);
        gl.uniformMatrix4fv(shaderProgramT1.mvMatrixTUniform, false, mvMatrixT);
        gl.uniformMatrix4fv(shaderProgramT1.mvMatrixLUniform, false, mvMatrixL);
        //Projection Matrix
        gl.uniformMatrix4fv(shaderProgramT1.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramT1.rMatrixUniform, false, rMatrix);
        //Normal Matrix
        mat3.fromMat4(nMatrix1, mvMatrixT);
        mat3.invert(nMatrix1, nMatrix1);
        mat3.transpose(nMatrix1, nMatrix1);
        gl.uniformMatrix3fv(shaderProgramT1.nMatrixUniform, false, nMatrix1);
    }
    if(which == 1) {
        //ModelView Matrices
        gl.uniformMatrix4fv(shaderProgramT2.mvMatrixUniform, false, mvMatrix0);
        gl.uniformMatrix4fv(shaderProgramT2.mvMatrixTUniform, false, mvMatrixT);
        gl.uniformMatrix4fv(shaderProgramT2.mvMatrixLUniform, false, mvMatrixL);
        //Projection Matrix
        gl.uniformMatrix4fv(shaderProgramT2.pMatrixUniform, false, pMatrix);
        //Normal Matrix
        mat3.fromMat4(nMatrix1, mvMatrixT);
        mat3.invert(nMatrix1, nMatrix1);
        mat3.transpose(nMatrix1, nMatrix1);
        gl.uniformMatrix3fv(shaderProgramT2.nMatrixUniform, false, nMatrix1);
    }
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
    var shaderSource = "",
        currentChild = shaderScript.firstChild,
        shader;
    while (currentChild) {
        if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

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
function setUpShaders() {
    // Get and compile skybox shaders.
    vertexShaderS = loadShaderFromDOM("shaderSkybox-vs");
    fragmentShaderS = loadShaderFromDOM("shaderSkybox-fs");

    shaderProgramS = gl.createProgram();
    gl.attachShader(shaderProgramS, vertexShaderS);
    gl.attachShader(shaderProgramS, fragmentShaderS);
    gl.linkProgram(shaderProgramS); 
    
    if (!gl.getProgramParameter(shaderProgramS, gl.LINK_STATUS)) {
        alert("Failed to set up skybox shader.");
    }

    // Get and compile teapot shaders.
    vertexShaderT = loadShaderFromDOM("shader-vs");
    fragmentShaderT1 = loadShaderFromDOM("shader-fs1");
    fragmentShaderT2 = loadShaderFromDOM("shader-fs2");
    
    shaderProgramT1 = gl.createProgram(); 
    gl.attachShader(shaderProgramT1, vertexShaderT);
    gl.attachShader(shaderProgramT1, fragmentShaderT1);
    gl.linkProgram(shaderProgramT1); 

    if (!gl.getProgramParameter(shaderProgramT1, gl.LINK_STATUS)) {
        alert("Failed to set up teapot shader 1.");
    }

    shaderProgramT2 = gl.createProgram();
    gl.attachShader(shaderProgramT2, vertexShaderT);
    gl.attachShader(shaderProgramT2, fragmentShaderT2);
    gl.linkProgram(shaderProgramT2); 
    
    if (!gl.getProgramParameter(shaderProgramT2, gl.LINK_STATUS)) {
        alert("Failed to set up teapot shader 2.");
    }
}

function useSkyboxShader() {
    shaderProgram = shaderProgramS; 

    shaderProgramS.vertexPositionAttribute = gl.getAttribLocation(shaderProgramS, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramS.vertexPositionAttribute);

    shaderProgramS.vertexNormalAttribute = gl.getAttribLocation(shaderProgramS, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgramS.vertexNormalAttribute);

    shaderProgramS.mvMatrixUniform = gl.getUniformLocation(shaderProgramS, "uMVMatrix");
    shaderProgramS.pMatrixUniform = gl.getUniformLocation(shaderProgramS, "uPMatrix");
    shaderProgramS.nMatrixUniform = gl.getUniformLocation(shaderProgramS, "uNMatrix");

    shaderProgramS.uniformCubeSamplerLoc = gl.getUniformLocation(shaderProgramS, "uCubeSampler");

    gl.useProgram(shaderProgramS);
}
function useTeapotShader(which) {
    if(which == 0) {
        shaderProgram = shaderProgramT1;

        shaderProgramT1.vertexPositionAttribute = gl.getAttribLocation(shaderProgramT1, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgramT1.vertexPositionAttribute);

        shaderProgramT1.vertexColorAttribute = 
            gl.getAttribLocation(shaderProgramT1, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgramT1.vertexColorAttribute);

        shaderProgramT1.vertexNormalAttribute = 
            gl.getAttribLocation(shaderProgramT1, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgramT1.vertexNormalAttribute);

        shaderProgramT1.mvMatrixUniform =  gl.getUniformLocation(shaderProgramT1, "uMVMatrix");
        shaderProgramT1.mvMatrixTUniform = gl.getUniformLocation(shaderProgramT1, "uMVMatrixT");
        shaderProgramT1.mvMatrixLUniform = gl.getUniformLocation(shaderProgramT1, "uMVMatrixL");
        shaderProgramT1.pMatrixUniform =   gl.getUniformLocation(shaderProgramT1, "uPMatrix");
        shaderProgramT1.nMatrixUniform =   gl.getUniformLocation(shaderProgramT1, "uNMatrix");
        shaderProgramT1.rMatrixUniform =   gl.getUniformLocation(shaderProgramT1, "rMatrix");

        shaderProgramT1.uniformLightPositionLoc =      gl.getUniformLocation(shaderProgramT1, "uLightPosition");    
        shaderProgramT1.uniformAmbientLightColorLoc =  gl.getUniformLocation(shaderProgramT1, "uAmbientLightColor");  
        shaderProgramT1.uniformDiffuseLightColorLoc =  gl.getUniformLocation(shaderProgramT1, "uDiffuseLightColor");
        shaderProgramT1.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgramT1, "uSpecularLightColor");

        shaderProgramT1.uniformCubeSamplerLoc = gl.getUniformLocation(shaderProgramT1, "uCubeSampler");

        gl.useProgram(shaderProgramT1);
    }
    if(which == 1) {
        shaderProgram = shaderProgramT2; 

        shaderProgramT2.vertexPositionAttribute = gl.getAttribLocation(shaderProgramT2, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgramT2.vertexPositionAttribute);

        shaderProgramT2.vertexColorAttribute = gl.getAttribLocation(shaderProgramT2, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgramT2.vertexColorAttribute);

        shaderProgramT2.vertexNormalAttribute = gl.getAttribLocation(shaderProgramT2, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgramT2.vertexNormalAttribute);

        shaderProgramT2.mvMatrixUniform =  gl.getUniformLocation(shaderProgramT2, "uMVMatrix");
        shaderProgramT2.mvMatrixTUniform = gl.getUniformLocation(shaderProgramT2, "uMVMatrixT");
        shaderProgramT2.mvMatrixLUniform = gl.getUniformLocation(shaderProgramT2, "uMVMatrixL");
        shaderProgramT2.pMatrixUniform =   gl.getUniformLocation(shaderProgramT2, "uPMatrix");
        shaderProgramT2.nMatrixUniform =   gl.getUniformLocation(shaderProgramT2, "uNMatrix");

        shaderProgramT2.uniformLightPositionLoc = gl.getUniformLocation(shaderProgramT2, "uLightPosition");    
        shaderProgramT2.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgramT2, "uAmbientLightColor");  
        shaderProgramT2.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgramT2, "uDiffuseLightColor");
        shaderProgramT2.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgramT2, "uSpecularLightColor");

        gl.useProgram(shaderProgramT2);
    }
}

//send lights to the shader
//-------------------------------------------------------------------------
function uploadLightsToShader(loc, a, d, s) {
    if(shaderProgram == shaderProgramT1) {
        gl.uniform3fv(shaderProgramT1.uniformLightPositionLoc, loc);
        gl.uniform3fv(shaderProgramT1.uniformAmbientLightColorLoc, a);
        gl.uniform3fv(shaderProgramT1.uniformDiffuseLightColorLoc, d);
        gl.uniform3fv(shaderProgramT1.uniformSpecularLightColorLoc, s);
        
    }
    if(shaderProgram == shaderProgramT2) {
        gl.uniform3fv(shaderProgramT2.uniformLightPositionLoc, loc);
        gl.uniform3fv(shaderProgramT2.uniformAmbientLightColorLoc, a);
        gl.uniform3fv(shaderProgramT2.uniformDiffuseLightColorLoc, d);
        gl.uniform3fv(shaderProgramT2.uniformSpecularLightColorLoc, s);
        
    }
}











//sets up the buffers for the objects
//----------------------------------------------------------------------------------
function setUpBuffers() {
    setUpSphereBuffers();
    if (setUpTeapotBuffers) {
        setUpTeapotBuffers();
    }
}

//renders the objects with the specified transfromations
//----------------------------------------------------------------------------------
function draw() { 
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective 
    mat4.perspective(pMatrix, degToRad(60), gl.viewportWidth / 
                     gl.viewportHeight, 0.1, 200.0);

    /*repurposed for teapot testing*/
    //startLoc = vec3.fromValues(idealX, idealY, idealZ);
    startLoc = vec3.fromValues(0.0, 0.0, -3.0);
    startViewDir = vec3.fromValues(0.0, 0.0, 1.0);
    startUp = vec3.fromValues(0.0, 1.0, 0.0);
    startMoveDir = vec3.fromValues(0.0, 1.0, 0.0);

    // We want to look down -z, so create a lookat point in that direction  
    var viewPt = vec3.create(); vec3.add(viewPt, eyePt, viewDir);
    // Then generate the lookat matrix and initialize the MV matrix to that view
    
    //Draw Skybox
    useSkyboxShader();
    mat4.lookAt(mvMatrix0, eyePt, viewPt, up);
    //mat4.rotateX(mvMatrix0, mvMatrix0, degToRad(worldX % 360.0));
    mat4.rotateY(mvMatrix0, mvMatrix0, degToRad(worldY % 360.0));
    if(textureLoaded == 6) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
        gl.uniform1i(shaderProgramS.uniformCubeSamplerLoc, 1);
        gl.enableVertexAttribArray(shaderProgramS.uniformCubeSamplerLoc);
    }
    setSkyboxMatrixUniforms();
    drawSphere();

    //Draw Teapot
    useTeapotShader(teapotShaderMode);
    mat4.lookAt(mvMatrixT, eyePt, viewPt, up);
    mat4.lookAt(mvMatrixL, eyePt, viewPt, up);
    mat4.rotateY(mvMatrixL, mvMatrixL, degToRad(worldY + 180 % 360.0));
    mvPushMatrix();
    rMatrix = mat4.fromValues(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    mat4.rotateY(rMatrix, rMatrix, -degToRad(worldY + 180 % 360.0)); //Rotate reflection.
    //mat4.rotateX(rMatrix, rMatrix, degToRad(worldX % 360.0));
    mat4.rotateY(mvMatrixT, mvMatrixT, degToRad((worldY + teapotY) % 360.0)); //Rotate teapot.
    mat4.rotateX(mvMatrixT, mvMatrixT, degToRad((/*worldX + */teapotX) % 360.0));
    var scaleVec = vec3.fromValues(teapotScale, teapotScale, teapotScale);
    mat4.scale(mvMatrixT, mvMatrixT, scaleVec);
    if(textureLoaded == 6 && teapotShaderMode == 0) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
        gl.uniform1i(shaderProgramT1.uniformCubeSamplerLoc, 1);
        gl.enableVertexAttribArray(shaderProgramT1.uniformCubeSamplerLoc);
    }
    if(teapotLoaded) {
        setTeapotMatrixUniforms(teapotShaderMode);
        uploadLightsToShader([2.0, -3.0, -5.0],
                            [0.3, 0.3, 0.3],
                            [0.7, 0.7, 0.7],
                            [0.9, 0.9, 0.9]);
        drawTeapot();
    }
    mvPopMatrix();   
    
}

//animates the webpage
//----------------------------------------------------------------------------------
function animate() {
    teapotScale = 0.3;
    updateScene();
}

//starts everthing off
//----------------------------------------------------------------------------------
function startup() {
    initializeGlobals();
    
    setUpShaders();
    setUpCubeMap();
    setUpBuffers();

    setUpInput();
    initializeScene();
    
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
