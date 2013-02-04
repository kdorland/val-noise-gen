"use strict";
var ValueNoise = function(width, height) {
    this.width = width;
    this.height = height;
};

ValueNoise.prototype = {
    width: 0,
    height: 0,
    persistence: 0.55,
    numberOfOctaves: 6,
    input: {},
    noise: {},
    ran: undefined,
    
    scaleTo0_1: function(value, inMin, inMax, outMin, outMax) {
        /*var outSpan = outMax - outMin;
        return (value - inMin) / (outSpan);*/
        return ((value - inMin) / (inMax-inMin)) * (outMax-outMin) + outMin;
    },

    initArrays: function(index) {
        this.input[index] = new Array(this.width);
        for (var i = 0; i < this.width; i++) {
            this.input[index][i] = new Array(this.height);
        }
        
        this.noise = new Array(this.width);
        for (i = 0; i < this.width; i++) {
            this.noise[i] = new Array(this.height);
        }
    },
    
    seedRandom: function(seed) {
        this.ran = new MersenneTwister();
        this.ran.init_by_array(seed.split(""), seed.length);
    },
    
    fillInputArray: function(index) {
        var r = this.ran || Math;
        
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.input[index][x][y] = r.random();
            }
        }
    },
    
    // Interpolate x between a and b
    cosineInterpolate: function(a, b, x) {
        var angle = x * Math.PI;
        var f = (1 - Math.cos(angle)) * 0.5;
        return a * (1 - f) + b * f;
    },

    interpolate: function(x, y, a) {
        var int_x        = Math.floor(x);
        var fractional_X = x - int_x;
        var int_y        = Math.floor(y);
        var fractional_Y = y - int_y;

        var v1 = a[int_x][int_y];
        var v2 = a[int_x+1][int_y];
        var v3 = a[int_x][int_y+1];
        var v4 = a[int_x+1][int_y+1];

        var i1 = this.cosineInterpolate(v1, v2, fractional_X);
        var i2 = this.cosineInterpolate(v3, v4, fractional_X);
        return   this.cosineInterpolate(i1, i2, fractional_Y);
    },
    
    getNoise: function(x, y) {
        var result = 0;
        var freq = 1 / 64;
        var ampl = 1;
      
        for (var i = 0; i < this.numberOfOctaves; i++) {
            result += this.interpolate(x * freq, y * freq, this.input[i]) * ampl;
            freq = freq * 2;
            ampl = ampl * this.persistence;
        }
        
        return result;      
    },
    
    initNoise: function(persistence) {
        var i = 0;
        var x = 0;
        var y = 0;
        
        if (persistence !== undefined) {
            this.persistence = persistence;
        }
        
        // Init arrays
        for (var i = 0; i < this.numberOfOctaves; i++) {
            this.initArrays(i);
            this.fillInputArray(i);
        }
        
        // Fill noise array
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                this.noise[x][y] = this.getNoise(x, y);
            }
        }
        
        // Normalize buffer
        var maxValue = 0;
        var minValue = 999999999;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                maxValue = Math.max(this.noise[x][y], maxValue);
                minValue = Math.min(this.noise[x][y], minValue);
            }
        }
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                var n1 = this.noise[x][y];
                var n2 = this.scaleTo0_1(n1, minValue, maxValue, 0, 1);
                this.noise[x][y] = n2;
                if (n2 > 1)
                    null;
            }
        }
    }
};

