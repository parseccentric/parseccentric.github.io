/**
 * @author bcdang2
 * @author UIUC SP17 CS418 Course Staff 
 */

/* corresponds to MP4-v0.6 in my personal files. */

/***
 *     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     ███████╗
 *    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝
 *    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     ███████╗
 *    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     ╚════██║
 *    ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗███████║
 *     ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
 *                                                              
 */

//DOM + WebGL objects
var gl, canvas, shaderProgram;

//Scene parameters
var timeInc, 
    lightScale,  lightLocX,   lightLocY,    lightLocZ,
    lightAmb,    lightDif,    lightSpec,    lightShin,
    eyePt,  viewDir,  up,  viewPt, 
    curWorldX,  curWorldY;

//Sprite variables
var modelViewMat, normalMat, projectionMat, modelViewStack,
    spherePositionBuffer, //buffer for sphere geometry
    sphereNormalBuffer, //buffer for normals
    sphereDetail = 6, //number of subdivisions
    boxPositionBuffer, //buffer for box geometry
    boxNormalBuffer; //buffer for normals
var colorR, colorG, colorB;

//Debug Variables
var doDebugPrint, debugList, firstDraw, debugScale, sphereExtremeVerts;

function initializeGlobals() {
    //DOM + WebGL objects
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);

    //Scene parameters
    timeInc = 0; 
    lightScale = 0.5; lightLocX = 0.0; lightLocY = 10.0; lightLocZ = 20.0;
    lightAmb = 1.0; lightDif = 1.0; lightSpec = 1.0; lightShin = 500;
    eyePt = vec3.fromValues(0.0, 0.0, -5.0);
    viewDir = vec3.fromValues(0.0, 0.0, 1.0);
    up = vec3.fromValues(0.0, 1.0, 0.0);
    viewPt = vec3.fromValues(0.0, 0.0, 0.0);
    curWorldX = 0.0; curWorldY = 0.0; //textureLoaded = 0;
    colorR = 1.0; colorG = 1.0; colorB = 1.0;

    //Sprite variables
    projectionMat = mat4.create(); //projection matrix
    modelViewMat = mat4.create(); //modelView matrix
    /*DEBUG*/console.log("modelViewMat: "); debug.printMatrix(modelViewMat);
    normalMat = mat3.create(); //normal matrix
    modelViewStack = [];
    sphereDetail = 5;

    doDebugPrint = 0;
    debugList = {};
    firstDraw = 1;
    debugScale = 8.0;
}

/***
 *     ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ██╗     
 *    ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗██║     
 *    ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║██║     
 *    ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║██║     
 *    ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║███████╗
 *     ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
 *                                                               
 */

/**
 * Returns the modulo of two numbers.
 * @param {int} a
 * @param {int} b 
*/
function mod(a, b) {
    return ((a % b) + b) % b;
}

/**
 * Converts degrees to radians.
 * @param   {Number} degrees 
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
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
function setUpBoxBuffers () {
    var boxVertices = [
        -1.0, -1.0, 1.0, //left bottom back
        -1.0, -1.0, -1.0, //left bottom front
        1.0, -1.0, 1.0, //right bottom back
        1.0, -1.0, -1.0, //right bottom front
        -1.0, -1.0, -1.0, //left bottom front
        1.0, -1.0, 1.0 //right bottom back
    ];
    
    boxPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    boxPositionBuffer.itemSize = 3;
    boxPositionBuffer.numItems = 6;
    
    var boxNormals = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ];
    
    boxNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxNormals), gl.STATIC_DRAW);
    boxNormalBuffer.itemSize = 3;
    boxNormalBuffer.numItems = 6;
}

/**
 * Draw box.
 */
function drawBox () {
    //Tell WebGL where the position buffer is.
    gl.bindBuffer(gl.ARRAY_BUFFER, boxPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                           boxPositionBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);
    
    //Tell WebGL where the normal buffer is.
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                           sphereNormalBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);
    
    //Draw it
    gl.drawArrays(gl.TRIANGLES, 0, boxPositionBuffer.numItems);
}

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
* Populates buffers with data for spheres
*/
function setUpSphereBuffers() {
    /*DEBUG*/ console.log("Loading sphere data into WebGL buffers: ");
    
    var sphereSoup = [],
        sphereNormals = [],
        numT = sphereFromSubdivision(sphereDetail, sphereSoup, sphereNormals);
    /*DEBUG*/ console.log("Generated ", numT, " triangles");
    /*DEBUG*/ debug.sphereVertices = sphereSoup.slice();
    /*DEBUG*/ //console.log("Sphere Normals:  ", sphereNormals);

    //Load positions in.
    spherePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereSoup), gl.STATIC_DRAW);
    spherePositionBuffer.itemSize = 3;
    spherePositionBuffer.numItems = numT * 3;

    //Load normals in.
    sphereNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals),
                  gl.STATIC_DRAW);
    sphereNormalBuffer.itemSize = 3;
    sphereNormalBuffer.numItems = numT * 3;

    /*DEBUG*/// console.log("Normals ", sphereNormals);
}

/**
* Draws a sphere from the sphere buffer.
*/
function drawSphere() {
    //Tell WebGL where the position buffer is.
    gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                           spherePositionBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);

    //Tell WebGL where the normal buffer is.
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                           sphereNormalBuffer.itemSize, gl.FLOAT,
                           false, 0, 0);
    
    //Draw it
    gl.drawArrays(gl.TRIANGLES, 0, spherePositionBuffer.numItems);
}

/***
 *    ███╗   ███╗ █████╗ ████████╗██████╗ ██╗ ██████╗███████╗███████╗
 *    ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║██╔════╝██╔════╝██╔════╝
 *    ██╔████╔██║███████║   ██║   ██████╔╝██║██║     █████╗  ███████╗
 *    ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║██║     ██╔══╝  ╚════██║
 *    ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║╚██████╗███████╗███████║
 *    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚══════╝
 *                                                                   
 */

/**
 * Pushes a copy of the specified matrix onto the specified stack.
 * @param {Array} matrix 
 * @param {Array}    stack  
 */
function saveToStack(matrix, stack) {
    var copy = mat4.clone(matrix);
    stack.push(copy);
}

/**
 * Pop a matrix of the specified stack and return it.
 * @param   {Array}    stack 
 * @returns {Array}    - matrix that was on the top of the stack
 */
function restoreFromStack(stack) {
    if (stack.length == 0) {
        throw "Invalid poprojectionMat!";
    }
    return stack.pop();
}

/**
 * Send all matrices to the shader.
 */
function setBallMatrixUniforms() {
    //Compute and send normal matrix to shader
    mat3.fromMat4(normalMat, modelViewMat);
    mat3.invert(normalMat, normalMat);
    mat3.transpose(normalMat, normalMat);
    gl.uniformMatrix3fv(gl.getUniformLocation(shaderProgram, "uNMatrix"), false, normalMat);
    
    //Send modelview and projection matrices to shader
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, modelViewMat);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, projectionMat);
}

/***
 *     ██████╗ ██╗         ██╗██╗  ██╗████████╗███╗   ███╗██╗     
 *    ██╔════╝ ██║        ██╔╝██║  ██║╚══██╔══╝████╗ ████║██║     
 *    ██║  ███╗██║       ██╔╝ ███████║   ██║   ██╔████╔██║██║     
 *    ██║   ██║██║      ██╔╝  ██╔══██║   ██║   ██║╚██╔╝██║██║     
 *    ╚██████╔╝███████╗██╔╝   ██║  ██║   ██║   ██║ ╚═╝ ██║███████╗
 *     ╚═════╝ ╚══════╝╚═╝    ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚══════╝
 *                                                                
 */

/**
 * Creates a WebGL context for an existing canvas.
 * @param   {object}   canvas - HTML canvas object to attach context to.
 */
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

/**
 * Loads Shader from string in node in HTML document. 
 * @param   {string} id - ID of node that has shader string.
 */
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

/***
 *    ███████╗██╗  ██╗ █████╗ ██████╗ ███████╗██████╗ ███████╗
 *    ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
 *    ███████╗███████║███████║██║  ██║█████╗  ██████╔╝███████╗
 *    ╚════██║██╔══██║██╔══██║██║  ██║██╔══╝  ██╔══██╗╚════██║
 *    ███████║██║  ██║██║  ██║██████╔╝███████╗██║  ██║███████║
 *    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝
 *                                                            
 */

/**
 * Hooks stuff up to the Shader.
 * @TODO: Rework this function to work with arbitrary objects.
 */
function setUpShaders() {
    // Get and compile Ball Shader.
    vertexShader = loadShaderFromDOM("phongBall-vs");
    fragmentShader = loadShaderFromDOM("phongBall-fs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram); 

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to set up ball shader.");
    }

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexNormal"));
    
    gl.useProgram(shaderProgram);
}

/**
 * Send lights to the shader.
 * @param {Array} loc [[Description]]
 * @param {Array} a   [[Description]]
 * @param {Array} d   [[Description]]
 * @param {Array} s   [[Description]]
 */
function uploadLightsToShader(loc, a, d, s) {
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "uLightPosition"), loc);
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "uAmbientColor"), a);
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "uDiffuseColor"), d);
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "uSpecularColor"), s);
}

/***
 *    ██████╗ ██╗   ██╗███████╗███████╗███████╗██████╗ ███████╗
 *    ██╔══██╗██║   ██║██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝
 *    ██████╔╝██║   ██║█████╗  █████╗  █████╗  ██████╔╝███████╗
 *    ██╔══██╗██║   ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗╚════██║
 *    ██████╔╝╚██████╔╝██║     ██║     ███████╗██║  ██║███████║
 *    ╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝
 *                                                             
 */

/**
 * Initializes buffers and hooks them up to WebGL.
 */
function setUpBuffers() {
    setUpSphereBuffers();
    setUpBoxBuffers();
    /*for (var sprite in sprites) {
        sprite.initializeBuffers();
    }*/
}

/***
 *     ██████╗ ██████╗ ██████╗ ███████╗
 *    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 *    ██║     ██║   ██║██████╔╝█████╗  
 *    ██║     ██║   ██║██╔══██╗██╔══╝  
 *    ╚██████╗╚██████╔╝██║  ██║███████╗
 *     ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
 *                                     
 */

/**
 * Transforms to view ball, loads its texture, sends data to WebGL, then draws it.
 */
function drawBall() {
    
//    //Transform to modelview location.
//    
//    /*DEBUG*/console.log("modelViewMat: "); debug.printMatrix(modelViewMat);
//    //Scale.
//    var scaleVec = vec3.fromValues(debug.ballScale, debug.ballScale, debug.ballScale);
//    mat4.scale(modelViewMat, modelViewMat, scaleVec);
//    mat4.translate(modelViewMat, modelViewMat, vec3.fromValues(0.0, 0.0, 5.0));
//    /*DEBUG*/console.log("modelViewMat: "); debug.printMatrix(modelViewMat);
//    //mat4.rotateY(modelViewMat, modelViewMat, degToRad(worldY % 360.0));
//    /*DEBUG*/console.log("modelViewMat: "); debug.printMatrix(modelViewMat);
//    console.log("modelViewMat: "); debug.printMatrix(modelViewMat);
//    console.log("projectionMat: "); debug.printMatrix(projectionMat);
//    debug.outputVertexLocations(modelViewMat, projectionMat, getSphereStats(debug.sphereVertices));
}

/**
 * For each ball object, moves it into place, then calls its draw function.
 */
function drawParticles() {

}

/**
 * Performs transformations, then calls the appropriate draw function.
 */
function draw() { 
    //Set scene components.
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var view = {
        fov: degToRad(45),
        aspect: gl.viewportWidth / gl.viewportHeight,
        near: 0.01, 
        far: 200.0
    };
    mat4.perspective(projectionMat, view.fov, view.aspect, view.near, view.far);

    //Draw sprites.
    /*debug.draw();*/
    //drawBall();
    var initialView = {
        eyePt: vec3.fromValues(0.0, 0.0, 5.0),
        viewPt: vec3.fromValues(0.0, 0.0, 0.0),
        up: vec3.fromValues(0.0, 1.0, 0.0)
    }
    mat4.lookAt(modelViewMat, initialView.eyePt, initialView.viewPt, initialView.up);
    
    //Draw box.
    mat4.rotateY(modelViewMat, modelViewMat, degToRad(timeInc) % 360.0);  
    setBallMatrixUniforms();
    uploadLightsToShader([lightLocX * 10.0, lightLocY * 10.0, lightLocZ * 10.0],
                        [1.0 * lightAmb, 1.0 * lightAmb, 1.0 * lightAmb],
                        [1.0 * lightDif, 1.0 * lightDif, 1.0 * lightDif],
                        [1.0 * lightSpec, 1.0 * lightSpec, 1.0 * lightSpec]);
    drawBox();
    
    if(debug.drawTestParticle) {
        mat4.translate(modelViewMat, modelViewMat, vec3.fromValues(0.0, 0.0, 0.0));
        mat4.scale(modelViewMat, modelViewMat, vec3.fromValues(0.1, 0.1, 0.1));
        mat4.rotateY(modelViewMat, modelViewMat, degToRad(timeInc) % 360.0);    
        setBallMatrixUniforms();
        uploadLightsToShader([lightLocX * 10.0, lightLocY * 10.0, lightLocZ * 10.0],
                            [1.0 * lightAmb, 1.0 * lightAmb, 1.0 * lightAmb],
                            [1.0 * lightDif, 1.0 * lightDif, 1.0 * lightDif],
                            [1.0 * lightSpec, 1.0 * lightSpec, 1.0 * lightSpec]);

            //Execute rendering.
        drawSphere();
    } else {
        for (var i = 0; i < scene.particles.length; i += 1) {
            saveToStack(modelViewMat, modelViewStack);
            mat4.rotateY(modelViewMat, modelViewMat, degToRad(timeInc) % 360.0);  
            mat4.translate(modelViewMat, modelViewMat, 
                           vec3.fromValues(scene.positions[scene.particles[i]][0],
                                           scene.positions[scene.particles[i]][1],
                                           scene.positions[scene.particles[i]][2],));
            mat4.scale(modelViewMat, modelViewMat, vec3.fromValues(0.1, 0.1, 0.1));  
            setBallMatrixUniforms();
            uploadLightsToShader([lightLocX * 10.0, lightLocY * 10.0, lightLocZ * 10.0],
                                [scene.colors[i][0] * lightAmb, 
                                 scene.colors[i][1] * lightAmb, 
                                 scene.colors[i][2] * lightAmb],
                                [scene.colors[i][0] * lightDif, 
                                 scene.colors[i][1] * lightDif, 
                                 scene.colors[i][2] * lightDif],
                                [1.0 * lightSpec, 1.0 * lightSpec, 1.0 * lightSpec]);

                //Execute rendering.
            drawSphere();
            modelViewMat = restoreFromStack(modelViewStack);
        }
    }
    /*drawParticles();*/
    //scene.draw();
    /*for (var sprite in sprites) {
        sprite.draw();
    }*/
}

function update() {
    timeInc += 0.1;
    /*if(timeInc % 2.8 < 0.1) {
        colorR = Math.random();
        colorG = Math.random();
        colorB = Math.random();
    }*/
    updateScene();
    simulate(scene.particles, scene.positions, scene.velocities, 
                        [[0.0, -scene.gravity/scene.mass, 0.0]], [0.975], 
                        [collideSphereSphere, collideSphereBox], scene.radius, scene.bounds, scene.elasticity);
    //debugScale *= 0.95;
    //console.log(debugScale);
    //scene.update();
    /*for (var sprite in sprites) {
        sprite.update();
    }*/
}

function tick() {
    if(debug.keepTicking) {
        setTimeout(function() {
            requestAnimFrame(tick);
        }, 1000/60);
        draw();
        update();
        //debug.keepTicking = false;
    }
}

function startup() {
    initializeGlobals();
    setUpInput();
    initializeScene();
    initializeModules();
    setUpShaders();
    setUpBuffers();

    //scene.initialize();
    /*for (var sprite in sprites) {
        sprite.initialize();
        sprite.setUpInput();
        sprite.setUpShaders();
        sprite.setUpBuffers();
    }*/

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    tick();
}
