function init() {
  
  let stats = initStats();

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 120;
  camera.position.y = 60;
  camera.position.z = 180;
  
  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);

  let planeGeometry = new THREE.PlaneGeometry(180, 180);
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  for (let j = 0; j < planeGeometry.parameters.height / 5; j++) {
    for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
      let rnd = Math.random() * 0.75 + 0.25;
      let cubeMaterial = new THREE.MeshLambertMaterial();
      cubeMaterial.color = new THREE.Color(rnd, 0, 0);
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + (j * 5);
      cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + (i * 5);
      cube.position.y = 2;
      scene.add(cube);
    }
  }

  let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7);
  directionalLight.position.set(-20, 40, 60);
  scene.add(directionalLight);

  let ambientLight = new THREE.AmbientLight(0x292929);
  scene.add(ambientLight);

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  let controls = {
    perspective: 'Perspective',
    
    switchCamera () {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(window.innerWidth / -16,
                                              window.innerWidth / 16,
                                              window.innerHeight / 16,
                                              window.innerHeight / -16,
                                              -200, 500);
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(scene.position);
        this.perspective = 'Orthographic';
      } else {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(scene.position);
        this.perspective = 'Perspective';
      }
    }
  };

  let gui = new dat.GUI();
  gui.add(controls, 'switchCamera');
  gui.add(controls, 'perspective').listen();

  camera.lookAt(scene.position);
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