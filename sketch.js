// Creating the variables

var edges;
var path, boy, coins, monster, wand, gameOver, restart;
var invisibleGround1, invisibleGround2;
var pathImg, boyImg, coinsImg, monsterImg, wandImg, gameOverImg, restartImg ;
var gameOverSound, runningSound, collectingCoinsSound;
var coinsG, wandG;
var score = 0;

// Game States

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload()
{
  // Loading the images, animations & sound

  pathImg = loadImage("path image.png");
  boyImg = loadAnimation("boy image 1.png", "boy image 2.png", "boy image 3.png", "boy image 4.png", "boy image 5.png", "boy image 6.png", "boy image 7.png", "boy image 8.png");
  coinsImg = loadImage("coins image.png");
  monsterImg = loadAnimation("monster image 1.png", "monster image 2.png", "monster image 3.png", "monster image 4.png", "monster image 5.png", "monster image 6.png", "monster image 7.png", "monster image 8.png", "monster image 9.png");
  wandImg = loadImage("monster wand image.png");
  gameOverImg = loadImage("game over images.png");
  restartImg = loadImage("restart image.png");
  gameOverSound = loadSound("mixkit-cartoon-whistle-game-over-606.wav");
  runningSound = loadSound("mixkit-game-level-music-689.wav");
  collectingCoinsSound = loadSound("mixkit-player-boost-recharging-2040.wav");
}

function setup()
{
  // Creating the canvas
  createCanvas(windowWidth,windowHeight);

  // Creating the path
  path = createSprite(width/2,250);
  path.addImage(pathImg);
  path.velocityX = -4;
  path.scale = 4;

  // Creating the boy sprite
  boy = createSprite(width/2,height/2,20,20);
  boy.addAnimation("Running",boyImg);
  boy.scale = 0.75;
  boy.debug = true;
  boy.setCollider("rectangle",0,0,150,300);

  // Creating the invisible ground 1
  invisibleGround1 = createSprite(width/2,310,350,20);
  invisibleGround1.visible = true;

  // Creating the invisible ground 2
  invisibleGround2 = createSprite(width/2,490,350,20);
  invisibleGround2.visible = true;

  // Creating the monster sprite
  monster = createSprite(220,height/2,20,20);
  monster.addAnimation("Chasing",monsterImg);
  monster.scale = 0.75;

  // Creating the game over sprite
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  // Creating the game over sprite
  restart = createSprite(width/2,height/2+90);
  restart.addImage(restartImg);
  restart.scale = 0.2
  restart.visible = false;

  // Creating the groups

  coinsG = new Group();
  wandG = new Group();
}

function draw() 
{
  // Creating the Game States

  if(gameState === PLAY)
  {
    // Setting the background color
    background(0);

    // Playing the running sound
    runningSound.play();

    // Movement of the boy using the mouse
    boy.y = World.mouseY;
    
    // Making the edges sprite
    edges = createEdgeSprites();
    
    // Resetting the path's position
    if(path.x < width/4)
      {
        path.x = width/2;
      }

    // Resetting the boys's position and adjusting the depth

    invisibleGround1.depth = boy.depth;
    boy.depth = boy.depth+1;

    invisibleGround2.depth = boy.depth;
    boy.depth = boy.depth+1;

    if(boy.collide(invisibleGround1))
    {
      boy.y = height/2 - 50; 
    }

    if(boy.collide(invisibleGround2))
    {
      boy.y = height/2 - 50; 
    }

    // Calling the coins & wand functions
    createCoins();
    createWand();
    
    // Destroying the group & increasing the score when the boy touches the coins
    if (coinsG.isTouching(boy)) 
    {
      runningSound.stop()
      collectingCoinsSound.play();
      coinsG.destroyEach();
      score = score + 150;
    }
    else
    {
      collectingCoinsSound.stop();
      runningSound.play()
    }
        
    // Ending, destroying and playing the sound when the boy touches the wand group
    if(wandG.isTouching(boy))
    {
      runningSound.stop()
      gameOverSound.play()
      wandG.destroyEach();
      gameState = END;
    }
  }    
 
  if(gameState === END)
  {     
    // Making the boy, monster & path invisible

    boy.visible = false;
    path.visible = false;
    monster.visible = false;
     
     
    // Making the game over & restart image visible
     
    gameOver.visible = true;
    restart.visible = true;
 

    // Destroying the coins & wand group
     
    coinsG.destroyEach();
    wandG.destroyEach();
     
         
    // Removing the velocity for the groups once the game is over
 
    coinsG.setVelocityXEach(0);
    wandG.setVelocityXEach(0);
    path.velocityX = 0;

    // Callling the function reset
    if(mousePressedOver(restart))
    {
      reset();
    }

  }
 
  drawSprites();
 
  // Displaying the score
  textSize(20);
  fill("Orange");
  text("Score: " + score,width-150,30);
}
 
 // Creating the functions for spawning coins & wand
 
 function createCoins()
 {
   if (World.frameCount % 200 == 0) 
   {
      coins = createSprite(Math.round(random(width/2+50, width-50)),height/2, 10, 10);
      //coins.debug = true;
      coins.setCollider("rectangle",0,0,200,300)
      coins.addImage(coinsImg);
      coins.scale = 0.5;
      coins.velocityX = -5;
      coins.lifetime = 200;
      coinsG.add(coins);
   }
  }
 
 function createWand()
 {
   if (World.frameCount % 530 == 0) 
   {
     wand = createSprite(Math.round(random(width/2 + 100, width-20)),height/2, 10, 10);
     // wand.debug = true;
     wand.setCollider("rectangle",0,0,200,300)
     wand.addImage(wandImg);
     wand.scale = 0.5;
     wand.velocityX = -4;
     wand.lifetime = 200;
     wandG.add(wand);
    }
  }

 // Creating the function reset

 function reset()
 {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    boy.visible = true;
    path.visible = true;
    monster.visible = true;
    path.velocityX = -4;
    score = 0;
  }