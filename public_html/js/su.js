"use strict"


//import * as THREE from '../build/three.module.js';

//import { GUI } from './jsm/libs/dat.gui.module.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';
//import { Water } from 'Water2.js';
var isPause = true;
var isOver = false;
var isNewTargetComing= true;
var isTomatoExist = false;
var robotSpeed = 0;
var gameover;
var died;
var scene, camera, clock, renderer, walter;
var parrot;
var morphs = [];
var mixer;
var container, stats, clock, gui, actions, activeAction, previousAction;
var api = { state: 'Walking' };
var modelRobot;
var face;
var prev;
var curr;
var left = 0;
var right = 0;
var forward = 1;
var backward = 0;
var uniforms;
var directionList = [left, right, forward, backward];
var i = 0;
var spotLight;
var spotLight2;
var spotLight3;


var totalShapeCounter=0;
var shapeLimit = 40;
var allShapes=[];
var shapeNameList = ["cube","cube","cube","pyramid","pyramid","pyramid","pyramid","pyramid","pyramid","sphere","sphere","sphere","sphere","sphere","sphere","sphere","sphere","sphere"];
var targetShapeNameList = ["cube","cube","cube","cube","pyramid","pyramid","pyramid","sphere","sphere"];

var isSame ;
var totalPoint=0;

var targetShape;
var holyTomato;
var counter;


var mainTime ;
var tomatoCreateTime ;
var noTomatoTime;
var nextTomatoTime ;

var light;

// The names of the 3D models to load. One-per file.
// A model may have multiple SkinnedMesh objects as well as several rigs (armatures). Units will define which
// meshes, armatures and animations to use. We will load the whole scene for each object and clone it for each unit.
// Models are from https://www.mixamo.com/
var MODELS = [
        { name: "Soldier" },
        { name: "Parrot" },
        // { name: "RiflePunch" },
];

// Here we define instances of the models that we want to place in the scene, their position, scale and the animations
// that must be played.
var playGroundSize = 500;
var grassGroundSize = 750;
var UNITS = [
        {
            modelName: "grassGround", // Will use the 3D model from file models/gltf/Soldier.glb
            meshName: "groundGrass", // Name of the main mesh to animate
            position: { x: 0, y: 0, z: 0 }, // Where to put the unit in the scene
            scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
            animationName: "", // Name of animation to run
            material: {roughness: 0.8, metalness:0.4},
            size: {height: grassGroundSize, width: grassGroundSize},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'http://localhost:8383/PacMan/grasslight-big.jpg'
         
        },
        {
            modelName: "playGround",
            meshName: "playGround",
            position:{x:0, y:0.05, z:0},
            scale: 1,
            animationName: "",
            material: {roughness: 0.8, metalness:0.4},
            size: {height: playGroundSize, width: playGroundSize},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'http://localhost:8383/PacMan/textures/hardwood2_diffuse.jpg'
        },
        {
            modelName: "blueGround",
            meshName: "groundBlue",
            position: { x: 0.0, y: 0.05, z: -(playGroundSize/2 + 119/2) },
            scale: 1,
            animationName: "",
            material: { roughness: 0.2, metalness: 0.4, color: 0x00ffff },
            size: {width: playGroundSize-0.5, height: 118.0},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath: ""
        },
        {
            modelName: "water",
            meshName: "water",
            position: { x: 0.0, y: 0.1, z: -(playGroundSize/2 + 119/2) },
            scale: 4,
            animationName: "",
            material: { /*
                        color: '#ffffff',
                        scale: 4,
                        flowDirection: new THREE.Vector2( 5, 5 ),
                        textureWidth: 1024,
                        textureHeight: 1024,
                        distortionScale: 50.0,
                        waterNormals: new THREE.TextureLoader().load( 'http://localhost:8383/PacMan/textures/waternormals.jpg', function ( texture ) {

                                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                            } ),
                        alpha: 1.0,
                        sunDirection: light.position.clone().normalize(),   
                        sunColor: 0xffffff,
                        waterColor: 0x001e0f,
                        distortionScale: 3.7,
                        fog: scene.fog !== undefined
                        */
                    },
            size: {width: playGroundSize, height: 119},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath: ""
            
            
        },
        {
            modelName: "meshPong",
            meshName: "meshPong1",
            position: { x: 60, y: 0.0, z: -(playGroundSize/2 + 90/2 - 30) },
            scale: 1,
            animationName: "",
            material: { color: 0xffb851 },
            size: {widthx: 250, widthy: 10, height: 10},
            rotation: { x:0.01, y: 0, z:0},
            texturePath: ""
        },
        {
            modelName: "meshPong",
            meshName: "meshPong2",
            position: { x: 60, y: 0.0, z: -(playGroundSize/2 + 90/2 - 30) },
            scale: 1,
            animationName: "",
            material: { color: 0xffb851 },
            size: {widthx: 300, widthy: 5, height: 20},
            rotation: { x:0.01, y: 0, z:0},
            texturePath: ""
        },
        {
            modelName: "parrot", // Will use the 3D model from file models/gltf/Soldier.glb
            meshName: "parrot", // Name of the main mesh to animate
            position: { x: -100.0, y: 45.0, z: -(playGroundSize/2 + 90/2 + 10)}, // Where to put the unit in the scene
            scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
            animationName: "", // Name of animation to run
            material: {},
            size: {},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'',
            modelPath:'http://localhost:8383/PacMan/models/Parrot.glb',
            speed: 450,
            duration: 0.5,
            rotationVal: 2,
            fudgeColor: false
                   
        },
        {
            modelName: "flamingo", // Will use the 3D model from file models/gltf/Soldier.glb
            meshName: "flamingo", // Name of the main mesh to animate
            position: { x: -100.0, y: 15.0, z: -(playGroundSize/2 + 90/2 - 10) }, // Where to put the unit in the scene
            scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
            animationName: "", // Name of animation to run
            material: {},
            size: {},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'',
            modelPath:'http://localhost:8383/PacMan/models/Flamingo.glb',
            speed: 500,
            duration: 1.0,
            rotationVal: -16,
            fudgeColor: false
                   
        },
        {
            modelName: "horse", // Will use the 3D model from file models/gltf/Soldier.glb
            meshName: "horse1", // Name of the main mesh to animate
            position: { x: 65.0, y: 1.0, z: -85.0 }, // Where to put the unit in the scene
            scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
            animationName: "", // Name of animation to run
            material: {},
            size: {},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'',
            modelPath:'http://localhost:8383/PacMan/models/Horse.glb',
            speed: 550,
            duration: 1.0,
            rotationVal: 2,
            fudgeColor: true
                   
        },
       {
            modelName: "horse", // Will use the 3D model from file models/gltf/Soldier.glb
            meshName: "horse2", // Name of the main mesh to animate
            position: { x: -65.0, y: 1.0, z: -85.0 }, // Where to put the unit in the scene
            scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
            animationName: "", // Name of animation to run
            material: {},
            size: {},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'',
            modelPath:'http://localhost:8383/PacMan/models/Horse.glb',
            speed: 550,
            duration: 1.0,
            rotationVal: 2,
            fudgeColor: true
                   
        },
        {
            modelName: "flower", // Will use the 3D model from file models/gltf/Soldier.glb
            meshName: "flower", // Name of the main mesh to animate
            position: { x: 0.0, y: 5.0, z: 0.0 }, // Where to put the unit in the scene
            scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
            animationName: "", // Name of animation to run
            material: {},
            size: {},
            rotation: { x:Math.PI *- 0.5, y: 0, z:0},
            texturePath:'',
            modelPath:'http://localhost:8383/PacMan/models/Flower/Flower.glb',
            speed: 550,
            duration: 1.0,
            rotationVal: 2,
            fudgeColor: true
                   
        },
        {
            modelName: "tree",
            meshName: "tree",
            position: { x: -150.0, y: -40, z: -(playGroundSize/2 + 90/2 + 10) },
            scale: 45,
            animationName: "",
            material: { roughness: 0.2, metalness: 0.4, color: 0x00ffff },
            size: {},
            rotation: { x:Math.PI *- 0.5, y: 1.5, z:0},
            texturePath: ""
        },
        
        
];
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


var GAME_UNITS = [
    {
        modelName: "cube", // Will use the 3D model from file models/gltf/Soldier.glb
        meshName: "cube", // Name of the main mesh to animate
        position: { x:0, y: 6, z: 0 }, // Where to put the unit in the scene
        scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
        animationName: "", // Name of animation to run
        material: {color: 0x0000},
        size: {x:10, y:10, z:10},
        rotation: { x:Math.PI *- 0.5, y: 0, z:0},
        texturePath:'http://localhost:8383/PacMan/grasslight-big.jpg',
        isVisible: 1,
        point : 30
    },
    {
        modelName: "pyramid" , // Will use the 3D model from file models/gltf/Soldier.glb
        meshName: "pyramid", // Name of the main mesh to animate
        position: { x: 0, y: 6, z: 0 }, // Where to put the unit in the scene
        scale: 1, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
        animationName: "", // Name of animation to run
        material: {color: 0xffd700},
        size: {x:10, y:10, z:10},
        rotation: { x:Math.PI *- 0.5, y: 0, z:0},
        texturePath:'http://localhost:8383/PacMan/grasslight-big.jpg',
        isVisible: 1,
        point : 20
         
    },
    {
        modelName: "sphere", // Will use the 3D model from file models/gltf/Soldier.glb
        meshName: "sphere", // Name of the main mesh to animate
        position: { x: 0, y: 10, z:0 }, // Where to put the unit in the scene
        scale: 0.5, // Scaling of the unit. 1.0 means: use original size, 0.1 means "10 times smaller", etc.
        animationName: "", // Name of animation to run
        material: {color:0x00ffff},
        size: {x:10, y:10, z:10},
        rotation: { x:Math.PI *- 0.5, y: 0, z:0},
        texturePath:'http://localhost:8383/PacMan/grasslight-big.jpg',
        isVisible: 1,
        point : 10
         
    }

];

var GAMEUNITS = [];



function findModelByName(name){
    var i;
    for(i = 0; i<UNITS.length; i++){
        if(UNITS[i].meshName === name )
            return UNITS[i];
    }
    return 0;
}

function findGameUnitByName(name){
    var i;
    for(i = 0; i<GAME_UNITS.length; i++){
        if(GAME_UNITS[i].meshName === name )
            return GAME_UNITS[i];
    }
    return 0;
}



function removeOverlay(){
    
}

//init();
//animate();
var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );
var cubeTexture;

function fadeToAction( name, duration ) {

            previousAction = activeAction;
            activeAction = actions[ name ];

            if ( previousAction !== activeAction ) {
                    previousAction.fadeOut( duration );
            }

            activeAction
                    .reset()
                    .setEffectiveTimeScale( 1 )
                    .setEffectiveWeight( 1 )
                    .fadeIn( duration )
                    .play();

    }



function init() {
        
        var overlay = document.getElementById( 'overlay' );
        overlay.remove();

        var container = document.getElementById( 'container' );
        // scene
        scene = new THREE.Scene();

        
        
        // camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
        camera.position.set( 0, 200, 700 );
        camera.lookAt( scene.position );


        // clock
        clock = new THREE.Clock();
        
        var loader = new GLTFLoader();
        loader.load( 'http://localhost:8383/PacMan/models/RobotExpressive/RobotExpressive.glb', function ( gltf ) {

                modelRobot = gltf.scene.children[0];
                modelRobot.scale.set(12, 12, 12);
                modelRobot.castShadow = true;
                scene.add( modelRobot );
                createGUI( modelRobot, gltf.animations );
                

        }, undefined, function ( e ) {

                console.error( e );

        } );    

        // skybox
        var cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( 'http://localhost:8383/PacMan/Park3Med/' );

        cubeTexture = cubeTextureLoader.load( [
                "posx.jpg", "negx.jpg",
                "posy.jpg", "negy.jpg",
                "posz.jpg", "negz.jpg"
        ] );
        
        cubeTexture.mapping = THREE.CubeRefractionMapping;
        scene.background = cubeTexture;
        
        light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set(5, 5, 0);
        light.castShadow = true;
        light.shadow.mapSize.width = 512;  // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.top = 1;
        light.shadow.camera.bottom = - 1;
        light.shadow.camera.left = - 1;
        light.shadow.camera.right = 1;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far =
	scene.add( light );
        
        
        

        //var torus = findModelByName("torusknot");
        //var geometryTorus = new THREE.TorusKnotGeometry( torus.size.a, 3, 100, 16 );
        //var materialTorus = new THREE.MeshBasicMaterial( { color: 0x00ff0f } );
        //var torusKnot = new THREE.Mesh( geometryTorus, materialTorus );
        //scene.add( torusKnot );

        // light
        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        ambientLight.castShadow = true;
        //scene.add( ambientLight );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.castShadow = true;
        directionalLight.position.set( 20, 25, 20 );
        scene.add( directionalLight );
        
        //var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        //directionalLight.position.set( -1, 1, 1 );
        //scene.add( directionalLight );

        
        // initialize mixer for animations
        mixer = new THREE.AnimationMixer( scene );
        


        // grass ground
        var grassGround = findModelByName("groundGrass");
        createPlane(grassGround, 0, 1, 0);
        
        grassGround.rotation.x = Math.PI *- 1.5;
        createPlane(grassGround, 0, 1, 0);
       
       
        var playGround = findModelByName("playGround");
        createPlane(playGround, 0, 1, 0);
        
        
        
        // blue ground under water
        var blueGround = findModelByName("groundBlue");
        createPlane(blueGround, 0, 0, 0);
        
        
        
       
        // water
        var water = findModelByName("water");
        createPlane(water, 1, 0, 0);
        
        
        
        
        
        // planes under text
        var planeUnderText1 = findModelByName("meshPong1");
        createPlane(planeUnderText1, 0, 0, 1);
        var planeUnderText2 = findModelByName("meshPong2");
        createPlane(planeUnderText2, 0, 0, 1);

        
        // Parrot
        var parrot = findModelByName("parrot");
        createModel(parrot);
        
        // Flamingo
        var flamingo = findModelByName("flamingo");
        createModel(flamingo);
        
        // Horse
        var horse1 = findModelByName("horse1");
        var horse2 = findModelByName("horse2");
        //createModel(horse1);
        //createModel(horse2);
        
        var tree = findModelByName("tree");
        createTree(tree);
        			
    
       
        
        
        
        createText("BBM 412  TERM  PROJECT", -45.0, 7.0, -(playGroundSize/2 + 90/2 -33));
        createText("GAME OVER!!", -35.0, 300.0, 0.0);

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild( renderer.domElement );
			
        

        
        
        window.onkeyup = function(event) {
    
            let key = event.key.toUpperCase();
            if ( key === 'ARROWUP' ) {

            } else if ( key === 'ARROWDOWN' ) {

            } else if ( key === 'ARROWLEFT' ) {

            } else if ( key === 'ARROWRIGHT' ) {

            } else if ( key === 'PAGEUP') {

            } else if ( key === 'P') {
                if(!isPause){
                    fadeToAction("Idle",0.5);
                    robotSpeed = 0;
                    isPause = true;
                }else{
                    mainTime = new Date();
                    robotSpeed = 1.5;
                    fadeToAction("Running",0.5);
                    isPause = false;
                }
            } else if ( key === 'S') {
                forward = true;
                backward = false;
                right = false;
                left = false;
            } else if ( key === 'A') {
                forward = false;
                backward = false;
                right = false;
                left = true;
            } else if ( key === 'W') {
                
            } else if ( key === 'D') {
                forward = false;
                backward = false;
                right = true;
                left = false;
            }
         };
        
        
        function createGUI( model, animations ) {

            var states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
            var emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

            //gui = new GUI();

            actions = {};

            for ( var i = 0; i < animations.length; i ++ ) {
                    var clip = animations[ i ];
                    var action = mixer.clipAction( clip );
                    actions[ clip.name ] = action;

                    if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
                            action.clampWhenFinished = true;
                            action.loop = THREE.LoopOnce;
                    }
            }

            
            activeAction = actions[ 'Idle' ];
            activeAction.play();
            
        }

        var controls = new OrbitControls( camera, renderer.domElement );

        createTomato();
        tomatoCreateTime = new Date();
        isTomatoExist = true;
        createBeauty();

        curr = "z+";
        prev = "";
        
        window.addEventListener( 'resize', onResize, false );
        
        createRadio();
        //setTimeout(function(){  }, 1000);
        createBeauty();
        
        //scene.fog = new THREE.Fog( 0xa0a0a0, 2, 1000 );
        setTimeout(function(){ animate(); }, 5000);
        
        
        
}

function createRadio(){
    var listener = new THREE.AudioListener();
    camera.add( listener );

    var audioElement = document.getElementById( 'music' );
    audioElement.play();

    var positionalAudio = new THREE.PositionalAudio( listener );
    positionalAudio.setMediaElementSource( audioElement );
    positionalAudio.setRefDistance( 1 );
    positionalAudio.setDirectionalCone( 180, 230, 0.1 );

    var helper = new PositionalAudioHelper( positionalAudio, 0.1 );
    positionalAudio.add( helper );

    //

    var gltfLoader = new GLTFLoader();
    gltfLoader.load( 'http://localhost:8383/PacMan/models/BoomBox.glb', function ( gltf ) {

            var boomBox = gltf.scene;
            boomBox.position.set( 0, 20, 300 );
            //boomBox.rotation.x = Math.PI * 0.5;
            boomBox.scale.set( 40, 40, 40 );

            boomBox.traverse( function ( object ) {

                    if ( object.isMesh ) {
                            object.scale.set(40, 40, 40);
                            object.material.envMap = cubeTexture;
                            
                            object.castShadow = true;

                    }

            } );

            boomBox.add( positionalAudio );
            scene.add( boomBox );
            

    } );

    // sound is damped behind this wall

    var wallGeometry = new THREE.BoxBufferGeometry( 2, 1, 0.1 );
    var wallMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0.5 } );

    var wall = new THREE.Mesh( wallGeometry, wallMaterial );
    wall.position.set( 0, 15, 330 );
    wall.scale.set(50, 50, 50);
    scene.add( wall );

}

function onResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

}

function createBeauty(){
    
    
    spotLight = new THREE.SpotLight( 0xffffff );
    spotLight2 = new THREE.SpotLight( 0xffffff );
    spotLight3 = new THREE.SpotLight( 0xffffff );


    spotLight.position.set( 135, 200, 0 );
    spotLight2.position.set( 0, 200, 135 );
    spotLight3.position.set( -135, 200, 0 );

    spotLight.castShadow = true;
    spotLight2.castShadow = true;
    spotLight3.castShadow = true;



    spotLight.angle = 0.13;
    spotLight.intensity = 0.3;
    spotLight.distance = 600;
    spotLight.decay = 0;

    spotLight2.angle = 0.13;
    spotLight2.intensity = 0.3;
    spotLight2.distance = 600;
    spotLight2.decay = 0;

    spotLight3.angle = 0.13;
    spotLight3.intensity = 0.3;
    spotLight3.distance = 600;
    spotLight3.decay = 0;


    
    
    scene.add( spotLight );
    scene.add( spotLight2 );
    scene.add( spotLight3 );
    
    var manager = new THREE.LoadingManager();
    manager.addHandler( /\.dds$/i, new DDSLoader() );
    
    new MTLLoader( manager )
        .setPath( 'http://localhost:8383/PacMan/models/StreetLamp/' )
        .load( 'streetlamp.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader( manager )
                    .setMaterials( materials )
                    .setPath( 'http://localhost:8383/PacMan/models/StreetLamp/' )
                    .load( 'streetlamp.obj', function ( object ) {


                            object.scale.set(0.8, 0.8, 0.8);
                            object.position.set(0, 0, playGroundSize/2);
                            var lamp1 = object.clone();
                            scene.add( lamp1 );
                            object.rotation.y = 1.5;
                            object.position.set(playGroundSize/2+5, 0, 0);
                            var lamp2 = object.clone();
                            scene.add( lamp2 );
                            object.rotation.y = -1.5;
                            object.position.set(-playGroundSize/2, 0, 0);
                            var lamp3 = object.clone();
                            scene.add( lamp3 );


                    } );

        } );
        
    new MTLLoader( manager )
        .setPath( 'http://localhost:8383/PacMan/models/fence2_middle2/' )
        .load( 'fence2_middle.mtl', function ( materials ) {

                materials.preload();

                new THREE.OBJLoader( manager )
                        .setMaterials( materials )
                        .setPath( 'http://localhost:8383/PacMan/models/fence2_middle2/' )
                        .load( 'fence2_middle.obj', function ( object ) {
                                
                                 
                                var texture = new THREE.TextureLoader().load("http://localhost:8383/PacMan/models/fence2_middle2/fence2.png");

                                object.traverse(function (child) {   // aka setTexture
                                    if (child instanceof THREE.Mesh) {
                                        child.material.map = texture;
                                    }
                                });
                                object.scale.set(1, 1, 1);
                                for (i = 0; i < grassGroundSize / 2; i+=25){
                                    object.position.set(i, 0, grassGroundSize/2);
                                    var plusWoodZ = object.clone();
                                    scene.add( plusWoodZ );
                                    
                                    object.position.set(-i, 0, grassGroundSize/2);
                                    var negWoodZ = object.clone();
                                    scene.add( negWoodZ );
                                    
                                    object.position.set(i, 0, -grassGroundSize/2);
                                    var plusWoodZ = object.clone();
                                    scene.add( plusWoodZ );
                                    
                                    object.position.set(-i, 0, -grassGroundSize/2);
                                    var negWoodZ = object.clone();
                                    scene.add( negWoodZ );
                                }
                                
                                
                                for (i = 0; i < grassGroundSize / 2; i+=25){
                                    object.rotation.y = 1.5;
                                    object.position.set(-grassGroundSize/2, 0, i );
                                    var plusWoodX = object.clone();
                                    scene.add( plusWoodX );
                                    
                                    object.position.set(-grassGroundSize/2, 0, -i);
                                    var negWoodX = object.clone();
                                    scene.add( negWoodX );
                                    
                                    object.rotation.y = 1.5;
                                    object.position.set(grassGroundSize/2, 0, i );
                                    var plusWoodX = object.clone();
                                    scene.add( plusWoodX );
                                    
                                    object.position.set(grassGroundSize/2, 0, -i);
                                    var negWoodX = object.clone();
                                    scene.add( negWoodX );
                                }
                                
                                
                                
                                


                        } );

        } );
         
        var cubeMaterial1 = new THREE.MeshPhongMaterial( { color: 0xccfffd, envMap: cubeTexture, refractionRatio: 0.98 } );
        var loader = new PLYLoader();
        loader.load( 'http://localhost:8383/PacMan/models/Lucy100k.ply', function ( geometry ) {

                //createScene( geometry, cubeMaterial1, cubeMaterial2, cubeMaterial3 );
                geometry.computeVertexNormals();

                var s = 0.1;

                var mesh = new THREE.Mesh( geometry, cubeMaterial1 );
                mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
                mesh.position.y = 80;
                mesh.position.z = -playGroundSize/2 - 60;
                mesh.position.x = playGroundSize/2 - 40;
                mesh.rotation.y = 3;
                scene.add( mesh );

        } );
                /*
         new MTLLoader( manager )
                .setPath( 'http://localhost:8383/PacMan/models/tomato/' )
                .load( 'tomato.mtl', function ( materials ) {

                        materials.preload();

                        new THREE.OBJLoader( manager )
                                .setMaterials( materials )
                                .setPath( 'http://localhost:8383/PacMan/models/tomato/' )
                                .load( 'tomato.obj', function ( object ) {

                                        
                                        object.scale.set(0.1, 0.1, 0.1);
                                        object.position.set(0, 0, 0);
                                        var sik = object.clone();
                                        scene.add( sik );
                                        

                                } );

                } );*/
}


function animate() {

        requestAnimationFrame( animate );

        render(); 

}


function render() {
        
        var currentTime = new Date();
        
        
        spotLight.target = modelRobot;
        spotLight2.target = modelRobot;
        spotLight3.target = modelRobot;
        
        
        if(totalShapeCounter < shapeLimit){
            createRandomShape();
        }
        
        if(isNewTargetComing){
            createRandomTargetShape();
            isNewTargetComing = false;
        }
        // aynisi gelince efekt
        if((currentTime - mainTime ) / 1000 > 10){
            scene.remove(targetShape);
            createRandomTargetShape();
            mainTime = currentTime;
        }
        
        if(!isTomatoExist){
            if((currentTime - noTomatoTime )/ 1000 > nextTomatoTime){
                createTomato();
                isTomatoExist = true;
                tomatoCreateTime = new Date();
            }
        }
        if(isTomatoExist){
            if((currentTime - tomatoCreateTime) / 1000 > 10 ){
                isTomatoExist = false;
                noTomatoTime = new Date();
                nextTomatoTime = getRandomInt(20,40);
                scene.remove(holyTomato);
            }
        }
        
        
        var delta = clock.getDelta();
        
        if(left && curr === "z+" ){
            modelRobot.rotation.y += Math.PI * 0.5;
            curr = "x+";
            left = 0;
        }
        if(left && curr === "x+"){
            modelRobot.rotation.y += Math.PI * 0.5;
            curr = "z-";
            left = 0;
        }
        if(left && curr === "z-"){
            modelRobot.rotation.y += Math.PI * 0.5;
            curr = "x-";
            left = 0;
        }
        if(left && curr === "x-"){
            modelRobot.rotation.y += Math.PI * 0.5;
            curr = "z+";
            left = 0;
        }
        
        
        if(right && curr === "z+" ){
            modelRobot.rotation.y += -Math.PI * 0.5;
            curr = "x-";
            right = 0;
        }
        if(right && curr === "x+"){
            modelRobot.rotation.y += -Math.PI * 0.5;
            curr = "z+";
            right = 0;
        }
        if(right && curr === "z-"){
            modelRobot.rotation.y += -Math.PI * 0.5;
            curr = "x+";
            right = 0;
        }
        if(right && curr === "x-"){
            modelRobot.rotation.y += -Math.PI * 0.5;
            curr = "z-";
            right = 0;
        }
        
        
        
        if(curr === "z+")
            modelRobot.position.z += robotSpeed;
            targetShape.position.z = modelRobot.position.z;
        if(curr === "x+")
            modelRobot.position.x += robotSpeed;
            targetShape.position.x = modelRobot.position.x;
        if(curr === "z-")
            modelRobot.position.z -= robotSpeed;
            targetShape.position.z = modelRobot.position.z;
        if(curr === "x-")
            modelRobot.position.x -= robotSpeed;
            targetShape.position.x = modelRobot.position.x;
       
       
        mixer.update( delta );
        
        for(var i = 0 ; i< allShapes.length;i++){
            if(allShapes[i].position.x-10 < modelRobot.position.x && modelRobot.position.x < allShapes[i].position.x+10 
                    && allShapes[i].position.z-10 < modelRobot.position.z && modelRobot.position.z < allShapes[i].position.z+10){
                eatShape(allShapes,allShapes[i]);
            }
        }
        
        if(modelRobot.position.x > 250 || modelRobot.position.x<-250 || modelRobot.position.z > 250 || modelRobot.position.z < -250){
            isOver = true;
            fadeToAction("Death",0.5);
            robotSpeed = 0;
        }
        
        if(isTomatoExist){
            if(holyTomato.position.x-10 < modelRobot.position.x && modelRobot.position.x < holyTomato.position.x+10 
                        && holyTomato.position.z-10 < modelRobot.position.z && modelRobot.position.z < holyTomato.position.z+10){
                    alert("ayvayı yedin");
            }
        }
        
        
        renderer.clear();
        renderer.render( scene, camera );
        
}





function createGameUnit(model){
    
    var map = new THREE.TextureLoader().load( 'http://localhost:8383/PacMan/textures/uv_grid_opengl.jpg' );
				map.wrapS = map.wrapT = THREE.RepeatWrapping;
				map.anisotropy = 16;

    var material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide } );

    
    if(model.modelName === "cube"){
        var geometry = new THREE.BoxBufferGeometry( model.size.x, model.size.y, model.size.z );
        
    }
    
    else if(model.modelName === "pyramid"){
        var geometry = new THREE.CylinderGeometry( 0, model.size.y, model.size.z ,4); 
    }
    
    else if (model.modelName === "sphere"){
        var geometry = new THREE.SphereGeometry( model.size.x, model.size.y, model.size.z );
        //var geometry = new THREE.TorusGeometry(6, 0.2,30, 60, Math.PI * 2);
    }
    
    //var material = new THREE.MeshBasicMaterial( material );
    
    var mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true; 
    mesh.receiveShadow = true;
   
    var x = getRandomInt(-240,240);
    var z = getRandomInt(-240,240);
    checkSamePosition(x,z);
    if(!isSame){
        model.position.x = x;
        model.position.z = z;
        
        mesh.position.set(model.position.x, model.position.y, model.position.z);
        mesh.position.y = 15; 
        allShapes.push(mesh);
        totalShapeCounter += 1;
        scene.add( mesh );
    }
}

function addMorph( rotation, mesh, clip, speed, duration, x, y, z, fudgeColor  ) {

        mesh = mesh.clone();
        mesh.material = mesh.material.clone();

        if ( fudgeColor ) {

                mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );

        }

        mesh.speed = speed;

        mixer.clipAction( clip, mesh ).
                setDuration( duration ).
        // to shift the playback out of phase:
                startAt( - duration * Math.random() ).
                play();
        
        mesh.position.set( x, y, z );
        mesh.rotation.y = - Math.PI / rotation;
        //mesh.rotation.x = Math.PI * - 0.5;
       
        mesh.scale.set(0.1,0.1,0.1);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );
        
        //setTimeout(function(){parrot = mesh}, 1000);
        morphs.push( mesh );

}

function createTree(model){
    // model

    var loader = new GLTFLoader().setPath( 'http://localhost:8383/PacMan/models/Tree/' );
    loader.load( 'tree.glb', function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh )	{

                            child.material.transparent = false;
                            child.material.alphaTest = 0.5;

                    }

            } );
            
            gltf.scene.scale.set(model.scale, model.scale, model.scale);
            gltf.scene.position.x = model.position.x;
            gltf.scene.position.y = model.position.y;
            gltf.scene.position.z = model.position.z;
            //gltf.scene.rotation.x = model.rotation.x;
            gltf.scene.rotation.y = model.rotation.y;
            gltf.scene.rotation.z = model.rotation.z;
            scene.add( gltf.scene );

           

    } );
}


function createPlane(model, isWater, hasTexture, others){
    
    var geometry, material, ground, textureLoader;
    
        
    if(!isWater && !others){
        
        geometry = new THREE.PlaneBufferGeometry( model.size.width, model.size.height );
        
        //var shadowMaterial = new THREE.ShadowMaterial();
        //shadowMaterial.opacity = 0;
        var materials = [
          new THREE.ShadowMaterial(),
          model.material
          
        ];
        material = new THREE.MeshStandardMaterial( model.material );
        ground = new THREE.Mesh( geometry, material );   
        ground.receiveShadow = true;
        
        
            
        // Texture Loader
        if(hasTexture){
            
            textureLoader = new THREE.TextureLoader();
            textureLoader.load( model.texturePath, function ( map ) {

                    map.wrapS = THREE.RepeatWrapping;
                    map.wrapT = THREE.RepeatWrapping;
                    map.anisotropy = 4;
                    map.repeat.set( 4, 4 );
                    material.map = map;
                    material.needsUpdate = true;

            } );   
        }
        
    }
    else if (isWater){
        geometry = new THREE.PlaneBufferGeometry( model.size.width, model.size.height );
        ground = new Water( geometry, {
                        
                        textureWidth: 512,
                        textureHeight: 512,
                        waterNormals: new THREE.TextureLoader().load( 'http://localhost:8383/PacMan/textures/waternormals.jpg', function ( texture ) {

                                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                            } ),
                        alpha: 1.0,
                        sunDirection: light.position.clone().normalize(),   
                        sunColor: 0xffffff,
                        waterColor: 0x001e0f,
                        distortionScale: 3.7,
                        fog: scene.fog !== undefined
        });
        //ground.mapping = THREE.CubeRefractionMapping;
        walter = ground;
    }
    else if (others){
        
        var planeMaterial = new THREE.MeshPhongMaterial( model.material );
        ground = new THREE.Mesh( new THREE.BoxBufferGeometry( model.size.widthx, model.size.widthy, model.size.height ), planeMaterial );

        ground.castShadow = true;
        ground.receiveShadow = true;
    }
    
    ground.rotation.x = model.rotation.x;
    ground.rotation.y = model.rotation.y;
    ground.rotation.z = model.rotation.z;

    ground.position.x = model.position.x;
    ground.position.y = model.position.y;
    ground.position.z = model.position.z;
    
    scene.add(ground);
    
}

function createModel(model){
     var loader = new GLTFLoader();
        loader.load( model.modelPath, function ( gltf ) {
            var mesh = gltf.scene.children[ 0 ];
            var clip = gltf.animations[ 0 ];
            addMorph(   
                        model.rotationVal, 
                        mesh, 
                        clip, 
                        model.speed, 
                        model.duration, 
                        model.position.x, 
                        model.position.y, 
                        model.position.z,
                        model.fudgeColor
                    );

        } );
}

function createText(text, x, y, z){
    // Font Loader
    var loader2 = new THREE.FontLoader();
    loader2.load( 'http://localhost:8383/PacMan/fonts/helvetiker_bold.typeface.json', function ( font ) {

        var textGeo = new THREE.TextBufferGeometry( text, {

                font: font,

                size: 12,
                height: 3,
                curveSegments: 12,

                bevelThickness: 2,
                bevelSize: 1,
                bevelEnabled: true

        } );

        textGeo.computeBoundingBox();
        var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        if(text == "YOU DIED USELESS BITCH")
            gameover = mesh;
        mesh.position.x = x; //-40;
        mesh.position.y = y; // 7;
        mesh.position.z = z; // -85;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );

    } );
}


function createRandomShape(){
    var i = getRandomInt(0,17);
    var newShape =  findGameUnitByName(shapeNameList[i]);
    createGameUnit(newShape);
}

function createRandomTargetShape(){
    var i = getRandomInt(0,8);
    var newShape =  findGameUnitByName(targetShapeNameList[i]);
    createTargetShape(newShape);
}

function createTomato(){
    var manager = new THREE.LoadingManager();
    manager.addHandler( /\.dds$/i, new DDSLoader() );
    var x = getRandomInt(-240,240);
    var z = getRandomInt(-240,240);
    checkSamePosition(x,z);
    if(!isSame){
        if(!isTomatoExist){
            new MTLLoader( manager )
                .setPath( 'http://localhost:8383/PacMan/models/tomato/' )
                .load( 'tomato.mtl', function ( materials ) {
                        materials.preload();
                        new THREE.OBJLoader( manager )
                                .setMaterials( materials )
                                .setPath( 'http://localhost:8383/PacMan/models/tomato/' )
                                .load( 'tomato.obj', function ( object ) {
                                        object.scale.set(0.1, 0.1, 0.1);
                                        object.position.set(x, 0, z);
                                        holyTomato = object.clone();
                                        scene.add( holyTomato );
                                } );

                } );
        }
    }            
}


function createTargetShape(model){
    
    var map = new THREE.TextureLoader().load( 'http://localhost:8383/PacMan/textures/uv_grid_opengl.jpg' );
				map.wrapS = map.wrapT = THREE.RepeatWrapping;
				map.anisotropy = 16;
    if(model.modelName === "cube"){
        var geometry = new THREE.BoxBufferGeometry( 4, 4, 4 );
    }
    else if(model.modelName === "pyramid"){
        var geometry = new THREE.CylinderGeometry( 0, 4, 4 , 4 ); 
    }
    
    else if (model.modelName === "sphere"){
        var geometry = new THREE.SphereGeometry( 4, 4, 4 );
    }
    
    var material = new THREE.MeshBasicMaterial( { map: map, side: THREE.DoubleSide } );
    
    targetShape = new THREE.Mesh( geometry, material );
    targetShape.position.set(modelRobot.position.x, modelRobot.position.y + 60 , modelRobot.position.z);
    targetShape.scale.set(2, 2, 2);
    scene.add( targetShape );
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkSamePosition(x,z){
    isSame = false;
    for(var i = 0; i< allShapes.length;i++){
        if(allShapes[i].position.x-30 < x && x < allShapes[i].position.x+30 && 
                allShapes[i].position.z-30 < z && z < allShapes[i].position.z+30){
            isSame = true;
        }
    }
}

function eatShape(array, element){
    scene.remove(element);
    totalPoint += element.po;
    const index = array.indexOf(element);
    array.splice(index, 1);
    totalShapeCounter --;
}

