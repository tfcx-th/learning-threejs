function init() {

  let stats = initStats();

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -20;
  camera.position.y = 30;
  camera.position.z = 40;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  let renderer;

  let webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;

  let canvasRenderer = new THREE.CanvasRenderer();
  canvasRenderer.setSize(window.innerWidth, window.innerHeight);

  renderer = webGLRenderer;

  let groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
  let groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({
    color: 0x555555
  }));
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -20;
  scene.add(groundMesh);

  let sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
  let cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
  let planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

  let meshMaterial = new THREE.MeshPhongMaterial({
    color: 0x7777ff
  });

  let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
  let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
  let plane = new THREE.Mesh(planeGeometry, meshMaterial);

  sphere.position.x = 0;
  sphere.position.y = 3;
  sphere.position.z = 2;

  cube.position = sphere.position;
  plane.position = sphere.position;

  scene.add(cube);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 30, 60);
  spotLight.castShadow = true;
  spotLight.intensity = 0.6;
  scene.add(spotLight);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  let controls = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
    opacity: meshMaterial.opacity,
    transparent: meshMaterial.transparent,
    overdraw: meshMaterial.overdraw,
    visible: meshMaterial.visible,
    emissive: meshMaterial.emissive.getHex(),
    ambient: meshMaterial.ambient.getHex(),
    specular: meshMaterial.specular.getHex(),
    shininess: meshMaterial.shininess,
    side: 'front',
    color: meshMaterial.color.getStyle(),
    metal: false,
    wrapAround: false,
    wrapR: 1,
    wrapG: 1,
    wrapB: 1,
    selectedMesh: 'cube'
  };

  let gui = new dat.GUI();
  let spGui = gui.addFolder("Mesh");
  spGui.add(controls, 'opacity', 0, 1).onChange(e => {
    meshMaterial.opacity = e;
  });
  spGui.add(controls, 'transparent').onChange(e => {
    meshMaterial.transparent = e;
  });
  spGui.add(controls, 'visible').onChange(e => {
    meshMaterial.visible = e;
  });
  spGui.addColor(controls, 'ambient').onChange(e => {
    meshMaterial.ambient = new THREE.Color(e);
  });
  spGui.addColor(controls, 'emissive').onChange(e => {
    meshMaterial.emissive = new THREE.Color(e);
  });
  spGui.addColor(controls, 'specular').onChange(e => {
    meshMaterial.specular = new THREE.Color(e);
  });
  spGui.add(controls, 'shininess', 0, 200).onChange(e => {
    meshMaterial.shininess = e;
  });
  spGui.add(controls, 'side', ['front', 'back', 'double']).onChange(e => {
    switch (e) {
      case 'front':
        meshMaterial.side = THREE.FrontSide;
        break;
      case 'back':
        meshMaterial.side = THREE.BackSide;
        break;
      case 'double':
        meshMaterial.side = THREE.DoubleSide;
        break;
    }
    meshMaterial.needsUpdate = true;
  });
  spGui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange(e => {
    scene.remove(plane);
    scene.remove(cube);
    scene.remove(sphere);

    switch (e) {
      case 'cube':
        scene.add(cube);
        break;
      case 'sphere':
        scene.add(sphere);
        break;
      case 'plane':
        scene.add(plane);
        break;
    }
    scene.add(e);
  });
  spGui.add(controls, 'metal').onChange(e => {
    meshMaterial.metal = e;
    meshMaterial.needsUpdate = true;
  });
  spGui.add(controls, 'wrapAround').onChange(e => {
    meshMaterial.wrapAround = e;
    meshMaterial.needsUpdate = true;
  });
  spGui.add(controls, 'wrapR', 0, 1).step(0.01).onChange(e => {
    meshMaterial.wrapRGB.x = e;
  });
  spGui.add(controls, 'wrapG', 0, 1).step(0.01).onChange(e => {
    meshMaterial.wrapRGB.y = e;
  });
  spGui.add(controls, 'wrapB', 0, 1).step(0.01).onChange(e => {
    meshMaterial.wrapRGB.z = e;
  });

  render();

  function render() {
    stats.update();

    cube.rotation.y = step += 0.01;
    plane.rotation.y = step;
    sphere.rotation.y = step;

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