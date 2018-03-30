

function calSimpleMovingAverage(data,num_points){
  //outputmsg("calSimpleMovingAverage"+data.length+","+num_points);
  
  //outputmsg("calSimpleMovingAverage:"+data[0].y);
  //outputmsg(data[1]+","+num_points);
  var moveMean = [];
  var xx=0;
  for (var i = data.length-1; i > num_points; i--)
  {
	  var mean = 0.0;
	  for (var j = 0; j < num_points; j++){
        mean += data[i-j].y;
	  }
	  mean /= num_points;
	  var d = {x:data[i].x,y:mean};
      moveMean.push(d);
  }
  //moveMean = moveMean.reverse();
  return moveMean;
}