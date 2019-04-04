// https://p5js.org/examples/math-sine-wave.html
// https://p5js.org/reference/#group-Math

let xspacing = 12; // Distance between each horizontal location
let t_start = 0.0; // 'Initial' parameter value. All points will be offset from this value.
let dt = 0.06; // Value for incrementing x
let xvalues; // Using an array to store x values for the wave
let yvalues; // Using an array to store y values for the wave
let scale;
let num_points;
let centerx;
let centery;
let center = true;

// TODO:
// - Add animated ellipse sizes
// - Add animated colors

function setup() {
  createCanvas(1600, 900);
  scale = 350;
  centerx = floor(width/2);
  centery = floor(height/2);

  //num_points = floor(TWO_PI * 16);
  num_points = 500;

  xvalues = new Array(num_points);
  yvalues = new Array(num_points);
}

function draw() {
  background('#11B4D8');
  calcWave();
  renderWave();
}

function calcWave() {
  // Increment t_start (try different values for 'angular velocity' here)
  t_start += 0.01;

  // For every t value, calculate an (x, y) point
  let t = t_start;
  for (let i = 0; i < num_points; i++) {
    xvalues[i] = scale*cos(7*t);
    yvalues[i] = scale*sin(2*t);

    if (center) {
        xvalues[i] += centerx;
        yvalues[i] += centery;
    }

    t += dt;  // increment t for next point
  }
}

function renderWave() {
  let ellipse_size = 16;
  noStroke();
  fill('#FFF');  // Fill color for ellipses

  // A simple way to draw the wave with an ellipse at each location
  for (let i = 0; i < num_points; i++) {
    ellipse(xvalues[i], yvalues[i], ellipse_size);
  }
}
