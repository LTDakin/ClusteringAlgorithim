/*
File: ClusteringAlgorithim.js
Authors: Lloyd Dakin, Fernando Ruiz
NetIDs: dakin, fernandoruiz
Assignment: Project 1 Part 2
Course: CSc372
TA: Josh, Tito
Purpose: The following program computes a k–means clustering algorithim,
that determines the groupings of a set of n data points into k clusters
such that each point is the closet cluster, which is determined by the
Euclidean distances from the points to the centroids of the cluster’s contents.
The program takes in a file with n two–dimensional data points (X,Y) (1 ≤ i ≤ n), 
as will k and the initial cluster centroids (1 ≤ j ≤ k).

Link to Language Study:
https://docs.google.com/document/d/1N3WS1ZtcpaxTfFxfUTIGwsvziVHvEi_vAQysm1wErSA/edit?usp=sharing
*/

/*
main(): Used to start execution of the Cluster Algorithim.
*/
function main() {
    // Make sure we got a filename on the command line.
    if (process.argv.length < 3) {
      console.log('Missing starting file');
      process.exit(1);
    }

    // Read the file and print its contents.
    var fs = require('fs'), filename = process.argv[2];
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
    var countIter = 0;
    while(change) {
      var oldClusters = JSON.parse(JSON.stringify(clusters));
      // Calculate centroids
      if(notfirst) {
        computeCentroid(clusters); 
      } else {
        notfirst = true;
      }
      // Assign data points to clusters
      for(var i = 0; i<dataPoints.length; i++) {
        var closestCluster = 0;
        var x = dataPoints[i].X;
        var y = dataPoints[i].Y;
        // Check data point with each centroid find closest
        for(var j = 0; j<clusters.length; j++) {
          var distance;
          if(j == 0) { 
            distance = euclidDist({X:(clusters[j].cluster[0]), Y:(clusters[j].cluster[1])}, {X:x, Y:y}); 
          } else {
            var newDistance = euclidDist({X:(clusters[j].cluster[0]), Y:(clusters[j].cluster[1])}, {X:x, Y:y});
            if(newDistance < distance) {
              closestCluster = j;
              distance = newDistance;
            }
          } 
        }
        // add data point to closest cluster
        clusters[closestCluster].points.push(dataPoints[i]);
      }
      // if no points changed clusters we're done
      if(clustersEqual(oldClusters,clusters)) {
        change = false;
      }
      //count required iterations.
      countIter++;
    }

    //print results
    printClusters(clusters, countIter);
    });
  }
  
/*
printClusters(clusters):Prints to console the final centroid locations.

The following function prints the cluster objects in the clusters array with
the centroid/final cluster in the format from the spec.
*/
  function printClusters(clusters, countIter) {
    console.log("The final centroid locations are:");
    console.log("");
    for(var i=0; i<clusters.length; i++)
    {
      var x = clusters[i].cluster[0].toFixed(3);
      var y = clusters[i].cluster[1].toFixed(3);
      console.log("u(" + (i+1) + ") = (" + parseFloat(x) + "," + parseFloat(y) + ")");
    }
    console.log("");
    console.log(parseInt(countIter) + " iterations were required.");
  }
  
/*
clustersEqual(c1,c2): Returns a boolean of whether or not the two passed
in cluster arrays are equal to eachother. 

The following function loops through each cluster in the passed in cluster 
arrays and thier points to determine whether or not they are equal. 
*/
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
  
/*
parseFileContents(fileContents, dataPoints, clusters, k, n):
Populates the passed in arrays using the data in param fileContents
and thier specifed amount of data by n for dataPoints and k for
clusters. 

The following function parses/loops through the contents of the passed in
array fileContents and adds (X,Y) value pairs to the passed in array
dataPoints based on the param amount n and to the array clusters based on the
param amount k. The (X,Y) values are added to the arrays as objects: 
dataPoints(X:Int, Y:Int) and clusters (cluster:Array, points:Array). 
*/
  function parseFileContents(fileContents, dataPoints, clusters, k, n){
    for (var i = 2; i < fileContents.length; i+=2) {
      //X Y pairs
      var x = parseInt(fileContents[i]);
      var y = parseInt(fileContents[i+1]);
  
      if(k > 0){
        //add cluster object 
        clusters.push({cluster:[x,y], points:[]});
        k--; 
      }
  
      if(n > 0){
        //add data point object
        dataPoints.push({ X:x, Y:y });
        n--;
      }
    }
  }
  
/*
computeCentroid(clusters): updates the cluster objects in the array called
clusters by computing the means of each cluster's points((X,Y),..)
using thier .points field. The .cluster field is then updated with its
.points field reset.

The following function loops through the cluster objects in the array called
clusters and loops through their .points field to compute the means of  
all the cluster's points((X,Y),..). The .cluster field is then updated with its
.points field reset after each cluster object iteration. 
*/
  function computeCentroid(clusters){
    //loops through each cluster
    for (var i = 0; i < clusters.length; i++) {
      var sum = [0,0];
      var pts = clusters[i].points;
      var len =  pts.length;
      //loops through each cluster's points
      for (var j = 0; j < len; j++) {
        sum = [(sum[0] += pts[j].X), (sum[1] += pts[j].Y)];
      }
      //update cluster
      clusters[i].cluster = [((1/len) * sum[0]), ((1/len) * sum[1])];
      //reset points
      clusters[i].points = [];
    }
  }
  
/*
euclidDist(pt1, pt2): Returns the Euclidean distance of the two passed in
points pt1 and pt2.

The following function calculates the squared Euclidean distance between two
data points objects using thier fields X and Y to be computed in the
following format (x1 − x2)^2 + (y1 − y2)^2.
*/
  function euclidDist(pt1, pt2){
    return Math.pow((pt1.X - pt2.X), 2) + Math.pow((pt1.Y - pt2.Y),2);
  }

//execute program
main();