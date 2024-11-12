/*
* @author bcdang2
*/

/*Run this with simulate(scene.particles, scene.positions, scene.velocities, 
                        [[0.0, -scene.gravity/scene.mass, 0.0]], [0.95], 
                        [collideSphereSphere, collideSphereBox], scene.radius, scene.bounds, scene.elasticity, scene.queue);*/

/**
 * Simulate forces by deriving new positions and applying them to particles.
 * @param {[[Type]]} particles    [[Description]]
 * @param {[[Type]]} positions    [[Description]]
 * @param {[[Type]]} velocities   [[Description]]
 * @param {[[Type]]} accelerators [[Description]]
 * @param {[[Type]]} dampeners    [[Description]]
 * @param {[[Type]]} colliders    [[Description]]
 * @param {[[Type]]} radius       [[Description]]
 * @param {[[Type]]} bounds       [[Description]]
 * @param {[[Type]]} elasticity   [[Description]]
 */
function simulate(particles, positions, velocities, accelerators, dampeners, colliders, radius, bounds, elasticity) {
    //compute and store differential time, sum of accelerators, and sum of dampeners
    var now = Date.now(),
        time = (now - scene.lastTime) / 1000.0 * scene.speed,
        acceleration = vec3.fromValues(0.0, 0.0, 0.0), 
        dampening = 1.0;

    //update time for future time difference calculations
    scene.lastTime = now;

    for (var i in accelerators) {
        acceleration[0] += accelerators[i][0];
        acceleration[1] += accelerators[i][1];
        acceleration[2] += accelerators[i][2];
    }
    for (var i in dampeners) {
        dampening *= dampeners[i]; 
    }

    /*DEBUG*/ debug.dampening = dampening;

    //For each particle...
    for (var i in particles) {
        var MIN_V = 0.001,
            THRESH_P = 0.01;
        //Apply forces to velocities.
        if ((bounds.bottommost - (positions[i] - radius)) < THRESH_P && 
            (velocities[i][0] < MIN_V && velocities[i][1] < MIN_V && velocities[i][2] < MIN_V)) {
            velocities[i] = [0.0, 0.0, 0.0];
        } else {
            var velocity = vec3.fromValues(velocities[i][0], velocities[i][1], velocities[i][2]);
            var vTerm1 = vec3.create(); vec3.scale(vTerm1, acceleration, time);
            var vTerm2 = vec3.create(); vec3.scale(vTerm2, velocity, Math.pow(dampening, time));
            var vSum = vec3.create(); vec3.add(vSum, vTerm1, vTerm2);
            velocities[i] = [vSum[0], vSum[1], vSum[2]];
        }

        //Check for collisions and apply relevant ones to velocities.
        for (var j in colliders) {
            (colliders[j])(particles, positions, velocities, radius, bounds, elasticity, time)
        }

        //Apply velocities to positions.
        var newVelocity = vec3.fromValues(velocities[i][0], velocities[i][1], velocities[i][2]);
        var position = vec3.fromValues(positions[i][0], positions[i][1], positions[i][2])
        var pTerm1 = vec3.create(); vec3.scale(pTerm1, newVelocity, time);
        var pSum = vec3.create(); vec3.add(pSum, pTerm1, position);
        positions[i] = [pSum[0], pSum[1], pSum[2]];
    }
}

/**
 * Compute particle-box (sphere-plane) collisions and send them to a queue.
 * @param {[[Type]]} particles  [[Description]]
 * @param {[[Type]]} positions  [[Description]]
 * @param {[[Type]]} velocities [[Description]]
 * @param {[[Type]]} radius     [[Description]]
 * @param {[[Type]]} bounds     [[Description]]
 */
var collideSphereBox = function (particles, positions, velocities, 
                                  radius, bounds, elasticity, time) {
    var TIME_STEP = 1000.0 / 60.0,
        randomness = Math.random() * 0.02 + 0.99;
    //Compute the earliest time whence a particle will hit any plane of the box.
    var n = [
        vec3.fromValues(-bounds.leftmost, 0.0, 0.0),
        vec3.fromValues(-bounds.rightmost, 0.0, 0.0),
        vec3.fromValues(0.0, -bounds.topmost, 0.0),
        vec3.fromValues(0.0, -bounds.bottommost, 0.0),
        vec3.fromValues(0.0, 0.0, -bounds.frontmost),
        vec3.fromValues(0.0, 0.0, -bounds.backmost)
    ];
    var d = [
        vec3.fromValues(bounds.leftmost, 0.0, 0.0),
        vec3.fromValues(bounds.rightmost, 0.0, 0.0),
        vec3.fromValues(0.0, bounds.topmost, 0.0),
        vec3.fromValues(0.0, bounds.bottommost, 0.0),
        vec3.fromValues(0.0, 0.0, bounds.frontmost),
        vec3.fromValues(0.0, 0.0, bounds.backmost)
    ];

    for (var i in particles) {
        for (var j in n) {
            var FUDGE = 0.001,
                V_MIN = 0.01,
                MIN_COLOR_INTERVAL = 1000.0 / 3.0,
                now = Date.now();
            var collisionTimePos = (radius - (vec3.dot(n[j], velocities[i]) - d[j])) / vec3.dot(n[j], velocities[i]);
            var collisionTimeNeg = (-radius - (vec3.dot(n[j], velocities[i]) - d[j])) / vec3.dot(n[j], velocities[i]);
            var xMultiplier = elasticity,
                yMultiplier = elasticity,
                zMultiplier = elasticity;
            if(Math.abs(time - collisionTimePos) < TIME_STEP || 
               Math.abs(time - collisionTimeNeg) < TIME_STEP || 
              ((j == 0 || j == 1) && Math.abs(positions[i][0]) + radius > 1.0) || 
              ((j == 2 || j == 3) && Math.abs(positions[i][1]) + radius > 1.0) || 
              ((j == 4 || j == 5) && Math.abs(positions[i][2]) + radius > 1.0)) {
                if(j == 0 && positions[i][0] - radius < -1.0) { //if left 
                    positions[i][0] = -1.0 + radius + FUDGE;
                    if(now - scene.lastColorTime[i] > MIN_COLOR_INTERVAL) {
                        scene.colors[i] = [Math.random(), Math.random(), Math.random()];
                        scene.lastColorTime[i] = now;
                    }
                    xMultiplier = -xMultiplier * randomness;
                }
                if(j == 1 && positions[i][0] + radius > 1.0) { //if right
                    positions[i][0] = 1.0 - radius - FUDGE;
                    if(now - scene.lastColorTime[i] > MIN_COLOR_INTERVAL) {
                        scene.colors[i] = [Math.random(), Math.random(), Math.random()];
                        scene.lastColorTime[i] = now;
                    }
                    xMultiplier = -xMultiplier * randomness;
                }
                if(j == 2 && positions[i][1] + radius > 1.0) { //if top 
                    positions[i][1] = 1.0 - radius - FUDGE;
                    if(now - scene.lastColorTime[i] > MIN_COLOR_INTERVAL) {
                        scene.colors[i] = [Math.random(), Math.random(), Math.random()];
                        scene.lastColorTime[i] = now;
                    }
                    yMultiplier = -yMultiplier * randomness;
                }
                if(j == 3 && positions[i][1] - radius < -1.0) { //if bottom
                    positions[i][1] = -1.0 + radius + FUDGE;
                    if(now - scene.lastColorTime[i] > MIN_COLOR_INTERVAL) {
                        scene.colors[i] = [Math.random(), Math.random(), Math.random()];
                        scene.lastColorTime[i] = now;
                    }
                    yMultiplier = -yMultiplier * randomness;
                }
                if(j == 4 && positions[i][2] - radius < -1.0) { //if front 
                    positions[i][2] = -1.0 + radius + FUDGE;
                    if(now - scene.lastColorTime[i] > MIN_COLOR_INTERVAL) {
                        scene.colors[i] = [Math.random(), Math.random(), Math.random()];
                        scene.lastColorTime[i] = now;
                    }
                    zMultiplier = -zMultiplier * randomness;
                }
                if(j == 5 && positions[i][2] + radius > 1.0) { //if back
                    positions[i][2] = 1.0 - radius - FUDGE;
                    if(now - scene.lastColorTime[i] > MIN_COLOR_INTERVAL) {
                        scene.colors[i] = [Math.random(), Math.random(), Math.random()];
                        scene.lastColorTime[i] = now;
                    }
                    zMultiplier = -zMultiplier * randomness;
                }
                velocities[i] = [velocities[i][0] * xMultiplier,
                                 velocities[i][1] * yMultiplier,
                                 velocities[i][2] * zMultiplier,]
            }
            //(positions[i][1] <= -1.0 && j == 3) || (positions[i][1] >= 1.0 && j == 2)) {
            //console.log("Detected collision");
            //var velocity = vec3.fromValues(velocities[i][0], velocities[i][1], velocities[i][2]);
            /*var vTerm1 = vec3.create(); vec3.scale(vTerm1, n[j], 2 * vec3.dot(n[j], velocity));
                var vDiff = vec3.create(); vec3.subtract(vDiff, vTerm1, velocity); //R = 2(N dot V)N - V
                var vElasticized = vec3.create(); vec3.scale(vElasticized, vDiff, elasticity);*/
            //velocities[i] = [vDiff[0], vDiff[1], vDiff[2]];
            /*velocities[i] = [velocities[i][0], 
                                -velocities[i][1] * elasticity, 
                                 velocities[i][2]];*/
            //}
        }
    }   
}
/**
 * Compute particle-particle (intersphere) collisions and send them to a queue.
 * @param {[[Type]]} particles  [[Description]]
 * @param {[[Type]]} positions  [[Description]]
 * @param {[[Type]]} velocities [[Description]]
 * @param {[[Type]]} radius     [[Description]]
 * @param {[[Type]]} bounds     [[Description]]
 */
var collideSphereSphere = function (particles, positions, velocities, 
                                     radius, bounds, elasticity, time) {
    //Compute when a particle will hit any other
    //For efficiency, mark obstacle particle now.
    //Send collision time to update queue.
}

