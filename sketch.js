var PLAY = 1;
var END = 0;
var NEXT = 2;

var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup;
var obstacles = [];

var score = 0;
var level = 0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("images/trex/trex1.png","images/trex/trex3.png","images/trex/trex4.png");
  trex_collided = loadAnimation("images/trex/trex_collided.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");

  for (let i = 0; i < 6; i++){
    obstacles[i] = loadImage("images/obstacles/obstacle" + (i+1).toString() + ".png")
  }
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  
  // jumpSound = loadSound("sound/jump.mp3");
  // dieSound = loadSound("sound/die.mp3");
  // checkPointSound = loadSound("sound/checkPoint.mp3"); 
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  // ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(camera.position.x ,60);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.position.x,100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(255);
  
  textSize(20)
  text("Score: "+ score, camera.position.x + width/2 - 150,50);
  text("Level: "+ level, camera.position.x - width/2 + 25,50);
  
  if (gameState===PLAY){

    invisibleGround.position.x = camera.position.x

    camera.position.x = trex.position.x;

    trex.velocityX = (6 + 3*score/100);
    score = score + Math.round(getFrameRate()/60);

    if(trex.position.x > ground.x){
      ground.x = camera.position.x - 300 + ground.width /2;
    }
    
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -14;
      // jumpSound.play();
    }
  
    trex.velocityY += 0.8;
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    // if (score>0 && score%100 === 0){
    //   checkPointSound.play();
    // }
  
    if(obstaclesGroup.isTouching(trex)){
      // dieSound.play();  
      gameState = END;   
    }
    if(score > 200 + 100*level){
      level++;
      gameState = NEXT;
    }
  }
  else if (gameState === END) {
    gameOver.position.x = camera.position.x;
    restart.position.x = camera.position.x;
    
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  } else if(gameState === NEXT){
    textAlign(CENTER, CENTER)
    // Next Level
    text("Level: " + level, camera.position.x, 60);
    restart.position.x = camera.position.x;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(camera.position.x + width/2,165,10,40);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    // cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth += 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x + width/2,165,10,40);
    // obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    obstacle.addImage(random(obstacles))
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  // ground.velocityX = -(6 + 3*score/100);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
