particleVertexShader = [
	"attribute vec3  customColor;", //含义是每个顶点的颜色
	"attribute float customOpacity;", //含义是每个顶点的透明度
	"attribute float customSize;", //含义是每个顶点的大小
	"attribute float customAngle;", //含义是每个顶点的角度
	"attribute float customVisible;", //含义是每个顶点是否可见
	"varying vec4  vColor;", //含义是每个顶点的颜色
	"varying float vAngle;", //含义是每个顶点的角度
	"void main()", //主函数
	"{",
	"if ( customVisible > 0.5 )", //如果可见
	"vColor = vec4( customColor, customOpacity );", //颜色为顶点颜色和透明度
	"else", //否则
	"vColor = vec4(0.0, 0.0, 0.0, 0.0);", //颜色为黑色

	"vAngle = customAngle;", //角度为顶点角度

	"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", //模型视图矩阵乘以顶点坐标
	"gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );", //点大小为顶点大小乘以300除以模型视图矩阵乘以顶点坐标的长度
	"gl_Position = projectionMatrix * mvPosition;", //投影矩阵乘以模型视图矩阵乘以顶点坐标
	"}",
].join("\n");

particleFragmentShader = [
	"uniform sampler2D texture;", //纹理
	"varying vec4 vColor;", //含义是每个顶点的颜色
	"varying float vAngle;", //含义是每个顶点的角度
	"void main()", //主函数
	"{",
	"gl_FragColor = vColor;", //颜色为顶点颜色

	"float c = cos(vAngle);", //角度的余弦值
	"float s = sin(vAngle);", //角度的正弦值
	"vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,", //旋转后的纹理坐标
	"c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);", //旋转后的纹理坐标
	"vec4 rotatedTexture = texture2D( texture,  rotatedUV );", //旋转后的纹理
	"gl_FragColor = gl_FragColor * rotatedTexture;", //颜色为颜色乘以旋转后的纹理
	"}",
].join("\n");

function Tween(timeArray, valueArray) {
	this.times = timeArray || []; //时间数组
	this.values = valueArray || []; //值数组
}

Tween.prototype.lerp = function (t) {
	var i = 0;
	var n = this.times.length; //时间数组长度

	while (i < n && t > this.times[i]) i++; //找到时间数组中第一个大于t的值

	if (i == 0) return this.values[0]; //如果i为0，返回值数组中第一个值
	if (i == n) return this.values[n - 1]; //如果i为n，返回值数组中最后一个值

	var p = (t - this.times[i - 1]) / (this.times[i] - this.times[i - 1]); //t在这两个时间点之间的插值比例p

	if (this.values[0] instanceof THREE.Vector3) return this.values[i - 1].clone().lerp(this.values[i], p);
	//如果值数组中第一个值是三维向量，返回值数组中第i-1个值和第i个值的插值
	else return this.values[i - 1] + p * (this.values[i] - this.values[i - 1]); //否则返回值数组中第i-1个值和第i个值的插值
};

function Particle() {
	this.position = new THREE.Vector3(); //位置
	this.velocity = new THREE.Vector3(); //速度
	this.acceleration = new THREE.Vector3(); //加速度

	this.angle = 0;
	this.angleVelocity = 0; //角速度
	this.angleAcceleration = 0; //角加速度

	this.size = 16.0; //大小
	this.color = new THREE.Color(); //颜色
	this.opacity = 1.0; //透明度

	this.age = 0; //粒子的寿命
	this.alive = 0; //粒子是否存活
}

Particle.prototype.update = function (dt) {
	this.position.add(this.velocity.clone().multiplyScalar(dt)); //位置加上速度乘以时间
	this.velocity.add(this.acceleration.clone().multiplyScalar(dt)); //速度加上加速度乘以时间

	this.angle += this.angleVelocity * 0.01745329251 * dt; //角度加上角速度乘以时间
	this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt; //角速度加上角加速度乘以时间

	this.age += dt; //寿命加上时间

	if (this.sizeTween.times.length > 0) this.size = this.sizeTween.lerp(this.age); //大小为缓动函数的插值

	if (this.colorTween.times.length > 0) {
		//如果颜色缓动函数的时间数组长度大于0
		var colorHSL = this.colorTween.lerp(this.age); //颜色为缓动函数的插值
		this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z); //设置颜色
	}

	if (this.opacityTween.times.length > 0) this.opacity = this.opacityTween.lerp(this.age); //透明度为缓动函数的插值
};

var Type = Object.freeze({ CUBE: 1, SPHERE: 2 }); //冻结对象

function ParticleEngine() {
	this.positionStyle = Type.CUBE; //位置类型
	this.positionBase = new THREE.Vector3(); //位置基础值
	this.positionSpread = new THREE.Vector3(); //位置扩散值
	this.positionRadius = 0; //位置半径

	this.velocityStyle = Type.CUBE; //速度类型
	this.velocityBase = new THREE.Vector3(); //速度基础值
	this.velocitySpread = new THREE.Vector3(); //速度扩散值
	this.speedBase = 0; //速度基础值
	this.speedSpread = 0; //速度扩散值

	this.accelerationBase = new THREE.Vector3(); //加速度基础值
	this.accelerationSpread = new THREE.Vector3(); //加速度扩散值

	this.angleBase = 0; //角度基础值
	this.angleSpread = 0; //角度扩散值
	this.angleVelocityBase = 0; //角速度基础值
	this.angleVelocitySpread = 0; //角速度扩散值
	this.angleAccelerationBase = 0; //角加速度基础值
	this.angleAccelerationSpread = 0; //角加速度扩散值

	this.sizeBase = 0.0; //大小基础值
	this.sizeSpread = 0.0; //大小扩散值
	this.sizeTween = new Tween(); //大小缓动函数

	this.colorBase = new THREE.Vector3(0.0, 1.0, 0.5); //颜色基础值
	this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0); //颜色扩散值
	this.colorTween = new Tween(); //颜色缓动函数

	this.opacityBase = 1.0; //透明度基础值
	this.opacitySpread = 0.0; //透明度扩散值
	this.opacityTween = new Tween(); //透明度缓动函数

	this.particleArray = []; //粒子数组
	this.particlesPerSecond = 100; //每秒产生的粒子数
	this.particleDeathAge = 1.0; //粒子死亡时间

	this.emitterAge = 0.0; //发射器寿命
	this.emitterAlive = true; //发射器是否存活
	this.emitterDeathAge = 60; //发射器死亡时间
	this.particleCount = this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge); //粒子总数量

	this.particleGeometry = new THREE.Geometry(); //粒子几何体
	this.particleTexture = null; //纹理

	this.particleMaterial = new THREE.ShaderMaterial({
		//粒子材质
		uniforms: {
			texture: { type: "t", value: this.particleTexture }, //纹理
		},
		attributes: {
			customVisible: { type: "f", value: [] }, //是否可见
			customAngle: { type: "f", value: [] }, //角度
			customSize: { type: "f", value: [] }, //大小
			customColor: { type: "c", value: [] }, //颜色
			customOpacity: { type: "f", value: [] }, //透明度
		},
		vertexShader: particleVertexShader, //顶点着色器
		fragmentShader: particleFragmentShader, //片元着色器
		transparent: true, //透明
		blending: THREE.NormalBlending, //混合类型
	});

	this.particleMesh = new THREE.Mesh(); //粒子网格
}

ParticleEngine.prototype.setValues = function (parameters) {
	//设置参数
	if (parameters === undefined) return; //如果参数为空，返回
	for (var key in parameters) this[key] = parameters[key]; //遍历参数，设置参数

	Particle.prototype.sizeTween = this.sizeTween; //粒子的大小缓动函数
	Particle.prototype.colorTween = this.colorTween; //粒子的颜色缓动函数
	Particle.prototype.opacityTween = this.opacityTween; //粒子的透明度缓动函数

	this.particleArray = []; //粒子数组
	this.emitterAge = 0.0; //发射器寿命
	this.emitterAlive = true; //发射器是否存活
	this.particleCount = this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge);

	this.particleGeometry = new THREE.Geometry(); //粒子几何体
	this.particleMaterial = new THREE.ShaderMaterial({
		//粒子材质
		uniforms: {
			//uniform变量
			texture: { type: "t", value: this.particleTexture }, //纹理
		},
		attributes: {
			//attribute变量
			customVisible: { type: "f", value: [] }, //是否可见
			customAngle: { type: "f", value: [] }, //角度
			customSize: { type: "f", value: [] }, //大小
			customColor: { type: "c", value: [] }, //颜色
			customOpacity: { type: "f", value: [] }, //透明度
		},
		vertexShader: particleVertexShader, //	顶点着色器
		fragmentShader: particleFragmentShader, //片元着色器
		transparent: true, //透明
	});
	this.particleMesh = new THREE.ParticleSystem(); //粒子网格
};

ParticleEngine.prototype.randomValue = function (base, spread) {
	//随机值
	return base + spread * (Math.random() - 0.5); //返回随机值
};

ParticleEngine.prototype.randomVector3 = function (base, spread) {
	//随机向量
	var rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5); //随机向量
	return new THREE.Vector3().addVectors(base, new THREE.Vector3().multiplyVectors(spread, rand3)); //返回随机向量
};

ParticleEngine.prototype.createParticle = function () {
	var particle = new Particle(); //粒子

	if (this.positionStyle == Type.CUBE) particle.position = this.randomVector3(this.positionBase, this.positionSpread);
	if (this.positionStyle == Type.SPHERE) {
		var z = 2 * Math.random() - 1; //随机z：-1-1
		var t = 6.2832 * Math.random(); //随机t：0-2π
		var r = Math.sqrt(1 - z * z); //半径：0-1
		var vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z); //球体坐标系
		particle.position = new THREE.Vector3().addVectors(this.positionBase, vec3.multiplyScalar(this.positionRadius)); //位置相加
	}

	if (this.velocityStyle == Type.CUBE) {
		particle.velocity = this.randomVector3(this.velocityBase, this.velocitySpread); //速度
	}
	if (this.velocityStyle == Type.SPHERE) {
		var direction = new THREE.Vector3().subVectors(particle.position, this.positionBase); //计算出粒子位置与发射器位置的向量
		var speed = this.randomValue(this.speedBase, this.speedSpread); //速度
		particle.velocity = direction.normalize().multiplyScalar(speed); //单位化向量，乘以速度
	}

	particle.acceleration = this.randomVector3(this.accelerationBase, this.accelerationSpread); //加速度

	particle.angle = this.randomValue(this.angleBase, this.angleSpread); //角度
	particle.angleVelocity = this.randomValue(this.angleVelocityBase, this.angleVelocitySpread); //角速度
	particle.angleAcceleration = this.randomValue(this.angleAccelerationBase, this.angleAccelerationSpread); //角加速度

	particle.size = this.randomValue(this.sizeBase, this.sizeSpread); //大小

	var color = this.randomVector3(this.colorBase, this.colorSpread); //颜色
	particle.color = new THREE.Color().setHSL(color.x, color.y, color.z); //颜色

	particle.opacity = this.randomValue(this.opacityBase, this.opacitySpread); //透明度

	particle.age = 0; //年龄
	particle.alive = 0; //存活

	return particle; //返回粒子
};

ParticleEngine.prototype.initialize = function () {
	//初始化
	for (var i = 0; i < this.particleCount; i++) {
		//遍历粒子
		this.particleArray[i] = this.createParticle(); //创建粒子
		this.particleGeometry.vertices[i] = this.particleArray[i].position; //粒子位置
		this.particleMaterial.attributes.customVisible.value[i] = this.particleArray[i].alive; //粒子是否可见
		this.particleMaterial.attributes.customColor.value[i] = this.particleArray[i].color; //粒子颜色
		this.particleMaterial.attributes.customOpacity.value[i] = this.particleArray[i].opacity; //粒子透明度
		this.particleMaterial.attributes.customSize.value[i] = this.particleArray[i].size; //粒子大小
		this.particleMaterial.attributes.customAngle.value[i] = this.particleArray[i].angle; //粒子角度
	}

	this.particleMaterial.blending = this.blendStyle; //混合类型
	if (this.blendStyle != THREE.NormalBlending) this.particleMaterial.depthTest = false; //深度测试

	this.particleMesh = new THREE.ParticleSystem(this.particleGeometry, this.particleMaterial); //粒子网格
	this.particleMesh.dynamic = true; //动态
	this.particleMesh.sortParticles = true; //排序
	scene.add(this.particleMesh); //添加到场景
};

ParticleEngine.prototype.update = function (dt) {
	var recycleIndices = []; //回收索引

	for (var i = 0; i < this.particleCount; i++) {
		//遍历粒子
		if (this.particleArray[i].alive) {
			//粒子存活
			this.particleArray[i].update(dt); //更新粒子

			if (this.particleArray[i].age > this.particleDeathAge) {
				//粒子年龄大于死亡年龄
				this.particleArray[i].alive = 0.0; //粒子死亡
				recycleIndices.push(i); //添加到回收索引
			}
			this.particleMaterial.attributes.customVisible.value[i] = this.particleArray[i].alive; //粒子是否可见
			this.particleMaterial.attributes.customColor.value[i] = this.particleArray[i].color; //粒子颜色
			this.particleMaterial.attributes.customOpacity.value[i] = this.particleArray[i].opacity; //粒子透明度
			this.particleMaterial.attributes.customSize.value[i] = this.particleArray[i].size; //粒子大小
			this.particleMaterial.attributes.customAngle.value[i] = this.particleArray[i].angle; //粒子角度
		}
	}

	if (!this.emitterAlive) return; //发射器死亡

	if (this.emitterAge < this.particleDeathAge) {
		//发射器年龄小于粒子死亡年龄,还能继续发送粒子
		var startIndex = Math.round(this.particlesPerSecond * (this.emitterAge + 0)); //开始索引
		var endIndex = Math.round(this.particlesPerSecond * (this.emitterAge + dt)); //结束索引
		if (endIndex > this.particleCount) endIndex = this.particleCount; //结束索引

		for (var i = startIndex; i < endIndex; i++) this.particleArray[i].alive = 1.0; //粒子存活
	}

	for (var j = 0; j < recycleIndices.length; j++) {
		//遍历回收索引
		var i = recycleIndices[j]; //索引
		this.particleArray[i] = this.createParticle(); //创建粒子
		this.particleArray[i].alive = 1.0; //粒子存活
		this.particleGeometry.vertices[i] = this.particleArray[i].position; //粒子位置
	}

	this.emitterAge += dt; //发射器年龄
	if (this.emitterAge > this.emitterDeathAge) this.emitterAlive = false; //发射器死亡
};

ParticleEngine.prototype.destroy = function () {
	//销毁
	scene.remove(this.particleMesh); //从场景中移除
};
