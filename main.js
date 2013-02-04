"use strict";
$(document).ready(function() {
    // Get parameters from URL
    var getParameterByName = function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };
    
    var makeSeed = function(length) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i <= length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    
    // Deserialize
    if (getParameterByName('mainColor') != null)
        $('input[name="mainColor"]').val(getParameterByName('mainColor'));
    if (getParameterByName('seed') != null)
        $('input[name="seed"]').val(getParameterByName('seed'));
        
    if (getParameterByName('persistence') != null)
        $('input[name="persistence"]').val(getParameterByName('persistence'));
        
    if (getParameterByName('cutoff1') != null)
        $('input[name="cutoff1"][value="c1"]').prop("checked", true);
    if (getParameterByName('cutoff2') != null)
        $('input[name="cutoff2"][value="c2"]').prop("checked", true);
    if (getParameterByName('cutoff3') != null)
        $('input[name="cutoff3"][value="c3"]').prop("checked", true);
        
    if (getParameterByName('c1v') != null)
        $('input[name="c1v"]').val(getParameterByName('c1v'));
    if (getParameterByName('c2v') != null)
        $('input[name="c2v"]').val(getParameterByName('c2v'));
    if (getParameterByName('c3v') != null)
        $('input[name="c3v"]').val(getParameterByName('c3v'));
        
    if (getParameterByName('cutoffColor1') != null)
        $('input[name="cutoffColor1"]').val(getParameterByName('cutoffColor1'));
    if (getParameterByName('cutoffColor2') != null)
        $('input[name="cutoffColor2"]').val(getParameterByName('cutoffColor2'));
    if (getParameterByName('cutoffColor3') != null)
        $('input[name="cutoffColor3"]').val(getParameterByName('cutoffColor3'));
    
    // Create seed
    if ($('input[name="seed"]').val() === "") {
        $('input[name="seed"]').val(makeSeed(12));
    }
    
    // Create noise object
    var canvas = document.getElementById("canvas");
    var noise = new MyNoise();
    window.my_noise = noise;
    window.my_noise.linkedIn = true;
    
    // Parse form and resubmit
    var startNoise = function() {
        var mainColor = $('input[name="mainColor"]').val();
        var cutOff = new Array(3);
        
        // Cutoff 1
        var s = $('input[name="cutoffColor1"]').val();
        var r = parseInt(s.substring(0,2), 16);
        var g = parseInt(s.substring(2,4), 16);
        var b = parseInt(s.substring(4,6), 16);
        if ($('input[name="cutoff1"][value="c1"]').attr('checked')) {
            var r1 = parseInt($('input[name="c1v"]').val()) * 0.01;
            cutOff[0] = [true, r1, r, g, b];
        } else cutOff[0] = [false, 0, 0];
        
        // Cutoff 2
        s = $('input[name="cutoffColor2"]').val();
        r = parseInt(s.substring(0,2), 16);
        g = parseInt(s.substring(2,4), 16);
        b = parseInt(s.substring(4,6), 16);
        if ($('input[name="cutoff2"][value="c2"]').attr('checked')) {
            var r1 = parseInt($('input[name="c2v"]').val()) * 0.01;
            cutOff[1] = [true, r1, r, g, b];
        } else cutOff[1] = [false, 0, 0];
        
        // Cutoff 3
        s = $('input[name="cutoffColor3"]').val();
        r = parseInt(s.substring(0,2), 16);
        g = parseInt(s.substring(2,4), 16);
        b = parseInt(s.substring(4,6), 16);
        if ($('input[name="cutoff3"][value="c3"]').attr('checked')) {
            var r1 = parseInt($('input[name="c3v"]').val()) * 0.01;
            cutOff[2] = [true, r1, r, g, b];
        } else cutOff[2] = [false, 0, 0];
        
        // Main color
        s = $('input[name="mainColor"]').val();
        r = parseInt(s.substring(0,2), 16);
        g = parseInt(s.substring(2,4), 16);
        b = parseInt(s.substring(4,6), 16);
        my_noise.draw(r, g, b, cutOff);
        
        // URL
        var new_url = window.location.origin + window.location.pathname;
        var new_par = $('#form').serialize();
        window.noise_url = new_url +"?"+ new_par;
        $('#url').attr("href", window.noise_url);
    };
    
    // Add event handlers
    window.startNoise = startNoise;
    $('input[name="mainColor"]').change(window.startNoise);
    $('input[name="cutoffColor1"]').change(window.startNoise);
    $('input[name="cutoffColor2"]').change(window.startNoise);
    $('input[name="cutoffColor3"]').change(window.startNoise);
    $('input[name="cutoff1"][value="c1"]').change(window.startNoise);
    $('input[name="cutoff2"][value="c2"]').change(window.startNoise);
    $('input[name="cutoff3"][value="c3"]').change(window.startNoise);
    $('input[name="c1v"]').change(window.startNoise);
    $('input[name="c2v"]').change(window.startNoise);
    $('input[name="c3v"]').change(window.startNoise);
    
    $('#form').submit( 
        function(e) {
            var persistence = $('input[name="persistence"]').val();
            if (!window.my_noise.linkedIn)
                $('input[name="seed"]').val(makeSeed(12));
            window.my_noise.linkedIn = false;
            
            var seed = $('input[name="seed"]').val();
            my_noise.init(700, 500, canvas, persistence * 0.01, seed);
            window.startNoise();
            
            // Input
            document.onkeyup = function(event) { 
                if (event.keyCode === 32 ||
                    event.keyCode === 32) {
                    $('#form').submit();
                }
            }
            
            return false; // Prevent reload
        }
    );
    
    $('#form').submit();
});