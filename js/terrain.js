// Daniel Shiffman
// http://codingtra.in
// https://youtu.be/IKB1hWWedMk
// https://thecodingtrain.com/CodingChallenges/011-perlinnoiseterrain.html

// Edited by SacrificeProductions
// Edited by leimapapa https://codepen.io/leimapapa/full/oNjQLBP

//global vars
var rgb1,rgb2,rgb3;
var r,g,b,a;

//random number generator
function randNum(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

//random color generator
function randColor(){
  var rrr = randNum(0,255);
  var ggg = randNum(0,255);
  var bbb = randNum(0,255);

  go(rrr,ggg,bbb);
}

//correct for numbers over 255 and under 0
function corrected(x){
  var val = (x*1);
  if(val > 255){
    return 255;
  } else if (val < 0){
    return 0;
  } else {
    return Math.round(val);
  }
}

//complimentary colors
function complimentary(x){
  return 255 - Math.abs((x - 127.5));
}

function go(r1,g1,b1){

	//random color is the background

	//get the complimentary colors
  var rr = Math.round(complimentary(r1));
  var gg = Math.round(complimentary(g1));
  var bb = Math.round(complimentary(b1));

	//complimentary color is the terrain color

	a =

	rgb1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

	rgb2 = "rgb(" + rr + "," + gg + "," + bb + ")";

	rgb3 = "rgb(" + corrected(rr - 100) + "," + corrected(gg - 100) + "," + corrected(bb - 100) + ")";


	terrainValues.bgColor = rgba(0,0,0, 0); //rgb1;
	terrainValues.terrainColor[0] = rr;
	terrainValues.terrainColor[1] = gg;
	terrainValues.terrainColor[2] = bb;
	terrainValues.terrainColor = rgb2;
	terrainValues.lineColor = rgb3;
	terrainValues.terrainOpacity = randNum(0,10) * 0.1;
}

var terrainValues = {
  speed: 0.1,
  rotation: 70,
  mountainHeight: 100,
  rotation: 70,
  bgColor: [ 0, 0, 0 ],
  lineColor: [ 100,100,100 ],
  lineWidth: 1,
  terrainColor: [ 200,200,200 ],
  terrainOpacity: 0.5,
	randomizeColors: function() { randColor() }
}

var cols, rows;
var scl = 20;

var w = window.innerWidth;
var h = window.innerHeight;
var cnvs;

var flying = 0;

//2D array where we'll store x and y values for each point on the triangle strip
var terrain = [];

window.onload = function() {

//   console.log(terrainValues);
  // var gui = new dat.GUI();
  // gui.add(terrainValues,'speed', -0.3, 0.3);
	// gui.add(terrainValues,'rotation', 0, 90);
	// gui.add(terrainValues,'mountainHeight', 0, 200);
	// gui.add(terrainValues,'lineWidth', 0, 5);
	// gui.add(terrainValues,'terrainOpacity', 0, 1);

	// var col = gui.addFolder('Colors');
	// col.add(terrainValues, 'randomizeColors');
	// col.addColor(terrainValues, 'bgColor');
	// col.addColor(terrainValues,'lineColor');
	// col.addColor(terrainValues, 'terrainColor');

};

function updateSpeed() {
    terrainValues.speed += 0.1;
}

function setup() {
  cnvs = createCanvas(w, h, WEBGL);
  cols = 2*w / scl;
	rows = 2*h / scl;

	//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}


r = terrainValues.terrainColor[0];
	g = terrainValues.terrainColor[1];
	b = terrainValues.terrainColor[2];
	a = terrainValues.terrainOpacity;


function draw() {
  flying -= terrainValues.speed;
  var yoff = flying;

	/*
			Set vertices at the x and y positions
			along the triangle strip going up and down
			along the path of the triangle strip

			In this pattern:
			 .  .  .
			/ \/ \/ \
		 .   .  .  .

	*/

  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -terrainValues.mountainHeight, terrainValues.mountainHeight);
      xoff += 0.1;
    }
    yoff += 0.1;
  }


  //set color stuff
	background(terrainValues.bgColor);
	stroke(terrainValues.lineColor);
	strokeWeight(terrainValues.lineWidth);
	//noFill();

  angleMode(DEGREES);
  rotateX(terrainValues.rotation);


  translate(-w, -h);

	fill(terrainValues.terrainColor[0] * 1, terrainValues.terrainColor[1] * 1, terrainValues.terrainColor[2] * 1, (terrainValues.terrainOpacity * 255));

  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
}

function windowResized(){
	cnvs = createCanvas(w, h, WEBGL);
}