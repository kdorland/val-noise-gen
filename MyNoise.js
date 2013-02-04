"use strict";
var MyNoise = function() {
    this.context = null;
    this.noise = null;
    this.width = 0;
    this.height = 0;
};

MyNoise.prototype = {
    context: {},
    noise: {},
    width: 0,
    height: 0,
    
    init: function (width, height, canvas, persistence, seed) {
        this.width = width;
        this.height = height;
        this.context = canvas.getContext("2d");
        this.noise = new ValueNoise(width, height);
        this.noise.seedRandom(seed);
        this.noise.initNoise(persistence);
    },
    
    draw: function(r, g, b, cutOff) {
        // Use output array to fill canvas buffer
        var data = this.context.createImageData(this.width, this.height);
        for (var x = 0; x < data.width; x++) {
            for (var y = 0; y < data.height; y++) {
                var index = (y * data.width + x) * 4;
                var s = this.noise.noise[x][y];
              
                var red = r;
                var green = g;
                var blue = b;
                
                if (cutOff){
                    if (cutOff[0][0] && s <= cutOff[0][1]) {
                        s = 1;
                        red = cutOff[0][2];
                        green = cutOff[0][3];
                        blue = cutOff[0][4];
                    } else 
                    if (cutOff[1][0] && s <= cutOff[1][1]) {
                        s = 1;
                        red = cutOff[1][2];
                        green = cutOff[1][3];
                        blue = cutOff[1][4];
                    } else 
                    if (cutOff[2][0] && s <= cutOff[2][1]) {
                        s = 1;
                        red = cutOff[2][2];
                        green = cutOff[2][3];
                        blue = cutOff[2][4];
                    }
                }
        
                data.data[index] = red*s; // red
                data.data[index+1] = green*s; // green         
                data.data[index+2] = blue*s; // blue
                    
                data.data[index + 3] = 255; // alpha
            }
        }
        // Put canvas buffer data back
        this.context.putImageData(data, 0, 0);
    }
}
