var camera,
    scene,
    renderer;

function init() {
  let stats = initStats();

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene.add(camera);

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

  camera.position.x = -50;
  camera.position.y = 30;
  camera.position.z = 20;
  camera.lookAt(new THREE.Vector3(-10, 0, 0));

  let ambientLight = new THREE.AmbientLight(0x090909);
  scene.add(ambientLight);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 40, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);

  addGeometries(scene);

  document.getElementById('webGL-output').appendChild(renderer.domElement);

  // let controls = {
  // }

  // let gui = new dat.GUI();

  let step = 0;

  render();

  function addGeometries(scene) {
    let geoms = [];

    // 圆柱体
    geoms.push(new THREE.CylinderGeometry(1, 4, 4));

    // 正方体
    geoms.push(new THREE.BoxGeometry(2, 2, 2));

    // 球体
    geoms.push(new THREE.SphereGeometry(2));

    // 二十面体
    geoms.push(new THREE.IcosahedronGeometry(4));

    // 创建一个凸多面体，以正方体为例
    let points = [
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(2, 2, -2),
      new THREE.Vector3(-2, 2, -2),
      new THREE.Vector3(-2, 2, 2),
      new THREE.Vector3(2, -2, 2),
      new THREE.Vector3(2, -2, -2),
      new THREE.Vector3(-2, -2, -2),
      new THREE.Vector3(-2, -2, 2)
    ];
    geoms.push(new THREE.ConvexGeometry(points));

    // 沿Y轴对称
    let pts = [];
    let detail = .1;
    let radius = 3;
    for (let angle = 0.0; angle < Math.PI; angle += detail) {
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    geoms.push(new THREE.LatheGeometry(pts, 12));

    // 八面体
    geoms.push(new THREE.OctahedronGeometry(3));

    // 基于函数创建
    geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));

    // 正四面体
    geoms.push(new THREE.TetrahedronGeometry(3));

    // 圆环面
    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

    // 圆环结
    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

    let j = 0;
    for (let i = 0; i < geoms.length; i++) {
      
      let cubMaterial = new THREE.MeshLambertMaterial({
        wireframe: true,
        color: Math.random() * 0xffffff
      });
      
      let materials = [
        new THREE.MeshLambertMaterial({
          color: Math.random() * 0xffffff,
          shading: THREE.FlatShading
        }),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true
        })
      ];

      let mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], materials);
      mesh.traverse(e => e.castShadow = true);
      mesh.position.x = -24 + ((i % 4) * 12);
      mesh.position.y = 4;
      mesh.position.z = -8 + (j * 12);

      if ((i + 1) % 4 === 0) {
        j++;
      }
      scene.add(mesh);
    }
  }

  function render() {
    stats.update();

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