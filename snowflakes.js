const last = (array, back = 1) => array[array.length - back];
const random = (min, max) => min + Math.random() * (max - min);

class Snowflake {
  constructor() {
    this.canvas = document.getElementById('snowflake');
    this.ctx = this.canvas.getContext('2d');

    this.drawBound = this.draw.bind(this);

    // document.addEventListener('click', () => {
    //   this.setup();
    // });
    this.setup();
  }

  setup() {
    this.size = Math.floor(
      Math.min(window.innerWidth, window.innerHeight) * 0.85
    );
    this.radius = Math.floor((this.size * 1) / 100);

    this.canvas.height = this.size;
    this.canvas.width = this.size;

    this.colors = false;

    // this.ctx.clearRect(-this.size / 2, -this.size / 2, this.size, this.size);
    this.ctx.translate(this.size / 2, this.size / 2);
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.globalAlpha = 0.2;
    this.ctx.fillStyle = '#fff';

    const x = random(1, 5);
    const y = random(1, 5);
    const hue = random(0, 360);

    this.fragments = [
      {
        x,
        y,
        hue
      }
    ];

    requestAnimationFrame(this.drawBound);
  }

  drawOne(fragment) {
    if (this.colors) this.ctx.fillStyle = `hsl(${fragment.hue},95%, 55%)`;
    this.ctx.beginPath();
    this.ctx.arc(fragment.x, fragment.y, this.radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  generateNext() {
    const complexity = 30;
    const modifier =
      Math.floor(
        random(1, Math.min(Math.floor(this.fragments.length / 2), complexity))
      ) || 1;

    const aboutLast = last(this.fragments, modifier);

    // const bounds = 120 + (40 * modifier) / complexity;
    // const bounds = 100 + modifier * 0.8;
    // const bounds = 90 + modifier * 0.2 + (aboutLast.x > this.size / 4 && 30);
    const bounds = 90 + (aboutLast.x / (this.size / 4)) ** 2 * 30;

    const direction = (random(-bounds, bounds) * Math.PI) / 180;
    const distance = this.radius * 2;

    const x = aboutLast.x + Math.cos(direction) * distance;
    const y = aboutLast.y - Math.sin(direction) * distance;
    const hue = (aboutLast.hue + random(10, 150)) % 360;

    return { x, y, hue };
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

    const next = this.generateNext();

    this.fragments.push(next);

    if (next.x ** 2 + next.y ** 2 < (this.size / 2 - this.radius) ** 2) {
      requestAnimationFrame(this.drawBound);
    }
  }
}

// eslint-disable-next-line no-new
new Snowflake();
