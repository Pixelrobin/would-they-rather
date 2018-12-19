import React from 'react';

const shapes = [, 1, 2, 3, 4, 5].map(sides => {
	const angle = Math.PI * 2 / sides;
	const shape = [];
	
	for (let s = 1; s <= sides; s ++) {
		shape.push({
			x: Math.cos(s * angle),
			y: Math.sin(s * angle)
		});
	}
	
	return shape;
});

export default class Confetti extends React.Component {
	constructor(props) {
		super(props);
		this.canvas = React.createRef();
		this.particles = [];
		this.lastFrame = 0;
	}

	onAnimationFrame(frame) {
		const canvas = this.canvas.current;
		const ctx = canvas.getContext('2d');
		const { width, height } = canvas;
		const delta = frame - this.lastFrame;

		const size = 16;

		this.lastFrame = frame;
		ctx.fillStyle = '#FFE7A6';
		ctx.clearRect(0, 0, width, height);
  
		for (let p of this.particles) {
			if (p.time > 0) {
				ctx.translate(p.x, p.y);
				ctx.scale(p.scale, p.scale);
				ctx.rotate(p.angle);
				
				const shape = shapes[p.sides];
				ctx.beginPath();
				
				ctx.moveTo(size, 0);
				shape.forEach(point => { ctx.lineTo(point.x * size, point.y * size) });
				
				ctx.fill();
				ctx.setTransform(1,0,0,1,0,0);
				
				p.time -= delta;
				p.x += p.speedX;
				p.y += p.speedY;
				p.gravity += 0.002 * p.gravityScale;
				p.speedX += 0 - p.speedX * p.friction;
				p.speedY += p.gravity - p.speedY * p.friction;
				p.angle += p.angleSpeed;
				p.angleSpeed += -p.angleSpeed * 0.05;
				
				const foo = 1 - p.time / p.life;
				const bar = -(foo * foo * foo * foo) + 1;
				p.scale = bar;
			}
		}

		requestAnimationFrame(this.onAnimationFrame.bind(this));
	}

	burst(bounds) {
		const { padding } = this.props;
		//const bounds = elementRef.current.getBoundingClientRect();

		const subWidth = bounds.width;
		const subHeight = bounds.height - padding * 2;
		const subRatio = (1 / subWidth) / (1 / subHeight);// * 0.5;

		console.log(subRatio);

		const randomOnEdge = () => {
			let wh = Math.random();
			let x;
			let y;

			if (wh > subRatio) {
				x = Math.random() * padding;
				y = Math.random() * subHeight + padding;

				if (Math.random() >= 0.5) x = bounds.width - x;
			} else {
				x = Math.random() * subWidth;
				y = Math.random() * padding;

				if (Math.random() >= 0.5) y = bounds.height - y;
			}

			x += bounds.left;
			y += bounds.top;

			return { x, y }
		}

		const normalized = (x, y) => {
			const d = Math.sqrt(x * x + y * y);

			if (d > 0) {
				x /= d;
				y /= d;
			}

			return { x, y };
		}

		for (let p = 0; p < 100; p ++) {
			let life = Math.random() * 2000;

			const { x, y } = randomOnEdge(bounds.width, bounds.height, 200);

			const center_x = bounds.left + bounds.width / 2;
			const center_y = bounds.top + bounds.height / 2;

			const spd = normalized(x - center_x, y - center_y);
			
			this.particles[p] = {
				time: life,
				life,
				x: x,
				y: y,
				speedX: spd.x * 25,
				speedY: spd.y * 25,
				scale: 1,
				gravityScale: Math.random(),
				gravity: 0,
				angle: Math.random() * Math.PI * 2,
				angleSpeed: Math.random() * 0.5,
				friction: Math.random() * 0.1 + 0.05,
				sides: Math.floor(Math.random() * 2) + 3
			}
		}
	}
	
	componentDidMount() {
		const canvas = this.canvas.current;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		this.lastFrame = performance.now();

		requestAnimationFrame(this.onAnimationFrame.bind(this));
	}

	render() {
		return <canvas className="confetti-canvas" ref={ this.canvas } width="100" height="100"></canvas>
	}
}