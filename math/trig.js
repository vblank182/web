// TODO:
// - Add option to draw a point tracing a static sine curve instead of moving curve
// - Add slider for tickmark granularity
// - Add slider for parameter rate
// - Add text for angle markings
// - Add an interactive mode

function preload() {
}

function setup() {
  let cnv = createCanvas(800, 400);
  cnv.parent('sinevis');

  // Time
  t=0;

  // Drawing rectangle
  r_x = 50;
  r_y = 50;
  r_w = 300;
  r_h = 300;

  // Circle parameters
  c_x = 600;
  c_y = 200;
  c_d = 300;

  c_granularity = 16;  // how many markings should be shown (0, 4, 8, 16)
  c_angles_d = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

}

function draw() {
  t++;
  rate = 0.02*t;
  background(240);  // clears drawing area every frame

  //// LEFT SIDE ////
  xoffset = 50;

  noFill();
  stroke(75);
  strokeWeight(1);
  //rect(r_x, r_y, r_w, r_h);

  line(r_x, r_y+r_h/2, r_x+r_w, r_y+r_h/2);        // x-axis
  //line(r_x+xoffset, r_y, r_x+xoffset, r_y+r_h);  // y-axis

  // Draw sine wave
  numpoints = r_w*3;
  for (var n=0; n<numpoints; n++) {
    y = -sin(0.007*n + rate);  // function to draw
    strokeWeight(2.5);

    stroke(220*(1-n/numpoints));  // fade out

    point(n/3+r_x, r_h/2*y + r_y+r_h/2, 1);
  }
  // Sine wave pointer
  strokeWeight(1);
  stroke('#89a');
  fill('#adf');
  wave_ptr_x = r_x+r_w;
  wave_ptr_y = r_h/2*y + r_y+r_h/2;  // uses last calculated y-value from loop
  wave_ptr_diam = 16;
  circle(wave_ptr_x, wave_ptr_y, wave_ptr_diam);

  // Tick marks
  angle = c_angles_d[16/c_granularity * i];
  wave_tick_radius = 6;
  for (var i=0; i < c_granularity; i++) {
    //line(wave_ptr_x - t, r_y+r_h/2 + wave_tick_radius, wave_ptr_x - t, r_y+r_h/2 - wave_tick_radius);
  }


  //// RIGHT SIDE ////
  // Circle
  noFill();
  stroke(0);
  strokeWeight(2.5);
  circle(c_x, c_y, c_d);

  // Angle markings
  textSize(16);
  strokeWeight(1.5);
  fill(0);

  tick_len = 8;
  label_spc = 26;  // spacing of label from circle

  for (var i=0; i < c_granularity; i++) {

    // Divide 2pi into c_granularity intervals
    angle = c_angles_d[16/c_granularity * i];
    tick_pos = (PI/180)*angle;

    // Determine center of tick mark on radius of circle, then offset by a step along normal vector of circle
    tick_x_in = c_d/2*cos(tick_pos) + c_x - tick_len*cos(tick_pos);
    tick_y_in = -c_d/2*sin(tick_pos) + c_y + tick_len*sin(tick_pos);
    tick_x_out = c_d/2*cos(tick_pos) + c_x + tick_len*cos(tick_pos);
    tick_y_out = -c_d/2*sin(tick_pos) + c_y - tick_len*sin(tick_pos);

    line(tick_x_in, tick_y_in, tick_x_out, tick_y_out);

    text(angle+"°", c_d/2*cos(tick_pos) + c_x - 11 + label_spc*cos(tick_pos), -c_d/2*sin(tick_pos) + c_y + 7 - label_spc*sin(tick_pos));
  }


  circle_ptr_x = c_d/2*cos(rate) + c_x;
  circle_ptr_y = -c_d/2*sin(rate) + c_y;
  circle_ptr_diam = 16;


  // Triangle
  strokeWeight(1.5);
  stroke(0);
  noFill();
  line(c_x, c_y, circle_ptr_x, circle_ptr_y);  // hypotenuse
  line(c_x, c_y, circle_ptr_x, c_y);  // adjacent (horizontal)
  line(circle_ptr_x, c_y, circle_ptr_x, circle_ptr_y);  // opposite (vertical)

  strokeWeight(1);
  stroke(75);
  rect(circle_ptr_x, c_y, -10*(circle_ptr_x-c_x)/abs(circle_ptr_x-c_x), 10*(circle_ptr_y-c_y)/abs(circle_ptr_y-c_y)); // square angle notation


  // Pointer
  strokeWeight(1);
  stroke('#89a');
  fill('#adf');
  circle(circle_ptr_x, circle_ptr_y, circle_ptr_diam);


  //// INTERACTIONS ////
  // Dotted line connecting points
  strokeWeight(2);
  stroke('#489958');
  numdots = ceil(abs((wave_ptr_x+wave_ptr_diam/2) - (circle_ptr_x-circle_ptr_diam/2))/6);
  for (var i=0; i<numdots; i++) {
    lerped_x = lerp(wave_ptr_x+wave_ptr_diam/2, circle_ptr_x-circle_ptr_diam/2, i/numdots);
    point(lerped_x+2, wave_ptr_y);
  }
  //line(wave_ptr_x, wave_ptr_y, circle_ptr_x, circle_ptr_y);

}
