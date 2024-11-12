var masterRate = 1.0,
    worldXDir = 0,
    worldYDir = 0,
    worldDoReset = 1;

var worldX = 0.0,
    worldY = 0.0,
    worldZ = 0.0;

var keyStati = {};

/*
* Sets initial scene parameters.
*/
function initializeScene() {
    masterRate = 1.0;
    worldXDir = 0;
    worldYDir = 0;
    worldDoReset = 1;

    worldX = 0.0;
    worldY = 0.0;
    worldZ = 0.0;
    controlWorld(worldXDir, worldYDir, worldDoReset);
    
    lightLocX = document.getElementById("lightXSlider").value;
    lightLocY = document.getElementById("lightYSlider").value;
    lightLocZ = document.getElementById("lightZSlider").value;
    
    lightAmb = document.getElementById("lightAmbSlider").value;
    lightDif = document.getElementById("lightDifSlider").value;
    lightSpec = document.getElementById("lightSpecSlider").value;
    lightShin = document.getElementById("lightShinSlider").value;
    /*DEBUG*/ //console.log(lightLocX);
    
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
    
    var worldMoved = controlWorld(worldXDir, worldYDir, worldDoReset);
    /*DEBUG*/ doDebugPrint = (worldMoved);
    
    updateIndicators();
}

/* 
* Updates indicators.
*/
function updateIndicators() {
}

/*
* Controls world rotation based on input parameters.
*
* @param xDir = x rotation direction. =1 for CCW, 1 for CW, 0 for stop.
* @param yDir = y rotation direction. =1 for CCW, 1 for CW, 0 for stop.
* @param doReset = 0 if don't reset, 1 if do.
*/
function controlWorld(xDir, yDir, doReset) {
    var rate = masterRate,
        diffX = xDir * rate,
        diffY = yDir * rate;
    
    var axistoRot, 
        amt, 
        q = quat.create();
    
    worldX += diffX;
    worldY += diffY;
    
    if(doReset) {
        worldX = 0.0;
        worldY = 0.0;
        worldDoReset = 0;
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
            case O_KEYCODE:
                worldDoReset = 1;
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
    });
    document.getElementById("lightDifSlider").addEventListener("change", function() {
        lightDif = this.value;
    });
    document.getElementById("lightSpecSlider").addEventListener("change", function() {
        lightSpec = this.value;
    });
    document.getElementById("lightShinSlider").addEventListener("change", function() {
        lightShin = this.value;
    });
    
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
    });
    document.getElementById("lightDifSlider").addEventListener("mousemove", function() {
        lightDif = this.value;
    });
    document.getElementById("lightSpecSlider").addEventListener("mousemove", function() {
        lightSpec = this.value;
    });
    document.getElementById("lightShinSlider").addEventListener("mousemove", function() {
        lightShin = this.value;
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






