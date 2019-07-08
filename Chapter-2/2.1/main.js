var camera,
    scene,
    renderer;

function init() {
  let stats = initStats();

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene.add(camera);

  // scene.fog = new THREE.Fog(0xffffff, 0.015, 120);
  scene.fog = new THREE.FogExp2(0xffffff, 0.015);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  let ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  document.getElementById('webGL-output').appendChild(renderer.domElement);

  let controls = {
    rotationSpeed: 0.02,
    numberOfObjects: scene.children.length + 1,
    
    addCube () {
      let cubeSize = Math.ceil(Math.random() * 3);
      let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.castShadow = true;
      cube.name = 'cube-' + (scene.children.length - 5);
      cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
      cube.position.y = Math.round(Math.random() * 5);
      cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);
      scene.add(cube);
      this.numberOfObjects++;
    },
    removeCube () {
      let allChildren = scene.children;
      let lastObject = allChildren[allChildren.length - 1];
      if (lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject);
        this.numberOfObjects--;
      }
    },
    outputObjects () {
      console.log(scene.children);
    }
  }

  let gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 1);
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'outputObjects')
  gui.add(controls, 'numberOfObjects').listen();

  render();

  function render() {
    stats.update();

    // 在每个子对象上执行
    scene.traverse(e => {
      if (e instanceof THREE.Mesh && e !== plane) {
        e.rotation.x += controls.rotationSpeed;
        e.rotation.y += controls.rotationSpeed;
        e.rotation.z += controls.rotationSpeed;
      }
    });

    requestAnimationFrame(render);
    renderer.render(scene, camera);
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
}

window.onload = init;