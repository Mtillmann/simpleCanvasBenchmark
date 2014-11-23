# SimpleCanvasBenchmark

This will allow you to roughly determine the performance of a system
in moderate time. Use it to determine whether it is worthwile to load
and use complex animations or rather present the user a lo-fi version
that performs well on low-end machines.

## why
I build this to be able to determine whether or not to load large
SVG elements or fall back to video. The problem were IE11 instances,
some of which ran on virtual desktops, others on bare metal. It was
impossible to detect which instance ran on what platform except for
much worse performance of the virtual ones.

## how to
before setting up and starting your animations run a small benchmark to determine
the target system's performance.

the global `benchmark` method accepts two arguments:

- `options`  
  either an object or an array of objects
- `callback`  
  the function to run when the benchmark has completed

## example
```
benchmark({samples : 5, runs : 3}, function(result){
  // your code here 
});
```
`result` will contain the `avgFPS`, details about each of the `runs` and
`timeUsed`, the amount of microseconds the whole benchmark consumed.

## options
The default Options (as determined on my i7-3517U laptop) are:

```
{
  samples : 60,
  cycles : 700,
  lineWidth : 10, 
  prependSamples : 1,
  mode : 'requestAnimationFrame'
}
```

- `samples`  
  number of samples to take
- `cycles`  
  number of draw cycles per sample
- `lineWidth`  
  line width of the line that is drawn each cycle. Increasing the line width is taxing for the cpu but you should not set if above 60, best not touch at all. 
- `prependSamples`  
  number of samples to be run before data is captured. Can be used to prime canvas api.
- `mode`  
  setting this to anything other than 'requestAnimationFrame' will fall back to setTimeout
- `runs`  
  sets how many times the performance should be sampled

Options that are not set in the object you are passing to ``benchmark`` will be taken from the
defaults