/**
* Travelling Salesman Project
* @author Ingrid Shu
* NOTE: CAN ONLY DISPLAY 1 HEURISTIC AT A TIME:(
*/

// points from clicks on canvas
var dotX = [];
var dotY = [];
// tour for NearestNeighbor
var nearestX = [];
var nearestY = [];
// tour for SmallestIncrease
var smallestIncX = [];
var smallestIncY = [];

$(document).ready( function() {
		//get context of canvas
		var canvas = $("#canvas").get(0);
		var ctx = canvas.getContext("2d");
		ctx.canvas.width = 600;
		ctx.canvas.height = 400;
		
	$("#canvas").click( function() {		
		var xVal = event.pageX - canvas.offsetLeft;
		var yVal = event.pageY - canvas.offsetTop;
		// print to console
		//console.log(xVal);
		//console.log(yVal);
		
		//add point to canvas (write this)
		
		// fillRect(x, y, width, height)
		ctx.fillRect(xVal, yVal, 3, 3);
		
		//add point to arrays
		dotX.push(xVal);
		dotY.push(yVal);	
	});
	
	
	$("#NearestNeighbor").click( function() {
		console.log("NEAREST NEIGHBOR ALGORITHM");
		//console.log("DOTX " + dotX);
		//console.log("DOTY " + dotY);
		
		//do algorithm
		// NEAREST NEIGHBOR
		// add starting point to tour (zero index)
		nearestX.push(dotX[0]);
		nearestY.push(dotY[0]);
		
		var tempDistance;
		var nearestDistance;
		// index of item in tour that is just greater than thing being tested
		var toPlace;
						
		// go through list points in order
		for(var i = 1; i < dotX.length; i++)
		{
			// reset nearest variable
			nearestDistance = getDistance(dotX[i], dotY[i], nearestX[0], nearestY[0]);
			toPlace = 1;
			// find point on tour closest to this point
			for(var j = 1; j < nearestX.length; j++)
			{
				// find distance
				tempDistance = getDistance(dotX[i], dotY[i], nearestX[j], nearestY[j]);
				// if tempDistance < nearestDistance, 
				if(tempDistance < nearestDistance)
				{
					nearestDistance = tempDistance;
					toPlace = j+1;
				}
			}
			
			// add point to tour
			nearestX.splice(toPlace, 0, dotX[i]);
			nearestY.splice(toPlace, 0, dotY[i]);
		}
		
		//console.log("NearestX " + nearestX);
		//console.log("SIZE " + nearestX.length);
		//console.log("NearestY " + nearestY);
		
		// from the list of points that have already been added to the tour, find the closest neighbor
		// insert new point after closest neighbor
			// if the closest neighbor already points to something, insert new point between the two
		
		
		// PRINT TOUR
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = "#E6E6FA"; //change color of line
		ctx.lineWidth = 3; //change width of line

		for(var i = 0; i < nearestX.length - 1; i++)
		{
			//draw a line between every point
			// starting pt of line
			ctx.moveTo(nearestX[i],nearestY[i]);
			// ending pt of line
			ctx.lineTo(nearestX[i+1],nearestY[i+1]);
			// draw
			ctx.stroke();
		}
		
	});
	
	$("#SmallestIncrease").click( function() {
		// add first two points to smallestInc //?????
		smallestIncX.push(dotX[0]);
		smallestIncX.push(dotX[1]);
		smallestIncY.push(dotY[0]);
		smallestIncY.push(dotY[1]);
		
		// distance btwn all points in smallestInc's
		var distance;
		var index;
		
		// do algorithm
		// Read in the next point, and add it to the current tour after the point where it results in the least possible increase in the tour length. (If there is more than one point, insert it after the first such point you discover.)
		// i = point in dotX / dotY to test
		for(var i = 2; i < dotX.length; i++)
		{
			console.log("SMALLEST INCREASE ALGORITHM");
			//console.log("i " + i);
			//console.log("BEFORE: " + smallestIncX);
			// start placing point being tested at first index of tour
			distance = getTourDistance(smallestIncX.slice(), smallestIncY.slice(), dotX[i], dotY[i], 1);
			//console.log("DISTANCE: " + distance);
			index = 1;
			
			// j = index in smallestIncX / Y to place dotX[i]
			for(var j = 2; j < smallestIncX.length + 1; j++)
			{				
				//console.log("smIncLEN " + smallestIncX.length + " index: " + index + "j: " + j + "tourDistance: " + getTourDistance(smallestIncX.slice(), smallestIncY.slice(), dotX[i], dotY[i], j));
				// j = index used to find which tour length was shortest
				if(getTourDistance(smallestIncX.slice(), smallestIncY.slice(), dotX[i], dotY[i], j) < distance)
				{
					index = j;
					distance = getTourDistance(smallestIncX.slice(), smallestIncY.slice(), dotX[i], dotY[i], j);
				}
			}
			// adds dot_[i] to smallestInc_ at index
			smallestIncX.splice(index, 0, dotX[i]);
			smallestIncY.splice(index, 0, dotY[i]);
			
		}
		/*
		console.log("dotX: " + dotX);
		console.log("SmallestIncX " + smallestIncX.length);
		console.log("dotY: " + dotY);
		console.log("SmallestIncY " + smallestIncY);
		console.log("SIZE " + smallestIncX.length);
		*/
		
		// print tour on new canvas // CHANGE BACK TO CTX1 TODO
		// PRINT TOUR
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = "#000"; //change color of line
		ctx.lineWidth = 3; //change width of line
		for(var i = 0; i < smallestIncX.length - 1; i++)
		{
			//draw a line between every point
			// starting pt of line
			ctx.moveTo(smallestIncX[i],smallestIncY[i]);
			// ending pt of line
			ctx.lineTo(smallestIncX[i+1],smallestIncY[i+1]);
			// draw
			ctx.stroke();
		}
	})
})
	function getDistance(x1, y1, x2, y2)
	{
		return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	}
	
	
	/**
	* x1, y1 are the x and y coordinates (their values)
	* index is index to place x and y coords
	*/
	function getTourDistance(tourX, tourY, x1, y1, index)
	{
		var totalDistance = 0;
		
		tourX.splice(index, 0, x1);
		tourY.splice(index, 0, y1);
		
		for(var i = 0; i < tourX.length - 1; i++)
		{
			totalDistance = totalDistance + getDistance(tourX[i], tourY[i], tourX[i+1], tourY[i+1]);
		}
		
		//console.log("GTD: " + totalDistance);
		return totalDistance;
	}
;