const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class CircleRipple {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.radius = Math.sqrt((w ** 2) + (h ** 2));
    this.startRadius = 0;
    this.done = false;
  }

  update() {
    ctx.fillStyle = '#fe0000';
    this.startRadius += 35;
    // debugger;
    if (this.startRadius <= this.radius) {
      ctx.arc(this.x, this.y, this.startRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      this.startRadius = 0;
      this.done = true;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }
}

canvas.addEventListener('click', e => {
  const x = e.clientX;
  const y = e.clientY;
  const circleRipple = new CircleRipple(x, y, ctx.canvas.width, canvas.height);

  function update() {
    circleRipple.update();
    requestAnimationFrame(update);
  }

  update();
});
