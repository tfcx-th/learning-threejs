function init() {
  
  let stats = initStats();

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -25;
  camera.position.y = 30;
  camera.position.z = 25;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF
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
    color: 0xFFFFFF
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

  const ambiColor = "#0C0C0C";
  let ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);

  let spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  let controls = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
    ambientColor: ambiColor,
    disableSpotlight: false
  };

  let gui = new dat.GUI();
  gui.add(controls, 'ambientColor').onChange(e => {
    ambientLight.color = new THREE.Color(e);
  });
  gui.add(controls, 'disableSpotlight').onChange(e => {
    spotLight.visible = !e;
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