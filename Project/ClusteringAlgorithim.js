// Project 1 
// Contributers: Lloyd Dakin,
// NetIDs: dakin, 


//TODO, Euclidian distance function, passed two Points, returns a Int/Double distance

//TODO, Calculating new centroid position function, passed a [ClusterObject], returns a [ClusterObject]

//TODO, Point Class, int x, int y

//TODO, ClusterObject Class, Point centroid, array of points in cluster [Point] 

// need to figure out how to read a file in from terminal 


// After those done I'll work on the loop, might need ideas for checking if none of the points changed clusters, thats the end condition

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Missing starting file');
  process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
  , filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('file is ' + filename);
  console.log(data)  //TODO instead of loging create Points and [ClusterObject]
});