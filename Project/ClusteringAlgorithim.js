// Project 1 
// Contributers: Lloyd Dakin,
// NetIDs: dakin, fernandoruiz

function main() {
  // Make sure we got a filename on the command line.
  if (process.argv.length < 2) {                              //FERN: for testing... REMINDER TO SET BACK TO 3!!!
    console.log('Missing starting file');
    process.exit(1);
  }

  // Read the file and print its contents.
  var fs = require('fs'), filename = 'input.txt';     //FERN: for testing... REMINDER TO SET BACK TO process.argv[2];
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    var fileContents = data.replace(/\s+/g, ' ').split(" ");
    var dataPoints = [];
    var clusters = [];
    var k = fileContents[0];
    var n = fileContents[1];

    //error check
    if(k < 0 || k > n){
      console.log('Error: The condition 0 < k ≤ n must be true for the algorithm to work!');
      process.exit(1);
    }
    
    parseFileContents(fileContents, dataPoints, clusters, k, n);

    //first loop dont calculate centroids
    //loop calculate centroids put points into clusters
    var change = true;
    var notfirst = false;
    while(change)
    {
      var oldClusters = JSON.parse(JSON.stringify(clusters));
      // Calculate centroids
      if(notfirst)
      {
        computeCentroid(clusters); 
      }
      else 
        notfirst = true;
      // Assign data points to clusters
      for(var i = 0; i<dataPoints.length; i++)
      {
        var closestCluster = 0;
        var x = dataPoints[i].X;
        var y = dataPoints[i].Y;
        // Check data point with each centroid find closest
        for(var j = 0; j<clusters.length; j++)
        {
          var distance;
          if(j == 0)
          { 
            distance = euclidDist({X:(clusters[j].cluster[0]), Y:(clusters[j].cluster[1])}, {X:x, Y:y}); 
          }
          else
          {
            var newDistance = euclidDist({X:(clusters[j].cluster[0]), Y:(clusters[j].cluster[1])}, {X:x, Y:y});
            if(newDistance < distance)
            {
              closestCluster = j;
              distance = newDistance;
            }
          } 
        }
        // add data point to closest cluster
        clusters[closestCluster].points.push(dataPoints[i]);
      }
      // if no points changed clusters we're done
      if(clustersEqual(oldClusters,clusters))
        change = false;
    }

    console.log("Final Result ----------------------------------- ");
    printClusters(clusters);

    //testSuite(fileContents, dataPoints, clusters);           //FERN: for testing... REMINDER TO REMOVE function
  });
}

function printClusters(clusters)
{
  for(var i=0; i<clusters.length; i++)
  {
    console.log("Cluster " + (i+1) + " centroid: " + clusters[i].cluster);
    console.log("Points: ");
    clusters[i].points.forEach(element => console.log(element));
    console.log("");
  }
}

function clustersEqual(c1,c2) {
  for(var i = 0; i < c1.length; i++)
  {
    var a1 = c1[i].points;
    var a2 = c2[i].points;

    if(a1.length != a2.length)
      return false;

    for(var j = 0; j<a1.length; j++)
    {
      if((a1[j].X != a2[j].X) || (a1[j].Y != a2[j].Y))
        return false;
    }
  }

  return true;
}

function parseFileContents(fileContents, dataPoints, clusters, k, n){
  for (var i = 2; i < fileContents.length; i+=2) {
    var x = parseInt(fileContents[i]);
    var y = parseInt(fileContents[i+1]);

    if(k > 0){
      clusters.push({cluster:[x,y], points:[]});
      k--; 
    }

    if(n > 0){
      dataPoints.push({ X:x, Y:y });
      n--;
    }
  }
}

function computeCentroid(clusters){
  for (var i = 0; i < clusters.length; i++) {
    var sum = [0,0];
    var pts = clusters[i].points;
    var len =  pts.length;
    for (var j = 0; j < len; j++) {
      sum = [(sum[0] += pts[j].X), (sum[1] += pts[j].Y)];
    }
    clusters[i].cluster = [((1/len) * sum[0]), ((1/len) * sum[1])];
    clusters[i].points = [];
  }
}

function euclidDist(pt1, pt2){
  return Math.pow((pt1.X - pt2.X), 2) + Math.pow((pt1.Y - pt2.Y),2);
}

function testSuite(fileContents, dataPoints, clusters){

  //test cluster objs and data point objs
    console.log();
    console.log('Testing clusters and dataPoints population');
    console.log(clusters);
    console.log(dataPoints);

//test computeCentroid()
  console.log();
  console.log('Testing computation of the centroids (µi) of the k clusters');
  //C1
  clusters[0].points.push([3,4]); //d1
  //C2
  clusters[1].points.push([3,3]); //d2
  clusters[1].points.push([1,2]); //d3
  clusters[1].points.push([4,2]); //d4
  clusters[1].points.push([3,1]); //d5
  computeCentroid(clusters);
  console.log(clusters);

//test euclidDist()
  console.log();
  console.log('Testing Euclidean distance');
  var dist = euclidDist({ X:3, Y:4 }, { X:2.75, Y:2 });
  console.log(dist);
}

main();