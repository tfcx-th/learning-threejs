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
    color: 0x777777
  }));
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -20;
  scene.add(groundMesh);

  let sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
  let cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
  let planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

  let meshMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff
  });

  let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
  let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
  let plane = new THREE.Mesh(planeGeometry, meshMaterial);

  sphere.position.x = 0;
  sphere.position.y = 3;
  sphere.position.z = 2;

  for (let f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
    let face = sphere.geometry.faces[f];
    let centroid = new THREE.Vector3(0, 0, 0);
    centroid.add(sphere.geometry.vertices[face.a]);
    centroid.add(sphere.geometry.vertices[face.b]);
    centroid.add(sphere.geometry.vertices[face.c]);
    centroid.divideScalar(3);

    let arrow = new THREE.ArrowHelper(face.normal, centroid, 2, 0x3333ff, 0.5, 0.5);
    sphere.add(arrow);
  }

  cube.position = sphere.position;
  plane.position = sphere.position;

  scene.add(cube);

  let ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  let oldContext = null;
  let controls = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
    opacity: meshMaterial.opacity,
    transparent: meshMaterial.transparent,
    visible: meshMaterial.visible,
    side: 'front',
    wireframe: meshMaterial.wireframe,
    wireframeLinewidth: meshMaterial.wireframeLinewidth,
    selectedMesh: 'cube',
    shadow: 'flat'
  };

  let gui = new dat.GUI();
  let spGui = gui.addFolder("Mesh");
  spGui.add(controls, 'opacity', 0, 1).onChange(e => {
    meshMaterial.opacity = e;
  });
  spGui.add(controls, 'transparent').onChange(e => {
    meshMaterial.transparent = e;
  });
  spGui.add(controls, 'wireframe').onChange(e => {
    meshMaterial.wireframe = e;
  });
  spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(e => {
    meshMaterial.wireframeLinewidth = e;
  });
  spGui.add(controls, 'visible').onChange(e => {
    meshMaterial.visible = e;
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
  spGui.add(controls, 'shadow', ['flat', 'smooth']).onChange(e => {
    switch (e) {
      case 'flat':
        meshMaterial.shading = THREE.FlatShading;
        break;
      case 'smooth':
        meshMaterial.shading = THREE.SmoothShading;
        break;
    }
    let oldPos = sphere.position.clone();
    scene.remove(sphere);
    scene.remove(plane);
    scene.remove(cube);
    sphere = new THREE.Mesh(sphere.geometry.clone(), meshMaterial);
    cube = new THREE.Mesh(sphere.geometry.clone(), meshMaterial);
    plane = new THREE.Mesh(sphere.geometry.clone(), meshMaterial);

    sphere.position = oldPos;
    cube.position = oldPos;
    plane.position = oldPos;

    switch (controls.selectedMesh) {
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
    meshMaterial.needsUpdate = true;
    console.log(meshMaterial);
  });
  spGui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange(e => {
    scene.remove(sphere);
    scene.remove(cube);
    scene.remove(plane);

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
  })

  render();

  function render() {
    stats.update();

    cube.rotation.y += (step += 0.01);
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