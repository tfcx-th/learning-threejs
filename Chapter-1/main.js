var camera,
    scene,
    renderer;

function init() {

  let stats = initStats();

  // 创建一个场景，场景包含摄像机、光照、物体等元素
  scene = new THREE.Scene();

  // 创建一个相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // 创建渲染器对象
  renderer = new THREE.WebGLRenderer();
  // renderer.setClearColorHex();
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  // 创建坐标轴
  let axes = new THREE.AxisHelper(20);
  scene.add(axes);

  // 设置平面大小
  let planeGeometry = new THREE.PlaneGeometry(60, 20);
  // 设置平面外观
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  // 创建平面
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // 设置平面位置并添加到场景中
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  plane.receiveShadow = true;
  scene.add(plane);

  // 设置正方体大小
  let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  // 设置正方体外观
  let cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    // wireframe: true
  })
  // 创建正方体
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // 设置正方体位置并添加到场景中
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
  cube.castShadow = true;
  scene.add(cube);

  // 设置球体大小
  let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  // 设置球体外观
  let sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
    // wireframe: true
  })
  // 创建球体
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // 设置球体位置并添加到场景中
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 0;
  sphere.castShadow = true;
  scene.add(sphere);

  // 设置摄像机的位置
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  // 创建光源
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  document.getElementById('webGL-output').appendChild(renderer.domElement);

  let step = 0;

  let controls = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03
  }

  let gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 1);
  gui.add(controls, 'bouncingSpeed', 0, 1);

  renderScene();

  function renderScene() {

    stats.update();

    // 让正方体旋转
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // 使球体弹跳
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * Math.cos(step));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  function initStats() {
    let stats = new Stats();

    // 0: fps, 1: ms
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('Stats-output').appendChild(stats.domElement);

    return stats;
  }
}

function onResize() {

  // 更新摄像机的aspect属性
  // 该属性代表屏幕长宽比
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // 改变渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;
window.addEventListener('resize', onResize, false);