function init() {
  
  let stats = initStats();

  let scene = new THREE.Scene();
  scene.overrideMaterial = new THREE.MeshDepthMaterial();

  let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);
  camera.position.x = -50;
  camera.position.y = 40;
  camera.position.z = 50;
  camera.lookAt(scene.position);

  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  let step = 0;
  let controls = {
    rotationSpeed: 0.02,
    cameraNear: camera.near,
    cameraFar: camera.far,
    numberOfObjects: scene.children.length,

    addCube () {
      let cubeSize = Math.ceil(3 + (Math.random() * 3));
      let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.position.x = -60 + Math.round((Math.random() * 100));
      cube.position.y = Math.round((Math.random() * 10));
      cube.position.z = -100 + Math.round((Math.random() * 150));

      scene.add(cube);
      this.numberOfObjects = scene.children.length;
    },
    removeCube () {
      let allChildren = scene.children;
      let lastObject = allChildren[allChildren.length - 1];
      if (lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject);
        this.numberOfObjects = scene.children.length;
      }
    },
    outputObjects () {
      console.log(scene.children);
    }
  };

  let gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'cameraNear', 0, 50).onChange(e => {
    camera.near = e;
  });
  gui.add(controls, 'cameraFar', 50, 200).onChange(e => {
    camera.far = e;
  });

  for (let i = 0; i < 10; i++) {
    controls.addCube();
  }

  render();

  function render() {
    stats.update();

    scene.traverse(e => {
      if (e instanceof THREE.Mesh) {
        e.rotation.x += controls.rotationSpeed;
        e.rotation.y += controls.rotationSpeed;
        e.rotation.z += controls.rotationSpeed;
      }
    });

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