function init() {
  
  let stats = initStats();

  let scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200);

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -20;
  camera.position.y = 15;
  camera.position.z = 45;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  let textureGrass = THREE.ImageUtils.loadTexture("../../assets/textures/ground/grasslight-big.jpg");
  textureGrass.wrapS = THREE.RepeatWrapping;
  textureGrass.wrapT = THREE.RepeatWrapping;
  textureGrass.repeat.set(4, 4);

  let planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
  let planeMaterial = new THREE.MeshLambertMaterial({
    map: textureGrass
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  let cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff3333
  });
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
  scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
  let sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777FF
  });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.position.x = 10;
  sphere.position.y = 5;
  sphere.position.z = 10;
  scene.add(sphere);

  let spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 60, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  let target = new THREE.Object3D();
  target.position = new THREE.Vector3(5, 0, 0);

  let hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  hemisphereLight.position.set(0, 500, 0);
  scene.add(hemisphereLight);
  
  let pointColor = "#ffffff";
  let dirLight = new THREE.DirectionalLight(pointColor);
  dirLight.position.set(30, 10, -50);
  dirLight.castShadow = true;
  dirLight.target = plane;
  dirLight.shadowCameraNear = 0.1;
  dirLight.shadowCameraFar = 200;
  dirLight.shadowCameraLeft = -50;
  dirLight.shadowCameraRight = 50;
  dirLight.shadowCameraTop = 50;
  dirLight.shadowCameraBottom = -50;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;
  scene.add(dirLight);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  // 用于灯光动画
  let invert = 1, phase = 0;
  let controls = {
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
    hemisphere: true,
    color: 0x00ff00,
    skyColor: 0x0000ff,
    intensity: 0.6
  };

  let gui = new dat.GUI();
  gui.add(controls, 'hemisphere').onChange(e => {
    hemisphereLight = e ? controls.intensity : 0;
  });
  gui.addColor(controls, 'color').onChange(e => {
    hemisphereLight.groundColor = new THREE.Color(e);
  });
  gui.addColor(controls, 'skyColor').onChange(e => {
    hemisphereLight.color = new THREE.Color(e);
  });
  gui.add(controls, 'intensity', 0, 5).onChange(e => {
    hemisphereLight.intensity = e;
  });

  render();

  function render() {
    stats.update();

    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.x += controls.rotationSpeed;

    step += controls.bouncingSpeed;
    sphere.position.x = 20 + 10 * (Math.cos(step));
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}

function initStats() {
  let stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.getElementById('Stats-output').appendChild(stats.domElement);
  return stats;
}

window.onload = init;