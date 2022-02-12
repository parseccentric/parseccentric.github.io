var startLoc,
    startLookAt,
    startUp;

var startMoveDir;

var eyePt, viewPt, up;

var viewDir, forwardDir, curPos;

var roll, pitch, yaw, speed,
    pitchDir, rollDir, yawDir, speedDir;

var fogOn;

var Quat, axisToRot, Amount,
    xAxis, yAxis, zAxis;

function initializeSimulator() {
    //Give manual values.
    
    /* //Note: these values are now set in the main.js:findVertexBoundaries function.
    startLoc = vec3.fromValues(0.0, 0.0, 5.0);
    startViewDir = vec3.fromValues(0.0, 0.0, -1.0);
    startUp = vec3.fromValues(0.0, 1.0, 0.0)
    startMoveDir = vec3.fromValues(0.0, 0.0, -1.0);
    */
    
    roll = 0.0;
    pitch = 0.0;
    yaw = 0.0;
    speed = 0.0;
    
    pitchDir = 0;
    rollDir = 0;
    yawDir = 0;
    speedDir = 0.0;
    
    fogOn = 0;
    
    //Derive other parameters from manual values.
    
    startLookAt = vec3.create();
    vec3.add(startLookAt, startViewDir, startLoc);
    
    eyePt = vec3.clone(startLoc);
    viewPt = vec3.clone(startLookAt);
    up = vec3.clone(startUp);
    
    viewDir = vec3.clone(startViewDir);
    
    forwardDir = vec3.clone(startMoveDir);
    curPos = vec3.clone(startLoc);
    
    
    Quat = quat.create(); 
    axisToRot = vec3.fromValues(0.0, 0.0, 0.0); 
    Amount;
    xAxis = vec3.fromValues(1.0, 0.0, 0.0);
    yAxis = vec3.fromValues(0.0, 1.0, 0.0);
    zAxis = vec3.fromValues(0.0, 0.0, 1.0);
}








function setUpInput() {
    
}







function updatePosition() {
    //change pitch iff keys are active (this is within the anim function to make it smooth)
    changePitch(pitchDir, 1);
    changeRoll(rollDir, 1);
    changeYaw(yawDir, 1);
    changeSpeed(speedDir, 1/10);

    //move forward
    var moveDir = vec3.create();
    vec3.copy(moveDir, viewDir);
    vec3.scale(moveDir, moveDir, 0.1 * speed);
    vec3.add(curPos, curPos, moveDir);
    vec3.add(eyePt, eyePt, moveDir);
}







function updateMetrics() {
    document.getElementById("metricRoll-value").innerText = 
        (roll.toFixed(4) > 0.0 ? "+" : "") + roll.toFixed(4);
    document.getElementById("metricPitch-value").innerText = 
        (pitch.toFixed(4) > 0.0 ? "+" : "") + pitch.toFixed(4);
    document.getElementById("metricYaw-value").innerText = 
        (yaw.toFixed(4) > 0.0 ? "+" : "") + yaw.toFixed(4);
    document.getElementById("metricSpeed-value").innerText = speed.toFixed(4);
    document.getElementById("metricPosition-value").innerText = 
        curPos[0].toFixed(2) + ", " + curPos[1].toFixed(2) + ", " + curPos[2].toFixed(2);
    document.getElementById("metricLookAt-value").innerHTML = 
        "Camera Location: <" + eyePt[0].toFixed(2) + ", " + 
        eyePt[1].toFixed(2) + ", " + eyePt[2].toFixed(2) + "> <br>" + 
        "Target Direction: " + viewDir[0].toFixed(2) + ", " + 
        viewDir[1].toFixed(2) + ", " + viewDir[2].toFixed(2) + "> <br>" +
        "Up Direction: " + up[0].toFixed(2) + ", " + 
        up[1].toFixed(2) + ", " + up[2].toFixed(2) + ">";
}
function changePitch(sign, duration) {
    var rate = duration;
    var amt = 1.0;
    var diffPitch = sign * amt * rate;
    pitch += diffPitch;

    vec3.cross(axisToRot, viewDir, up);
    Amount = degToRad(diffPitch);
    
    quat.setAxisAngle(Quat, axisToRot, Amount);
    vec3.transformQuat(viewDir, viewDir, Quat);
    vec3.transformQuat(up, up, Quat);
}
function changeRoll(sign, duration) {
    var rate = duration;
    var amt = 1.0;
    var diffRoll = sign * amt * rate;
    roll += diffRoll;

    vec3.copy(axisToRot, viewDir);
    Amount = degToRad(diffRoll % 360.0);
    quat.setAxisAngle(Quat, axisToRot, Amount);
    vec3.transformQuat(up, up, Quat);
}
function changeYaw(sign, duration) {
    var rate = duration;
    var amt = 1.0;
    var diffYaw = sign * amt * rate;
    yaw += diffYaw;
    
    vec3.copy(axisToRot, up);
    Amount = degToRad(- diffYaw % 360.0);
    quat.setAxisAngle(Quat, axisToRot, Amount);
    vec3.transformQuat(viewDir, viewDir, Quat);
    vec3.transformQuat(up, up, Quat);
}
function changeSpeed(sign, duration) {
    var rate = duration;
    var amt = 0.1;
    var diffSpeed = sign * amt * rate;
    speed += diffSpeed;
}


function resetAircraft() {
    vec3.copy(eyePt, startLoc);
    vec3.copy(viewPt, startLookAt);
    vec3.copy(up, startUp);
    
    vec3.copy(curPos, startLoc);
    
    roll = 0.0; pitch = 0.0; yaw = 0.0;
    speed = 0.0;
    
    updatePosition();
    updateMetrics();
}


function toggleFog() {
    if (fogOn) {
        fogOn = 0;
        document.getElementById("fogButton-status").innerText = "On";
        setupShaders(2);
    } else {
        fogOn = 1;
        document.getElementById("fogButton-status").innerText = "Off";
        setupShaders(1);
    }
}


function respondToKeyboard(e, state) {
    var C_KEYCODE = 67,
        S_KEYCODE = 83,
        R_KEYCODE = 82,
        Y_KEYCODE = 89,
        P_KEYCODE = 80,
        ARROWU_KEYCODE = 38,
        ARROWD_KEYCODE = 40,
        ARROWL_KEYCODE = 37,
        ARROWR_KEYCODE = 39,
        PLUS_KEYCODE = 187,
        MINUS_KEYCODE = 189,
        COMMA_KEYCODE = 188,
        PERIOD_KEYCODE = 190;

    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled   
    }


    var handled = false;
    if (event.which !== undefined) {
        switch(event.which) {
            case C_KEYCODE:
                resetAircraft();
                handled = true;
                break;
            case ARROWU_KEYCODE:
                if(state == 1) {
                    pitchDir = 1;
                    document.getElementById("arrowU-value").innerText = "ACTIVE";
                } else {
                    pitchDir = 0;
                    document.getElementById("arrowU-value").innerText = "inactive";
                }
                handled = true;
                break;
            case ARROWD_KEYCODE:
                if(state == 1) { 
                    pitchDir = -1;
                    document.getElementById("arrowD-value").innerText = "ACTIVE";
                } else {
                    pitchDir = 0;
                    document.getElementById("arrowD-value").innerText = "inactive";
                }
                handled = true;
                break;
            case ARROWL_KEYCODE:
                if(state == 1) {
                    rollDir = -1;
                    document.getElementById("arrowL-value").innerText = "ACTIVE";
                } else {
                    rollDir = 0;
                    document.getElementById("arrowL-value").innerText = "inactive";
                }
                handled = true;
                break;
            case ARROWR_KEYCODE:
                if(state == 1) {
                    rollDir = 1;
                    document.getElementById("arrowR-value").innerText = "ACTIVE";
                } else {
                    rollDir = 0;
                    document.getElementById("arrowR-value").innerText = "inactive";
                }
                handled = true;
                break;
            case MINUS_KEYCODE:
                if(state == 1) {
                    speedDir = -1;
                    document.getElementById("keyMinus-value").innerText = "ACTIVE";
                } else {
                    speedDir = 0;
                    document.getElementById("keyMinus-value").innerText = "inactive";
                }
                handled = true;
                break;
            case PLUS_KEYCODE:
                if(state == 1) {
                    speedDir = 1;
                    document.getElementById("keyPlus-value").innerText = "ACTIVE";
                } else {
                    speedDir = 0;
                    document.getElementById("keyPlus-value").innerText = "inactive";
                }
                handled = true;   
                break;
            case COMMA_KEYCODE:
                if(state == 1) {
                    yawDir = -1;
                    document.getElementById("keyComma-value").innerText = "ACTIVE";
                } else {
                    yawDir = 0;
                    document.getElementById("keyComma-value").innerText = "inactive";
                }
                handled = true;
                break;
            case PERIOD_KEYCODE:
                if(state == 1) {
                    yawDir = 1;
                    document.getElementById("keyPeriod-value").innerText = "ACTIVE";
                } else {
                    yawDir = 0;
                    document.getElementById("keyPeriod-value").innerText = "inactive";
                }
                handled = true;   
                break;
                /*
            case P_KEYCODE:
                if(state == 1) {
                    pitch = 0.0;
                    updatePosition();
                }
                handled = true;   
                break;
            case R_KEYCODE:
                if(state == 1) {
                    roll = 0.0;
                    updatePosition();
                }
                handled = true;   
                break;
            case Y_KEYCODE:
                if(state == 1) {
                    yaw = 0.0;
                    updatePosition();
                }
                handled = true;   
                break;
                */
            case S_KEYCODE:
                if(state == 1) {
                    speed = 0.0;
                    updateMetrics();
                }
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

function setUpInput() {
    document.body.addEventListener("keypress", function(event) {
        respondToKeyboard(event, 1);
    }, true);
    document.body.addEventListener("keyup", function(event) {
        respondToKeyboard(event, 0);
    }, true);
    document.body.addEventListener("keydown", function(event) {
        respondToKeyboard(event, 1);
    }, true);
    document.getElementById("fogButton").addEventListener("click", function() {
        toggleFog();
    }, true);
    document.getElementById("resetButton").addEventListener("click", function() {
        resetAircraft();
    }, true);
    document.body.addEventListener("mousemove", function() {
        speed = parseFloat(document.getElementById("debug-sliderSpeed").value);
        updateMetrics();
    })
    document.getElementById("debug-sliderSpeed").addEventListener("change", function() {
        speed = parseFloat(this.value);
        updateMetrics();
    })
}
