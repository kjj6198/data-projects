import Star from './Star';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function drawStars(num, x, y, radius) {
  const stars = []
  for (var i = 0; i < num; i++) {
    const star = new Star(ctx,
      x,
      y,
      {
        innerRadius: 3,
        outerRadius: 10,
      }
    );
    stars.push(star);
    star.draw();
  }

  return stars;
}

class CircleRipple {
  constructor(x, y, w, h, options) {
    this.x = x;
    this.y = y;
    this.radius = Math.sqrt((w ** 2) + (h ** 2));
    this.speed = options.speed || this.DEFAULT_SPEED;
    this.color = options.color;
    this.onComplete = options.onComplete || function() {};

    this.startRadius = 0;
    this.done = false;
    this.reversed = false;
  }

  get DEFAULT_SPEED() { // eslint-disable-line
    return 40;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.startRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  reset() {
    ctx.globalCompositeOperation = 'source-over';
    this.done = false;
    this.startRadius = 0;
    this.reversed = false;
  }

  update() {
    ctx.fillStyle = this.color;
    this.startRadius += this.speed;

    if (this.startRadius <= this.radius) {
      this.draw();
    } else if (!this.reversed && !this.done) {
      this.reversed = true;
      ctx.globalCompositeOperation = 'destination-out';
      this.startRadius = 0;
    } else {
      this.done = true;
      ctx.globalCompositeOperation = 'source-over';
      this.onComplete(this);
    }
  }
}

window.addEventListener('resize', e => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let animating = false;
canvas.addEventListener('click', e => {
  const x = e.clientX;
  const y = e.clientY;

  const stars = drawStars(20, x, y, 5);
  const circleRipple = new CircleRipple(x, y, ctx.canvas.width, canvas.height, {
    speed: 65,
    color: '#fe6565',
    onComplete: () => (animating = false), // eslint-disable-line
  });

  function update() {
    circleRipple.update();
    stars.forEach(star => star.update());
    if (!circleRipple.done) {
      requestAnimationFrame(update);
    }
  }

  if (!animating) {
    animating = true;
    const request = requestAnimationFrame(update);

    if (circleRipple.done) {
      cancelAnimationFrame(request);
      circleRipple.done = false;
    }
  }
});
