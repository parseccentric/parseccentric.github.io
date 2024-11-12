var debug = {
    ballCap: 1000,
    ballScale: 0.5,
    dampening: null,
    drawTestParticle: false,
    keepTicking: true,
    sphereVertices: [],
    // Draw a the scene.
    draw: function () {
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Setup a rectangle
        setRectangle(gl, translation[0], translation[1], width, height);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset)

        // set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color
        gl.uniform4fv(colorLocation, color);

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    },
    outputVertexLocations: function (modelViewMat, perspectiveMat, extremes) {
        /*DEBUG*/ console.log("Computing where the following vertices on the extremes will end up: ", 
                             extremes);
        var points = [
            mat4.fromValues(extremes.frontmost[0].toFixed(3), extremes.frontmost[1].toFixed(3), 
                            extremes.frontmost[2].toFixed(3), 1.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0),
            mat4.fromValues(extremes.backmost[0].toFixed(3), extremes.backmost[1].toFixed(3), 
                            extremes.backmost[2].toFixed(3), 1.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0),
            mat4.fromValues(extremes.uppermost[0].toFixed(3), extremes.uppermost[1].toFixed(3), 
                            extremes.uppermost[2].toFixed(3), 1.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0),
            mat4.fromValues(extremes.lowermost[0].toFixed(3), extremes.lowermost[1].toFixed(3), 
                            extremes.lowermost[2].toFixed(3), 1.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0),
            mat4.fromValues(extremes.leftmost[0].toFixed(3),  extremes.leftmost[1].toFixed(3), 
                            extremes.leftmost[2].toFixed(3), 1.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0),
            mat4.fromValues(extremes.rightmost[0].toFixed(3), extremes.rightmost[1].toFixed(3), 
                            extremes.rightmost[2].toFixed(3), 1.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0)
        ];
        
        var MVPMat = mat4.create();
        mat4.multiply(MVPMat, perspectiveMat, modelViewMat);
        var outMat = mat4.create();
        var output = [];
        for (var i in points) {
            console.log("Sample point ", i); this.printMatrix(points[i]);
            output.push(mat4.multiply(outMat, MVPMat, points[i]).slice());
        }

        console.log("The x range is [",  output[4][0], ", ", output[5][0], "].");
        console.log("The y range is [",  output[3][1], ", ", output[2][1], "].");
        console.log("The z range is [",  output[0][2], ", ", output[1][2], "].");
    },
    printMatrix: function (matrix4) {
        console.log("[ " + matrix4[0] + " " + matrix4[4] + " " + matrix4[8] + " " + matrix4[12] + "]");
        console.log("[ " + matrix4[1] + " " + matrix4[5] + " " + matrix4[9] + " " + matrix4[13] + "]");
        console.log("[ " + matrix4[2] + " " + matrix4[6] + " " + matrix4[10] + " " + matrix4[14] + "]");
        console.log("[ " + matrix4[3] + " " + matrix4[7] + " " + matrix4[11] + " " + matrix4[15] + "]");
    }
}