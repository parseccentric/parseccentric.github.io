var masterRate = 1.0,
    teapotXDir = 0,
    teapotYDir = 0,
    worldXDir = 0,
    worldYDir = 0,
    teapotDoReset = 1,
    worldDoReset = 1;

var teapotX = 0.0,
    teapotY = 0.0,
    teapotZ = 0.0,
    worldX = 0.0,
    worldY = 0.0,
    worldZ = 0.0;

var keyStati = {};



/*
* Sets initial scene parameters.
*/
function initializeScene() {
    masterRate = 1.0;
    teapotXDir = 0;
    teapotYDir = 0;
    worldXDir = 0;
    worldYDir = 0;
    teapotDoReset = 1,
    worldDoReset = 1;

    teapotX = 0.0;
    teapotY = -85.0;
    teapotZ = 0.0;
    worldX = 0.0;
    worldY = 0.0;
    worldZ = 0.0;
    controlTeapot(teapotXDir, teapotYDir, teapotDoReset);
    controlWorld(worldXDir, worldYDir, worldDoReset);
    
    teapotShaderMode = 0;
    
    lightLocX = document.getElementById("lightXSlider").value;
    lightLocY = document.getElementById("lightYSlider").value;
    lightLocZ = document.getElementById("lightZSlider").value;
    lightAmb = document.getElementById("lightAmbSlider").value;
    lightDif = document.getElementById("lightDifSlider").value;
    lightSpec = document.getElementById("lightSpecSlider").value;
    lightShin = document.getElementById("lightShinSlider").value;
    console.log(lightLocX);
    
    updateIndicators();
}

/*
* Applies scene parameters to be applied to GL objects.
*/
function updateScene() {
    //Apply Rotations...
    var axistoRot, 
        amt, 
        q = quat.create();
    
    //Stop rotating.
    axisToRot = vec3.fromValues(1.0, 0.0, 0.0);
    amt = degToRad(0.0);
    quat.setAxisAngle(q, axisToRot, amt);
    vec3.transformQuat(viewDir, viewDir, q);
    
    var teapotMoved = controlTeapot(teapotXDir, teapotYDir, teapotDoReset);
    var worldMoved = controlWorld(worldXDir, worldYDir, worldDoReset);
    
    doDebugPrint = (teapotMoved || worldMoved);
    
    updateIndicators();
}

/* 
* Updates indicators.
*/
function updateIndicators() {
    document.getElementById("teapotStats").innerHTML = teapotX + "&deg;, " + 
        teapotY + "&deg;, " + teapotZ + "&deg;";
    document.getElementById("cameraStats").innerHTML = worldX + "&deg;, " + 
        worldY + "&deg;, " + worldZ + "&deg;";
    
    document.getElementById("tHUD-UA").classList.toggle("activated", (keyStati.arrowU == 1));
    document.getElementById("tHUD-DA").classList.toggle("activated", (keyStati.arrowD == 1));
    document.getElementById("tHUD-LA").classList.toggle("activated", (keyStati.arrowL == 1));
    document.getElementById("tHUD-RA").classList.toggle("activated", (keyStati.arrowR == 1));
    
    document.getElementById("cHUD-W").classList.toggle("activated", (keyStati.W == 1));
    document.getElementById("cHUD-S").classList.toggle("activated", (keyStati.S == 1));
    document.getElementById("cHUD-A").classList.toggle("activated", (keyStati.A == 1));
    document.getElementById("cHUD-D").classList.toggle("activated", (keyStati.D == 1));
}

/*
* Controls world rotation based on input parameters.
*
* @param xDir = x rotation direction. =1 for CCW, 1 for CW, 0 for stop.
* @param yDir = y rotation direction. =1 for CCW, 1 for CW, 0 for stop.
* @param doReset = 0 if don't reset, 1 if do.
*/
function controlWorld(xDir, yDir, doReset) {
    var rate = masterRate;
    
    var diffX = xDir * rate,
        diffY = yDir * rate;
    
    var axistoRot, 
        amt, 
        q = quat.create();
    
    worldX += diffX;
    worldY += diffY;
    
    /*
    //For the world x...
    axisToRot = vec3.fromValues(1.0, 0.0, 0.0);
    amt = degToRad(diffX % 360);
    quat.setAxisAngle(q, axisToRot, amt);
    vec3.transformQuat(viewDir, viewDir, q);
    vec3.transformQuat(up, up, q);
    
    //...and the world y.
    axisToRot = vec3.fromValues(0.0, 1.0, 0.0);
    amt = degToRad(diffY % 360);
    quat.setAxisAngle(q, axisToRot, amt);
    vec3.transformQuat(viewDir, viewDir, q);
    vec3.transformQuat(up, up, q);
    */
    
    if(doReset) {
        /*
        //For the world x...
        axisToRot = vec3.fromValues(1.0, 0.0, 0.0);
        amt = degToRad((-worldX) % 360);
        quat.setAxisAngle(q, axisToRot, amt);
        vec3.transformQuat(viewDir, viewDir, q);
        vec3.transformQuat(up, up, q);

        //...and the world y.
        axisToRot = vec3.fromValues(0.0, 1.0, 0.0);
        amt = degToRad((-worldY) % 360);
        quat.setAxisAngle(q, axisToRot, amt);
        vec3.transformQuat(viewDir, viewDir, q);
        vec3.transformQuat(up, up, q);
        */
        
        worldX = 0.0;
        worldY = 0.0;
        worldDoReset = 0;
    }
    
    return (xDir != 0 || yDir != 0);
}

/*
* Controls teapot rotation based on input parameters.
*
* @param xDir = x rotation direction. =1 for CCW, 1 for CW, 0 for stop.
* @param yDir = y rotation direction. =1 for CCW, 1 for CW, 0 for stop.
* @param doReset = 0 if don't reset, 1 if do.
*/
function controlTeapot(xDir, yDir, doReset) {
    var rate = 2.0 * masterRate;
    
    var diffX = xDir * rate,
        diffY = yDir * rate;
    
    var axistoRot, 
        amt, 
        q = quat.create();
    
    teapotX += diffX;
    teapotY += diffY;
    
    /*
    //For the teapot x...
    axisToRot = vec3.fromValues(1.0, 0.0, 0.0);
    amt = degToRad(diffX % 360);
    quat.setAxisAngle(q, axisToRot, amt);
    vec3.transformQuat(viewDir, viewDir, q);
    vec3.transformQuat(up, up, q);
    
    //For the teapot y...
    axisToRot = vec3.fromValues(0.0, 1.0, 0.0);
    amt = degToRad(diffY % 360);
    quat.setAxisAngle(q, axisToRot, amt);
    vec3.transformQuat(viewDir, viewDir, q);
    vec3.transformQuat(up, up, q);
    */
    
    if(doReset) {
        /*
        //For the teapot x...
        axisToRot = vec3.fromValues(1.0, 0.0, 0.0);
        amt = degToRad((-teapotX) % 360);
        quat.setAxisAngle(q, axisToRot, amt);
        vec3.transformQuat(viewDir, viewDir, q);
        vec3.transformQuat(up, up, q);

        //For the teapot y...
        axisToRot = vec3.fromValues(0.0, 1.0, 0.0);
        amt = degToRad((-teapotY) % 360);
        quat.setAxisAngle(q, axisToRot, amt);
        vec3.transformQuat(viewDir, viewDir, q);
        vec3.transformQuat(up, up, q);
        */
        
        teapotX = 0.0;
        teapotY = 0.0;
        teapotDoReset = 0;
    }
    
    return (xDir != 0 || yDir != 0);
}

/*
* Detects which key was pressed and calls the appropriate functions.
*/
function respondToKeyboard(e, isPressed) {
    var ZERO_KEYCODE = 48,
        O_KEYCODE = 79,
        ARROWU_KEYCODE = 38,
        ARROWD_KEYCODE = 40,
        ARROWL_KEYCODE = 37,
        ARROWR_KEYCODE = 39,
        W_KEYCODE = 87,
        A_KEYCODE = 65,
        S_KEYCODE = 83,
        D_KEYCODE = 68,
        SHIFT_KEYCODE = 16,
        CTRL_KEYCODE = 17,
        ALTOPT_KEYCODE = 18,
        COMMANDL_KEYCODE = 91,
        COMMANDR_KEYCODE = 93;

    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled   
    }

    var handled = false;
    if (event.which !== undefined) {
        switch(event.which) {
            case ZERO_KEYCODE:
                teapotDoReset = 1;
                handled = true;
                break;
            case O_KEYCODE:
                worldDoReset = 1;
                handled = true;
                break;
            case ARROWU_KEYCODE:
                teapotXDir = -1 * isPressed;
                keyStati.arrowU = isPressed;
                handled = true;
                break;
            case ARROWD_KEYCODE:
                teapotXDir = isPressed;
                keyStati.arrowD = isPressed;
                handled = true;
                break;
            case ARROWL_KEYCODE:
                teapotYDir = isPressed;
                keyStati.arrowL = isPressed;
                handled = true;
                break;
            case ARROWR_KEYCODE:
                teapotYDir = -1 * isPressed;
                keyStati.arrowR = isPressed;
                handled = true;
                break;
            case W_KEYCODE:
                worldXDir = -1 * isPressed;
                keyStati.W = isPressed;
                handled = true;
                break;
            case S_KEYCODE:
                worldXDir = isPressed;
                keyStati.S = isPressed;
                handled = true;
                break;
            case A_KEYCODE:
                worldYDir = isPressed;
                keyStati.A = isPressed;
                handled = true;
                break;
            case D_KEYCODE:
                worldYDir = -1 * isPressed;
                keyStati.D = isPressed;
                handled = true;
                break;
                
        }
    } else if (event.keyIdentifier !== undefined) {
        //handled = true;
    } else if (event.keyCode !== undefined) {
        //handled = true;
    }

    if (handled) {
        // Suppress "double action" if event handled
        event.preventDefault();
    }
}

/*
* Activates keybindings for arrow, WASD, and R keys.
*/
function setUpInput() {
    document.body.addEventListener("keypress", function(event) {
        respondToKeyboard(event, 1);
    }, false);
    document.body.addEventListener("keydown", function(event) {
        respondToKeyboard(event, 1);
    }, false);
    document.body.addEventListener("keyup", function(event) {
        respondToKeyboard(event, 0);
    }, false);
    document.getElementById("lightXSlider").addEventListener("change", function() {
        lightLocX = this.value;
    });
    document.getElementById("lightYSlider").addEventListener("change", function() {
        lightLocY = this.value;
    });
    document.getElementById("lightZSlider").addEventListener("change", function() {
        lightLocZ = this.value;
    });
    document.getElementById("lightAmbSlider").addEventListener("change", function() {
        lightAmb = this.value;
    })
    document.getElementById("lightDifSlider").addEventListener("change", function() {
        lightDif = this.value;
    })
    document.getElementById("lightSpecSlider").addEventListener("change", function() {
        lightSpec = this.value;
    })
    document.getElementById("lightShinSlider").addEventListener("change", function() {
        lightShin = this.value;
    })
    
    document.getElementById("lightXSlider").addEventListener("mousemove", function() {
        lightLocX = this.value;
    });
    document.getElementById("lightYSlider").addEventListener("mousemove", function() {
        lightLocY = this.value;
    });
    document.getElementById("lightZSlider").addEventListener("mousemove", function() {
        lightLocZ = this.value;
    });
    document.getElementById("lightAmbSlider").addEventListener("mousemove", function() {
        lightAmb = this.value;
    })
    document.getElementById("lightDifSlider").addEventListener("mousemove", function() {
        lightDif = this.value;
    })
    document.getElementById("lightSpecSlider").addEventListener("mousemove", function() {
        lightSpec = this.value;
    })
    document.getElementById("lightShinSlider").addEventListener("mousemove", function() {
        lightShin = this.value;
    })
    document.getElementById("mode-Reflective").addEventListener("change", function() {
        if(this.checked) {
            teapotShaderMode = 0;
        } else {
            teapotShaderMode = 1;
        }
    });
    document.getElementById("mode-NonReflective").addEventListener("change", function() {
        if(this.checked) {
            teapotShaderMode = 1;
        } else {
            teapotShaderMode = 0;
        }
    });
    
    /*
    window.addEventListener("load", function() {
        lightLocX = document.getElementById("lightXSlider").value;
        lightLocY = document.getElementById("lightYSlider").value;
        lightLocZ = document.getElementById("lightZSlider").value;
        lightAmb = document.getElementById("lightAmbSlider").value;
        lightDif = document.getElementById("lightDifSlider").value;
        lightSpec = document.getElementById("lightSpecSlider").value;
        lightShin = document.getElementById("lightShinSlider").value;
        alert("Light values set to slider values.");
    });
    */
}






