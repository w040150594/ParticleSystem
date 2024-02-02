<a name="tMgnv"></a>
## 程序功能
1. 完成了以下效果：
- 星星喷泉
- 萤火虫
- 火束
- 雨水
- 雪
- 烟花

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686979183605-e2f09758-def2-4179-85ed-153b31536d8c.png#averageHue=%231d1d1d&clientId=uc64da07d-b8b5-4&from=paste&height=150&id=u0edbd8db&originHeight=300&originWidth=437&originalType=binary&ratio=2&rotation=0&showTitle=false&size=8695&status=done&style=none&taskId=u0ebfeee6-0fcf-4e3f-a051-62a0cf7fe10&title=&width=218.5)

2. 通过鼠标拖动或者键盘输入交互修改属性
- 按M键进入全屏模式
- 点击不同类型的粒子效果显示不同的效果
- 修改每秒生成粒子的数量
- 修改粒子死亡时间
- 修改发射器死亡时间

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686979385867-ab1926b0-1e66-4760-9846-715f88790305.png#averageHue=%23262524&clientId=uc64da07d-b8b5-4&from=paste&height=73&id=udc491237&originHeight=145&originWidth=436&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11733&status=done&style=none&taskId=u365f22c8-cc8a-4e7b-881a-e65db9480c9&title=&width=218)
<a name="lSkIF"></a>
## 核心算法原理
<a name="KReTY"></a>
### 创建粒子

- 通过判断粒子的配置属性（位置，速度，颜色等等），初始化对应生成粒子初始属性
- 判断粒子运动的类型，有立方体（x,y,z）变化和球体坐标变化两种，根据这两个不同的类型生成对应的初始化属性
- 调用随机函数生成对应属性的随机初始值

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686979825557-f61b925e-5609-4d88-a326-5a8f9c198871.png#averageHue=%23262b3c&clientId=uc64da07d-b8b5-4&from=paste&height=615&id=u8fd87370&originHeight=1229&originWidth=2200&originalType=binary&ratio=2&rotation=0&showTitle=false&size=426451&status=done&style=none&taskId=u00ef2bdd-1744-4e8c-87b5-26f9c57a942&title=&width=1100)
<a name="e74IF"></a>
### 渲染粒子

- 循环遍历全部的粒子并渲染出来

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686979941787-9a8122dc-dc89-4a7c-93bf-b102748dbd8e.png#averageHue=%23262a3a&clientId=uc64da07d-b8b5-4&from=paste&height=287&id=u767566fc&originHeight=574&originWidth=2104&originalType=binary&ratio=2&rotation=0&showTitle=false&size=197222&status=done&style=none&taskId=ud57d1528-6f42-40e0-b33e-d3b0b6a0285&title=&width=1052)
<a name="mWoyF"></a>
### 更新粒子

- 遍历粒子，如果粒子还存活就更新粒子的各种属性

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686980196695-00bd5d60-53e7-4eb4-bda3-6121d79e25ad.png#averageHue=%23292d36&clientId=uc64da07d-b8b5-4&from=paste&height=436&id=u2cfde66c&originHeight=872&originWidth=2113&originalType=binary&ratio=2&rotation=0&showTitle=false&size=278908&status=done&style=none&taskId=u7c897cc3-17c1-4532-aedb-b6c9c56a848&title=&width=1056.5)

- 其中某些属性例如颜色、大小等要重新更新计算插值生成对应新的值
   - 核心算法为缓动插值函数
      - times保存时间关键帧，values保存对应的值
      - 找到时间数组中第一个大于t的值，为0返回第一个值，为数组最后一个
      - 计算出插值比例p
      - 重新计算插值（采用线性插值）
         - ![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984964659-9d87da46-9b58-4ab9-a0d0-17209bca7405.png#averageHue=%23fcfbfb&clientId=uc64da07d-b8b5-4&from=paste&height=50&id=u857dcd85&originHeight=99&originWidth=397&originalType=binary&ratio=2&rotation=0&showTitle=false&size=11137&status=done&style=none&taskId=u0fcfb62a-9e9f-40ef-8132-f7f9b8fd7cc&title=&width=198.5)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686983091464-7cb03fb1-47df-4c84-9412-ea4480369991.png#averageHue=%23282d35&clientId=uc64da07d-b8b5-4&from=paste&height=463&id=ua9b019fd&originHeight=925&originWidth=2121&originalType=binary&ratio=2&rotation=0&showTitle=false&size=225131&status=done&style=none&taskId=ucf50caf3-8a3e-49a1-ba45-8fc9c826312&title=&width=1060.5)

- 如果粒子年龄大于死亡年龄，则设置粒子死亡并添加到回收索引数组里

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686983435759-67b61bd6-9ea4-4099-90ee-a84e2cf881c8.png#averageHue=%23262a3a&clientId=uc64da07d-b8b5-4&from=paste&height=118&id=ue0501b0c&originHeight=235&originWidth=1216&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54512&status=done&style=none&taskId=u087ac248-db53-40d7-9aed-0760ddc7e7d&title=&width=608)

- 如果发射器年龄大于死亡年龄，则直接设置发射器死亡，截止更新粒子
- 遍历回收索引数组，重新创建粒子，保持死亡粒子和生成粒子数一致，使效果得以连贯

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984063947-db7c3076-67ad-4e44-bea0-ad24d501ee48.png#averageHue=%23282d36&clientId=uc64da07d-b8b5-4&from=paste&height=163&id=u9a39f7e1&originHeight=325&originWidth=1507&originalType=binary&ratio=2&rotation=0&showTitle=false&size=80933&status=done&style=none&taskId=uc5ef6239-db91-40c7-ad4b-290c1af4b43&title=&width=753.5)
<a name="LI94n"></a>
## 实验结果与分析
<a name="wOuiB"></a>
### 结果

- 星星喷泉

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984255181-614faca2-5665-4983-8df9-503f1c932176.png#averageHue=%231a1a19&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=ub239cc6e&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=556798&status=done&style=none&taskId=u9f2673b9-8048-4fc7-9a39-872b4c533e9&title=&width=1280)

- 萤火虫

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984318333-6485e015-5d78-4524-b50e-95b6ae20c682.png#averageHue=%23191919&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=ua82e0932&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=389393&status=done&style=none&taskId=u2e958b7c-42bc-41bd-b464-702ead0a067&title=&width=1280)

- 火束

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984349851-a3f55e19-1c6c-4d9a-a94d-5fa1b2f1a879.png#averageHue=%231b1919&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=uca4df71d&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=361934&status=done&style=none&taskId=uec1d3a0d-aebb-48ba-b860-40b76caf180&title=&width=1280)

- 雨水

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984375862-c73c0869-9758-41bd-baa1-bca1cd3dc182.png#averageHue=%23191919&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=u0981d113&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=431268&status=done&style=none&taskId=u498b41bf-6e92-4f63-a316-0d206f3f5d2&title=&width=1280)

- 雪

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984409561-4d087e63-f1c5-484e-bdce-eb7e319b9198.png#averageHue=%23191919&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=u4f1a2a1f&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=509568&status=done&style=none&taskId=u318eb757-2489-48aa-a0d8-a9e7e080554&title=&width=1280)

- 烟花

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984433998-80a09afe-cdbd-40f2-ba46-f7429be42386.png#averageHue=%231a1919&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=u4a102b49&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=444635&status=done&style=none&taskId=u9fd4302e-8ea7-416c-8189-eab9ac20029&title=&width=1280)

- 修改粒子数量举例

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22336651/1686984493108-4316c36f-6696-4b8f-9348-dc1e4a5164c8.png#averageHue=%231c1b1a&clientId=uc64da07d-b8b5-4&from=paste&height=669&id=u011040b1&originHeight=1338&originWidth=2560&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1098985&status=done&style=none&taskId=u5dd3b34f-5cd2-4ea1-af72-3b864da1255&title=&width=1280)
<a name="G7L3f"></a>
### 分析
 	通过创建不同类型的粒子，设置不同粒子系统的属性模拟实现了不同的粒子粒子的效果，通过设置缓动函数的插值计算，实现粒子的大小、颜色、透明度等随时间的变化的平缓的变化视觉效果更好，同时设置合理的速度、加速度，粒子本身的角速度等通过物理公式的计算让粒子移动变得更加现实感。
<a name="YkkZE"></a>
## 感想与思政
通过一学期图形学的学习，我认为图形学不仅仅是用于实现美丽的视觉效果，更是可以用来传达思想、价值观和文化内涵。<br />首先，图形学可以用来呈现我们国家的文化遗产，比如数字化的博物馆、数字化的艺术品和数字化的历史文化遗迹。这些数字化的作品不仅可以让更多的人了解和欣赏它们，还可以保护它们，让它们得以流传下去。<br />其次，图形学可以用来呈现我们国家的价值观和思想。比如，可以使用图形学来制作宣传片、广告和教育软件，来传达正能量和积极的思想。同时，图形学也可以用来制作游戏，游戏中的故事情节、角色塑造和游戏玩法都可以传达一定的价值观和思想。<br />最后，图形学还可以用来解决一些社会问题。比如，可以使用图形学来模拟城市交通，优化交通流量，减少交通拥堵和污染。又比如，可以使用图形学来模拟天气预报，提高天气预报的准确性，减少自然灾害造成的损失。<br />但是我国底层的图形学渲染引擎和gpu硬件相对于西方国家还有一定的差距，自研自足还不够，因此需要我们认清现实，专心专研，相信总有一天我们也能实现自足，领先世界，不受制于人。



