Examples = {
	fountain: {
		positionStyle: Type.CUBE, //位置类型
		positionBase: new THREE.Vector3(0, 0, 0), //位置基础
		positionSpread: new THREE.Vector3(10, 0, 10), //位置随机幅度

		velocityStyle: Type.CUBE, //速度类型
		velocityBase: new THREE.Vector3(0, 160, 0), //速度基础
		velocitySpread: new THREE.Vector3(100, 20, 100), //速度随机幅度

		accelerationBase: new THREE.Vector3(0, -100, 0), //加速度基础

		particleTexture: THREE.ImageUtils.loadTexture("images/star.png"), //粒子纹理

		angleBase: 0, //角度基础
		angleSpread: 180, //角度扩散
		angleVelocityBase: 0, //角速度基础
		angleVelocitySpread: 360 * 4, //角速度扩散

		sizeTween: new Tween([0, 1], [1, 20]), //粒子大小
		opacityTween: new Tween([2, 3], [1, 0]), //粒子透明度
		colorTween: new Tween([0.5, 2], [new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(0.8, 1, 0.5)]), //粒子颜色

		particlesPerSecond: 200, //每秒粒子数
		particleDeathAge: 3.0, //粒子死亡时间
		emitterDeathAge: 60, //发射器死亡时间
	},

	snow: {
		positionStyle: Type.CUBE,
		positionBase: new THREE.Vector3(0, 200, 0),
		positionSpread: new THREE.Vector3(500, 0, 500),

		velocityStyle: Type.CUBE,
		velocityBase: new THREE.Vector3(0, -60, 0),
		velocitySpread: new THREE.Vector3(50, 20, 50),
		accelerationBase: new THREE.Vector3(0, -10, 0),

		angleBase: 0,
		angleSpread: 720,
		angleVelocityBase: 20,
		angleVelocitySpread: 60,

		particleTexture: THREE.ImageUtils.loadTexture("images/snowflake.png"),

		sizeTween: new Tween([0, 0.4], [1, 24]),
		colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
		opacityTween: new Tween([2, 3], [0.8, 0]),

		particlesPerSecond: 100,
		particleDeathAge: 4.0,
		emitterDeathAge: 60,
	},

	rain: {
		positionStyle: Type.CUBE,
		positionBase: new THREE.Vector3(0, 200, 0),
		positionSpread: new THREE.Vector3(600, 0, 600),

		velocityStyle: Type.CUBE,
		velocityBase: new THREE.Vector3(0, -400, 0),
		velocitySpread: new THREE.Vector3(10, 50, 10),
		accelerationBase: new THREE.Vector3(0, -10, 0),

		particleTexture: THREE.ImageUtils.loadTexture("images/raindrop2flip.png"),

		sizeBase: 8.0,
		sizeSpread: 4.0,
		colorBase: new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
		colorSpread: new THREE.Vector3(0.0, 0.0, 0.2),
		opacityBase: 0.6,

		particlesPerSecond: 1000,
		particleDeathAge: 1.0,
		emitterDeathAge: 60,
	},

	fireflies: {
		positionStyle: Type.CUBE,
		positionBase: new THREE.Vector3(0, 100, 0),
		positionSpread: new THREE.Vector3(400, 200, 400),

		velocityStyle: Type.CUBE,
		velocityBase: new THREE.Vector3(0, 0, 0),
		velocitySpread: new THREE.Vector3(60, 20, 60),

		particleTexture: THREE.ImageUtils.loadTexture("images/spark.png"),

		sizeBase: 30.0,
		sizeSpread: 2.0,
		opacityTween: new Tween(
			[0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
			[0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2]
		),
		colorBase: new THREE.Vector3(0.3, 1.0, 0.6), // H,S,L
		colorSpread: new THREE.Vector3(0.3, 0.0, 0.0),

		particlesPerSecond: 20,
		particleDeathAge: 6.1,
		emitterDeathAge: 600,
	},

	firework: {
		positionStyle: Type.SPHERE,
		positionBase: new THREE.Vector3(0, 100, 0),
		positionRadius: 20,

		velocityStyle: Type.SPHERE,
		speedBase: 90,
		speedSpread: 10,

		accelerationBase: new THREE.Vector3(0, -80, 0),

		particleTexture: THREE.ImageUtils.loadTexture("images/spark.png"),

		sizeTween: new Tween([0.5, 0.7, 1.3], [5, 40, 1]),
		opacityTween: new Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
		colorTween: new Tween(
			[0.5, 0.7, 1.3],
			[new THREE.Vector3(0, 1, 1), new THREE.Vector3(0, 1, 0.6), new THREE.Vector3(0.8, 1, 0.6)]
		),

		particlesPerSecond: 3000,
		particleDeathAge: 2.5,
		emitterDeathAge: 0.2,
	},

	candle: {
		positionStyle: Type.SPHERE,
		positionBase: new THREE.Vector3(0, 50, 0),
		positionRadius: 2,

		velocityStyle: Type.CUBE,
		velocityBase: new THREE.Vector3(0, 100, 0),
		velocitySpread: new THREE.Vector3(20, 0, 20),

		particleTexture: THREE.ImageUtils.loadTexture("images/smokeparticle.png"),

		sizeTween: new Tween([0, 0.3, 1.2], [20, 150, 1]),
		opacityTween: new Tween([0.9, 1.5], [1, 0]),
		colorTween: new Tween([0.5, 1.0], [new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0)]),
		blendStyle: THREE.AdditiveBlending,

		particlesPerSecond: 60,
		particleDeathAge: 1.5,
		emitterDeathAge: 60,
	},
};
