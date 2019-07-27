function init() {

  let stats = initStats();

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -35;
  camera.position.y = 30;
  camera.position.z = 25;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  let planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = -5;
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

  let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  let sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777FF
  });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.position.x = 20;
  sphere.position.y = 0;
  sphere.position.z = 2;
  scene.add(sphere);

  let ambiColor = "#1c1c1c";
  let ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);

  let target = new THREE.Object3D();
  target.position = new THREE.Vector3(5, 0, 0);
  
  let pointColor = "#ff5808";
  let directionalLight = new THREE.DirectionalLight(pointColor);
  directionalLight.position.set(-40, 60, -10);
  directionalLight.castShadow = true;
  directionalLight.shadowCameraNear = 2;
  directionalLight.shadowCameraFar = 200;
  directionalLight.shadowCameraLeft = -50;
  directionalLight.shadowCameraRight = 50;
  directionalLight.shadowCameraTop = 50;
  directionalLight.shadowCameraBottom = -50;
  directionalLight.distance = 0;
  directionalLight.intensity = 0.5;
  directionalLight.shadowMapHeight = 1024;
  directionalLight.shadowMapWidth = 1024;
  scene.add(directionalLight);

  // 添加一个小的球体模仿点光源
  let sphereLight = new THREE.SphereGeometry(0.2);
  let sphereLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xac6c25
  });
  let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;
  sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
  scene.add(sphereLightMesh);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  // 用于灯光动画
  let invert = 1, phase = 0;
  let controls = {
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
    ambientColor: ambiColor,
    pointColor: pointColor,
    intensity: 0.5,
    distance: 0,
    exponent: 30,
    angle: 0.1,
    debug: false,
    castShadow: true,
    onlyShadow: false,
    target: "Plane",
  };

  let gui = new dat.GUI();
  gui.addColor(controls, 'ambientColor').onChange(e => {
    ambientLight.color = new THREE.Color(e);
  });
  gui.addColor(controls, 'pointColor').onChange(e => {
    directionalLight.color = new THREE.Color(e);
  });
  gui.add(controls, 'intensity', 0, 5).onChange(e => {
    directionalLight.intensity = e;
  });
  gui.add(controls, 'distance', 0, 200).onChange(e => {
    directionalLight.distance = e;
  });
  gui.add(controls, 'debug').onChange(e => {
    directionalLight.shadowCameraVisible = e;
  });
  gui.add(controls, 'castShadow').onChange(e => {
    directionalLight.castShadow = e;
  });
  gui.add(controls, 'onlyShadow').onChange(e => {
    directionalLight.onlyShadow = e;
  });
  gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(e => {
    console.log(e);
    switch (e) {
      case "Plane":
        directionalLight.target = plane;
        break;
      case "Sphere":
        directionalLight.target = sphere;
        break;
      case "Cube":
        directionalLight.target = cube;
        break;
    }
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

    sphereLightMesh.position.z = -8;
    sphereLightMesh.position.y = 27 * Math.sin(step / 3);
    sphereLightMesh.position.x = 10 + 26 * Math.cos(step / 3);

    directionalLight.position.copy(sphereLightMesh.position);

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