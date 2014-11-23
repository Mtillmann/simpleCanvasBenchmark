/*!
SimpleCanvasBenchmark version 0.1.0 
2014 by Martin Tillmann <mtillmann@gmail.com>
MIT License
*/
(function ($window,undefined){
    "use strict";

    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        defaultSettings = {
            samples : 60,
            cycles : 700,
            lineWidth : 10,
            prependSamples : 1,
            mode : 'requestAnimationFrame'
        },
        dateNowSupported = 'now' in Date,
        requestAnimationFrameSupported = 'requestAnimationFrame' in $window;

    function arraySum(a){
        var i = 0,s = 0,n = a.length;
        for (; i < n; ++i){
            s+=a[i];
        }
        return s;
    }

    function average(a){
        return arraySum(a) / a.length;
    }


    function timeArrayToFPS(a){
        return 1000 / average(a);
    }

    function getMicrotime(){
        return dateNowSupported?Date.now():+new Date();
    }


    function run(settings,callback){
        var localSettings = {},
            i, j, start, now, 
            times = [], samples = 0;

        for( i in defaultSettings ){
            localSettings[i] = settings[i] || defaultSettings[i];
        }

        ctx.lineWidth = localSettings.lineWidth;
         
        start = getMicrotime();
       
        function benchmark(){
            var now = getMicrotime(), j;
            for( j = 0; j < localSettings.cycles; ++j){
                ctx.beginPath();
                ctx.clearRect(0,0,300,150);
                ctx.moveTo(50,50);
                ctx.lineTo(250,100);
                ctx.stroke();
                ctx.closePath();
            }
            
            samples++;
            
            if(samples > localSettings.prependSamples){
                times.push(now - start);
            }
            
            start = now;

            if(samples > localSettings.samples){
                return callback({
                    avgFPS : timeArrayToFPS(times),
                    times : times
                });
            }

            if(localSettings.mode === 'requestAnimationFrame' && requestAnimationFrameSupported){
                requestAnimationFrame(benchmark);
            }else{
                setTimeout(benchmark,0);
            }
        }
         
        benchmark();
    }

    $window.benchmark = function(settings,callback){
        settings = / Array\(/.test(settings.constructor)?settings:[settings || {}];
        var opt = { avgFPS : 0, runs : [] }, 
            i = 0, l, result, averages = [],
            started = getMicrotime();

        if('runs' in settings[0] && settings.length === 1){
            for( i = 0; i < settings[0].runs - 1; i++){
                settings.push(settings[0])
            }
        }

        function afterRun(result){
            opt.runs.push(result);

            if(settings.length === 0){
                for( i = 0, l = opt.runs.length; i < l; i++){
                    averages.push(opt.runs[i].avgFPS);
                }
                opt.avgFPS = average(averages);
                opt.timeUsed = getMicrotime() - started;

                return callback(opt);
            }
            run(settings.shift(),afterRun)
        }

        run(settings.shift(),afterRun)
    }
})(this);