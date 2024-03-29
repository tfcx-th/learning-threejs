function init() {
  
  let stats = initStats();

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -40;
  camera.position.y = 40;
  camera.position.z = 40;
  camera.lookAt(scene.position);

  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = false;

  let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = -2;
  plane.position.z = 0;
  scene.add(plane);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let group = new THREE.Mesh();
  let mats = [];
  mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));
  mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));
  mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
  mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));
  mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));
  let faceMaterial = new THREE.MeshFaceMaterial(mats);
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        let cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
        let cube = new THREE.Mesh(cubeGeom, faceMaterial);
        cube.position.set(x * 3 - 3, y * 3, z * 3 - 3);
        group.add(cube);
      }
    }
  }
  scene.add(group);

  let step = 0;
  let controls = {
    rotationSpeed: 0.02,
    numberOfObjects: scene.children.length
  };

  let gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);

  render();

  function render() {
    stats.update();
    group.rotation.y = (step += controls.rotationSpeed);
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