function init() {
  
  let stats = initStats();

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 20;
  camera.position.y = 30;
  camera.position.z = 21;
  camera.lookAt(new THREE.Vector3(0, 0, -30));

  let renderer = new THREE.WebGLDeferredRenderer({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    antialias: true,
    tonemapping: THREE.FilmicOperator,
    brightness: 2.5
  });

  let planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
  let planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 200
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 60, -10);
  spotLight0.intensity = 0.1;
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  let areaLight1 = new THREE.AreaLight(0xff0000, 3);
  areaLight1.position.set(-10, 10, -35);
  areaLight1.rotation.set(-Math.PI / 2, 0, 0);
  areaLight1.width = 4;
  areaLight1.height = 9.9;
  scene.add(areaLight1);

  let areaLight2 = new THREE.AreaLight(0x00ff00, 3);
  areaLight2.position.set(0, 10, -35);
  areaLight2.rotation.set(-Math.PI / 2, 0, 0);
  areaLight2.width = 4;
  areaLight2.height = 9.9;
  scene.add(areaLight2);

  let areaLight3 = new THREE.AreaLight(0x0000ff, 3);
  areaLight3.position.set(10, 10, -35);
  areaLight3.rotation.set(-Math.PI / 2, 0, 0);
  areaLight3.width = 4;
  areaLight3.height = 9.9;
  scene.add(areaLight3);

  let planeGeometry1 = new THREE.BoxGeometry(4, 10, 0);
  let planeGeometry1Mat = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  let plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
  plane1.position.copy(areaLight1.position);
  scene.add(plane1);

  let planeGeometry2 = new THREE.BoxGeometry(4, 10, 0);
  let planeGeometry2Mat = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  let plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);
  plane2.position.copy(areaLight2.position);
  scene.add(plane2);

  let planeGeometry3 = new THREE.BoxGeometry(4, 10, 0);
  let planeGeometry3Mat = new THREE.MeshBasicMaterial({
    color: 0x0000ff
  });
  let plane3 = new THREE.Mesh(planeGeometry3, planeGeometry3Mat);
  plane3.position.copy(areaLight3.position);
  scene.add(plane3);

  let controls = {
    rotationSpeed: 0.02,
    color1: 0xff0000,
    intensity1: 2,
    color2: 0x00ff00,
    intensity2: 2,
    color3: 0x0000ff,
    intensity3: 2,
  };

  let gui = new dat.GUI();
  gui.addColor(controls, 'color1').onChange(e => {
    areaLight1.color = new THREE.Color(e);
    planeGeometry1Mat.color = new THREE.Color(e);
    scene.remove(plane1);
    plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
    plane1.position.copy(areaLight1.position);
    scene.add(plane1);
  });
  gui.add(controls, 'intensity1', 0, 5).onChange(e => {
    areaLight1.intensity = e;
  });
  gui.addColor(controls, 'color2').onChange(e => {
    areaLight2.color = new THREE.Color(e);
    planeGeometry2Mat.color = new THREE.Color(e);
    scene.remove(plane2);
    plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);
    plane2.position.copy(areaLight2.position);
    scene.add(plane2);
  });
  gui.add(controls, 'intensity2', 0, 5).onChange(e => {
    areaLight2.intensity = e;
  });
  gui.addColor(controls, 'color3').onChange(e => {
    areaLight3.color = new THREE.Color(e);
    planeGeometry3Mat.color = new THREE.Color(e);
    scene.remove(plane3);
    plane3 = new THREE.Mesh(planeGeometry3, planeGeometry3Mat);
    plane3.position.copy(areaLight3.position);
    scene.add(plane3);
  });
  gui.add(controls, 'intensity3', 0, 5).onChange(e => {
    areaLight3.intensity = e;
  });

  render();

  function render() {
    stats.update();

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