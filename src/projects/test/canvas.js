const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class CircleRipple {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.radius = Math.sqrt((w ** 2) + (h ** 2));
    this.startRadius = 0;
    this.done = false;
    this.reversed = false;
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
    ctx.fillStyle = '#fe0000';
    this.startRadius += 60;

    if (this.startRadius <= this.radius) {
      this.draw();
    } else if (!this.reversed && !this.done) {
      this.reversed = true;
      ctx.globalCompositeOperation = 'destination-out';
      this.startRadius = 0;
    } else {
      this.done = true;
      ctx.globalCompositeOperation = 'source-over';
      // this.reset();
    }
  }
}

canvas.addEventListener('click', e => {
  const x = e.clientX;
  const y = e.clientY;
  const circleRipple = new CircleRipple(x, y, ctx.canvas.width, canvas.height);

  function update() {
    circleRipple.update();
    if (!circleRipple.done) {
      requestAnimationFrame(update);
    }
  }

  const request = requestAnimationFrame(update);

  if (circleRipple.done) {
    cancelAnimationFrame(request);
    circleRipple.done = false;
  }
});
