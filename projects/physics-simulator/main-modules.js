
/***
 *    ███████╗ ██████╗███████╗███╗   ██╗███████╗
 *    ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
 *    ███████╗██║     █████╗  ██╔██╗ ██║ █████╗  
 *    ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  
 *    ███████║╚██████╗███████╗██║ ╚████║███████╗
 *    ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝
 *                                              
 */
var scene,
    canvas,
    addBalls,
    clearBalls,
    setParams,
    getStats;

/***
 *     █████╗ ██████╗ ██████╗ 
 *    ██╔══██╗██╔══██╗██╔══██╗
 *    ███████║██║  ██║██║  ██║
 *    ██╔══██║██║  ██║██║  ██║
 *    ██║  ██║██████╔╝██████╔╝
 *    ╚═╝  ╚═╝╚═════╝ ╚═════╝ 
 * 
 */

/** 
 * Create a module that allows us to add balls to the scene.
 */
var addBallsModule = {
    //variables
    bounds: {
        xMin: -1,
        xMax: 1,
        yMin: -1,
        yMax: 1,
        zMin: -1,
        zMax: 1
    },
    button: null,
    canvas: null,
    display: null,
    picker: null,
    colors: null,
    particles: null,
    positions: null,
    velocities: null,
    //functions
    appendParticles:
    /**
     * Adds n particles to particles, positions, velocities.
     * @param {Number} n
     */
    function (caller, colors, particles, positions, velocities, n) {
        var now = Date.now();
        var bounds = caller.bounds;
        for (var i = 0; i < n; i += 1) {
            particles.push(particles.length);
            positions.push(
                [Math.random() * (bounds.xMax - bounds.xMin) + bounds.xMin,
                 Math.random() * (bounds.yMax - bounds.yMin) + bounds.yMin,
                 Math.random() * (bounds.zMax - bounds.zMin) + bounds.zMin]);
            velocities.push([Math.random(), Math.random(), Math.random()]);
            colors.push([Math.random(), Math.random(), Math.random()]);
            scene.lastColorTime.push(now);
        }
        if(typeof getStats !== "undefined") {
            getStats.updateIndicators(getStats);
        }
    },
    updateIndicators:
    /**
		 *
		 * @param {Number} n - number of particles to add
		 */
    function (caller) {
        caller.display.innerHTML = caller.picker.value;
    },
    initialize:
    /**
		 *
		 * @param {} canvas - DOM canvas object (not its ID).
		 * @param {} display - DOM display object (not its ID).
		 * @param {} slider - DOM slider object (not its ID).
		 */
    function(button, canvas, display, picker,
              colors, particles, positions, velocities) {
        this.button = button;
        this.canvas = canvas;
        this.display = display;
        this.picker = picker;
        this.colors = colors;
        this.particles = particles;
        this.positions = positions;
        this.velocities = velocities;

        var _this = this;
        var DOMControls = [
            {
                element: window,
                event: "load",
                callback: function() {
                    _this.updateIndicators(_this);
                }
            },
            {
                element: button,
                event: "click",
                callback: function(event) {
                    _this.appendParticles(_this, _this.colors, _this.particles, _this.positions,
                                          _this.velocities, _this.picker.value);
                }
            },
            {
                element: picker,
                event: "keypress",
                callback: function(event) {
                    var ENTER = 13;
                    if (event.keyCode == ENTER) {
                        _this.appendParticles(_this, _this.colors, _this.particles, _this.positions,
                                              _this.velocities, _this.picker.value);
                    }
                }
            },
            {
                element: canvas,
                event: "click",
                callback: function() {
                    _this.appendParticles(_this, _this.colors, _this.particles, _this.positions,
                                          _this.velocities, _this.picker.value);
                }
            },
            {
                element: picker,
                event: "click",
                callback: function(event) {
                    _this.updateIndicators(_this);
                }
            },
            {
                element: picker,
                event: "change",
                callback: function() {
                    _this.updateIndicators(_this);
                }
            },
            {
                element: picker,
                event: "keydown",
                callback: function() {
                    _this.updateIndicators(_this);
                }
            },
            {
                element: picker,
                event: "keyup",
                callback: function() {
                    _this.updateIndicators(_this);
                }
            },
            {
                element: picker,
                event: "keypress",
                callback: function() {
                    _this.updateIndicators(_this);
                }
            },
            {
                element: picker,
                event: "mousemove",
                callback: function() {
                    _this.updateIndicators(_this);
                }
            }
        ];
        for(var i in DOMControls) {
            var control = DOMControls[i];
            control.element.addEventListener(control.event, control.callback);
        }
        return this;
    }
};

/***
 *     ██████╗██╗     ███████╗ █████╗ ██████╗ 
 *    ██╔════╝██║     ██╔════╝██╔══██╗██╔══██╗
 *    ██║     ██║     █████╗  ███████║██████╔╝
 *    ██║     ██║     ██╔══╝  ██╔══██║██╔══██╗
 *    ╚██████╗███████╗███████╗██║  ██║██║  ██║
 *     ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
 *                                            
 */

/** 
 * Create a module that allows us to remove all balls from the scene.
 */
var clearBallsModule = {
    //variables
    button: null,
    canvas: null,
    colors: null,
    particles: null,
    positions: null,
    velocities: null,
    //functions
    clearParticles:
    /**
			* Removes all particles from scene.
			*/
    function (caller) {
        caller.colors.length = 0;
        caller.particles.length = 0;
        caller.positions.length = 0;
        caller.velocities.length = 0;

        if (typeof getStats !== 'undefined') {
            getStats.index = 1;
            getStats.updateIndicators(getStats);
        }
    },
    initialize:
    /**
			* Creates the module to clear balls, setting up DOM events 
			* and hooking everything up.
			*/
    function (canvas, button, colors, particles, positions, velocities) {
        var _this = this;
        this.canvas = canvas;
        this.colors = colors;
        this.button = button;
        this.particles = particles;
        this.positions = positions;
        this.velocities = velocities;
        var DOMControls = [
            {
                element: button,
                event: "click",
                callback: function() {
                    _this.clearParticles(_this);
                }
            },
            {
                element: document.body,
                event: "keypress",
                callback: function(event) {
                    var ZERO = 48;
                    if(event.keyCode == ZERO) {
                        _this.clearParticles(_this);
                    }
                }
            }
        ];
        for(var i in DOMControls) {
            var control = DOMControls[i];
            control.element.addEventListener(control.event, control.callback);
        }
        return this;
    }
};

/***
 *    ██████╗  █████╗ ██████╗  █████╗ ███╗   ███╗███████╗
 *    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗ ████║██╔════╝
 *    ██████╔╝███████║██████╔╝███████║██╔████╔██║███████╗
 *    ██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║╚██╔╝██║╚════██║
 *    ██║     ██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║███████║
 *    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
 *                                                       
 */

/**
 * Create a module that allows us to update scene parameters.
 */
var setParamsModule = {
    //variables
    canvas, 
    displays: {
        drag: null,
        gravity: null,
        speed: null
    },
    sliders: {
        drag: null,
        gravity: null,
        speed: null
    },
    parameters: {
        drag: null,
        gravity: 9.81,
        speed: 1.0
    },
    //functions
    /**
     * Adds n particles to particles, positions, velocities.
     * @param {Number} n
     */
    updateParameters:
    function (caller) {
        for(var key in caller.sliders) {
            caller.parameters[key] = caller.sliders[key].value;
        }
        scene.gravity = caller.parameters.gravity;
    },  
    /**
	 * Update DOM displays of parameter info.
	 * @param {object} caller - Object that called the function.
	 */
    updateIndicators:
    function (caller) {
        for(var key in caller.sliders) {
            caller.displays[key].innerHTML = caller.sliders[key].value;
        }
    },
    /**
     * Initializes module
     * @param {object}        canvas  - DOM canvas object (not its ID).
     * @param {Array}         displays - Array of DOM display objects (not their IDs).
     * @param {Array}         sliders  - Array of DOM slider objects (not their IDs).
     */
    initialize:
    function(canvas, displays, sliders) {
        var i;

        this.canvas = canvas;
        i = 0;
        for (var key in this.displays) {
            this.displays[key] = displays[i];
            i += 1;
        }
        /*DEBUG*/ console.log("Populated displays with ", this.displays);
        i = 0;
        for (var key in this.sliders) {
            /*DEBUG*/ //console.log("Saving reference to slider #", i);
            this.sliders[key] = sliders[i];
            i += 1;
        }
        /*DEBUG*/ console.log("Populated sliders with ", this.sliders);

        var _this = this;

        var DOMControls = [
            {
                elements: [window],
                events: ["load"],
                callback: function() {
                    _this.updateParameters(_this);
                    _this.updateIndicators(_this);
                }
            },
            {
                elements: [this.sliders.gravity, this.sliders.speed],
                events: ["change", "mousemove", "click", "keypress"],
                callback: function () {
                    _this.updateParameters(_this);
                    _this.updateIndicators(_this);
                }
            }
        ];

        for(var i in DOMControls) {
            for (var j in DOMControls[i].elements) {
                var element = DOMControls[i].elements[j];
                for (var k in DOMControls[i].events) {
                    var event = DOMControls[i].events[k];
                    /*DEBUG*/ /*console.log("Trying to attach listener to ", element.id,
                                        " to respond to ", event,
                                        " with ", DOMControls[i].callback); */
                    element.addEventListener(event, DOMControls[i].callback);
                }
            }
        }

        return this;
    }
}

/***
 *    ███████╗████████╗ █████╗ ████████╗███████╗
 *    ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
 *    ███████╗   ██║   ███████║   ██║   ███████╗
 *    ╚════██║   ██║   ██╔══██║   ██║   ╚════██║
 *    ███████║   ██║   ██║  ██║   ██║   ███████║
 *    ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
 *                                              
 */

/**
 * Create a module that allows us to poll the scene and debug particles.
 */
var getStatsModule = {
    //variables
    button: null,
    displays: null,
    picker: null,
    stats: null,
    index: 1,
    particles: null,
    positions: null,
    velocities: null,
    //functions
    updateIndicators:
    function (caller) {
        caller.picker.max = caller.particles.length.toString();
        for (var i in caller.displays) {
            caller.displays[i].innerHTML = "";
        }
        for (var i in caller.stats) {
            caller.displays[caller.stats[i].which].innerHTML += 
                "<span class=\"getStats-label\">" + caller.stats[i].label +
                "</span>" + ": <br>" + caller.stats[i].routine(caller);
        }
    },
    initialize:
    function (button, displays, picker, particles, positions, velocities) {
        var _this = this;

        this.button = button;
        this.displays = displays;
        this.picker = picker;
        this.particles = particles;
        this.positions = positions;
        this.velocities = velocities;

        var DOMControls = [
            {
                element: window,
                event: "load",
                callback: function () {
                    _this.index = picker.value;
                    _this.updateIndicators(_this);
                }
            },
            {
                element: button,
                event: "click",
                callback: function () {
                    _this.index = picker.value;
                    _this.updateIndicators(_this);
                }
            },
            {
                element: button,
                event: "mousedown",
                callback: function () {
                    _this.index = picker.value;
                    _this.updateIndicators(_this);
                }
            },
            {
                element: picker,
                event: "mousemove",
                callback: function () {
                    _this.index = picker.value;
                }
            },
            {
                element: picker,
                event: "change",
                callback: function () {
                    _this.index = picker.value;
                }
            }
        ];

        for(var i in DOMControls) {
            var control = DOMControls[i];
            control.element.addEventListener(control.event, control.callback);
        }

        _this.stats = [
            { 
                which: 0,
                label: "Number of Particles",
                routine: function (caller) {
                    return caller.particles.length + "<br>";
                }
            },
            {
                which: 0,
                label: "Average Position",
                routine: function (caller) {
                    if(caller.particles.length == 0) {
                        return "[N/A]<br>";
                    }
                    var sum = [0.0, 0.0, 0.0];
                    for (var i = 0; i < caller.positions.length; i += 1) {
                        sum[0] += caller.positions[i][0];
                        sum[1] += caller.positions[i][1];
                        sum[2] += caller.positions[i][2];
                    }
                    return "(" + (sum[0] / caller.particles.length).toFixed(2) + ", " +
                        (sum[1] / caller.particles.length).toFixed(2) + ", " + 
                        (sum[2] / caller.particles.length).toFixed(2) + ")<br>";
                }
            },
            {
                which: 0,
                label: "Average Velocity",
                routine: function (caller) {
                    if(caller.particles.length == 0) {
                        return "[N/A]<br>";
                    }
                    var sum = [0.0, 0.0, 0.0];
                    for (var i = 0; i < velocities.length; i += 1) {
                        sum[0] += caller.velocities[i][0];
                        sum[1] += caller.velocities[i][1];
                        sum[2] += caller.velocities[i][2];
                    }
                    return "(" + (sum[0] / caller.particles.length).toFixed(2) + ", " +
                        (sum[1] / caller.particles.length).toFixed(2) + ", " +
                        (sum[2] / caller.particles.length).toFixed(2) + ")<br>";
                }
            },
            {
                which: 1,
                label: "Sampled Position",
                routine: function (caller) {
                    if(caller.particles.length == 0) {
                        return "[N/A]<br>";
                    }
                    var index = caller.index;
                    return "Particle #" + index + ": (" +
                        caller.positions[index - 1][0].toFixed(2) + ", " +
                        caller.positions[index - 1][1].toFixed(2) + ", " +
                        caller.positions[index - 1][2].toFixed(2) + ")<br>";
                }
            },
            {
                which: 1,
                label: "Sampled Velocity",
                routine: function (caller) {
                    if(caller.particles.length == 0) {
                        return "[N/A]<br>";
                    }
                    var index = caller.index;
                    return "Particle #" + index + ": (" +
                        caller.velocities[index - 1][0].toFixed(2) + ", " +
                        caller.velocities[index - 1][1].toFixed(2) + ", " +
                        caller.velocities[index - 1][2].toFixed(2) + ")<br>";
                }
            }
        ];
        return this;
    } //end of initialize function
};

/***
 *    ███████╗████████╗ █████╗ ██████╗ ████████╗
 *    ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
 *    ███████╗   ██║   ███████║██████╔╝   ██║   
 *    ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   
 *    ███████║   ██║   ██║  ██║██║  ██║   ██║   
 *    ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
 *                                              
 */

function initializeModules() {
    scene = {
        colors: [],
        particles: [],
        positions: [],
        velocities: [],
        bounds: {
            leftmost: -1.0,
            rightmost: 1.0,
            topmost: 1.0,
            bottommost: -1.0,
            frontmost: 1.0,
            backmost: -1.0
        },
        dampening: 0.975,
        elasticity: 0.975,
        gravity: 9.81,
        mass: 1.0,
        radius: 0.1,
        speed: 1.0,
        lastTime: Date.now(),
        lastColorTime: []
    };

    canvas = document.getElementById("myGLCanvas");

    addBalls = addBallsModule.initialize(
        document.getElementById("addParticles-button"),
        canvas,
        document.getElementById("addParticles-display"),
        document.getElementById("addParticles-picker"),
        scene.colors, scene.particles, scene.positions,
        scene.velocities);

    clearBalls = clearBallsModule.initialize(
        canvas,
        document.getElementById("clearParticles-button"),
        scene.colors, scene.particles, scene.positions,
        scene.velocities);

    setParams = setParamsModule.initialize(
        canvas,
        [
            document.getElementById("drag-display"),
            document.getElementById("gravity-display"),
            document.getElementById("speed-display")
        ],
        [
            document.getElementById("drag-slider"),
            document.getElementById("gravity-slider"),
            document.getElementById("speed-slider")
        ]
    );

    getStats = getStatsModule.initialize(
        document.getElementById("getStats-button"),
        [
            document.getElementById("getStats-display1"),
            document.getElementById("getStats-display2")
        ],
        document.getElementById("getStats-number"),
        scene.particles, scene.positions,
        scene.velocities);

    /*DEBUG*/ console.log("Initialized all interface modules.");
}

/* call initializeModules(); from external files. */