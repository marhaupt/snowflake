const last = (array, back = 1) => array[array.length - back];
const random = (min, max) => min + Math.random() * (max - min);

class Snowflake {
  constructor() {
    this.canvas = document.getElementById('snowflake');
    this.ctx = this.canvas.getContext('2d');

    this.size = Math.floor(
      Math.min(window.innerWidth, window.innerHeight) * 0.6
    );
    this.radius = Math.floor((this.size * 1) / 100);

    this.canvas.height = this.size;
    this.canvas.width = this.size;

    this.ctx.translate(this.size / 2, this.size / 2);
    // this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.globalAlpha = 0.2;
    this.ctx.fillStyle = '#fff';

    // this.colors = document.getElementById('colors').checked;
    this.colors = false;

    const x = 15;
    const y = 5;
    const hue = random(0, 360);
    this.fragments = [{ x, y, hue }];

    this.drawBound = this.draw.bind(this);
    requestAnimationFrame(this.drawBound);
  }

  drawOne(fragment) {
    if (this.colors) this.ctx.fillStyle = `hsl(${fragment.hue},90%, 75%)`;
    this.ctx.beginPath();
    this.ctx.arc(fragment.x, fragment.y, this.radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  draw() {
    // this.ctx.clearRect(-this.size / 2, -this.size / 2, this.size, this.size);

    const lastOne = last(this.fragments);
    this.drawOne(lastOne);

    const mirror = {
      x: lastOne.x,
      y: -lastOne.y
    };
    this.drawOne(mirror);

    const step = 360 / 6;

    for (let deg = step; deg < 360; deg += step) {
      const rotation = (deg * Math.PI) / 180;
      this.ctx.rotate(rotation);
      this.drawOne(lastOne);
      this.drawOne(mirror);
      this.ctx.rotate(-rotation);
    }

    const complexity = 30;
    const modifier =
      Math.floor(
        random(1, Math.min(Math.floor(this.fragments.length / 2), complexity))
      ) || 1;

    // if you go back a lot, the turn can be bigger
    // const bounds = 120 + (40 * modifier) / complexity;
    const bounds = 100 + modifier * 0.8;

    const direction = (random(-bounds, bounds) * Math.PI) / 180;
    const distance = this.radius * 2;

    const x = last(this.fragments, modifier).x + Math.cos(direction) * distance;
    const y = last(this.fragments, modifier).y - Math.sin(direction) * distance;
    const hue = (lastOne.hue + random(10, 150)) % 360;

    this.fragments.push({
      x,
      y,
      hue
    });

    if (x ** 2 + y ** 2 < (this.size / 2 - this.radius) ** 2) {
      requestAnimationFrame(this.drawBound);
    }
  }
}

// eslint-disable-next-line no-new
new Snowflake();
