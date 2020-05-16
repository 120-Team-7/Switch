var gravityY = 600;

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.WEBGL,
    width: 1024,
    height: 576,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ Load, Menu, Instructions, Play, HUD, GameOver ]
}

// Define game
let game = new Phaser.Game(config);

// Game measurements & text placement
var screenWidth = game.config.width;
var screenHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
var textSpacer = 100;
var smallTextSpacer = 35;

// Text settings

// Game globals
var isGameOver = false;
var resetAudio = true;
var pointer;

// Obstacle settings
var obstacleDrag = 300;
var obsHealth = 3;

// Player ----------------------------------------------------------------------------------------------------
var player;

// Pointer & idle weapon
var pointer;
var idleWeaponDistance = 70;
var idleWeaponX;
var idleWeaponY;
var idleWeaponExists = true;

// Player statistics
var playerState = 0; // 0 = red, 1 = blue
var switchOnCooldown = false;
var switchCooldown = 1000;

var isInvuln = false; // invulnerability state after taking damage
var invulnDuration = 1000;

var pMaxHealth = 5;
var pCurrHealth = pMaxHealth;

// Player corruption
var usingCorruption = false;
var corruption = 0;
var maxCorruption = 5;
var corruptionDecayDelay = 1000;
var corruptionExpireDelay = 3000;
var blockCorruptionGain = 3;

var pDeathDelay = 3000;

// Player movement settings
var playerRunAccel = 30;
var playerStopDrag = 600;
var maxMoveVelocity = 300;

// Player attack settings
// Knife throw
var knifeSpeed = 1000;
var knifeThrowDamage = 1;
var knifeSecondDamage = 1;
var knifeSecondRadius = 2;
var knifeThrowROF = 200;

// Knife idle
var knifeMeleeROF = 500;
var knifeMeleeDamage = 3;

// Orb shot
var orbAccel = 50;  // Initial accel for orb on shoot
var orbAccelMult = 1.05; // Accel multiplier every frame after being shot
var orbMaxSpeed = 500;
var orbShootDamage = 1;
var orbShootROF = 2000;
var orbShotInvulnDuration = 500;    // Enemy orb damage invulnerability duration after being hit by shot orb

// Orb idle
var orbBlockStunDuration = 500;     // Enemy orb stun (unable to move) duration after being blocked by idle orb
var orbBlockInvulnDuration = 500;  // Enemy orb block invulnerability duration after being blocked by idle orb
var orbKnockbackVelocity = 500;     // Velocity magnitude of block knockback

// Enemies ----------------------------------------------------------------------------------------------------
var timedSwitchDelay = 6000;
var infiniteSpawnerDelay = 9000;
var enemySwitchPause = 1000;

// Enemy text
var enemyDestroyDelay = 1000;

// Shooting enemy config
var chaserConfig = {
    spawnPause: 1000,
    accel: 1000,
    maxVel: 350,
    moveDelay: 100,
    slowdownDelay: 1000,
    turnAroundMult: 1,
    predictMult: 1.5,
    predictMinDist: 200,
    bounce: 0.1,
    health: 10,
    damage: 1
}

// Shooter enemy config
var chaserConfig = {
    spawnPause: 1000,
    accel: 1000,
    maxVel: 350,
    moveDelay: 100,
    slowdownDelay: 1000,
    turnAroundMult: 1,
    predictMult: 1.5,
    predictMinDist: 200,
    bounce: 0.1,
    health: 10,
    damage: 1
}


// Game controls ----------------------------------------------------------------------------------------------------
// Player
var keyLeft, keyRight, keyUp, keyDown, keySwitch, keyDebug;

// Menu
var keyStart, keyInstructions, keyMute;

// Audio Settings
var globalVolume = 1;
var normalSoundRate = 1;
var volumeChange = 0.1;

// Audio

// Given co-ordinates of two points, start and end, and a chosen magnitude, returns a Vector2
// that has the same direction as the vector from the start point to end point, but has the chosen magnitude
function scaleVectorMagnitude(targetMagnitude, startX, startY, endX, endY) {
    // Calculate variables
    let xDist = endX - startX;
    let yDist = endY - startY;

    // Converts the xDist, yDist components to combine vector of same direction but with targetMagnitude
    // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is targetMagnitude and a, b are xDist, yDist
    let scaleFactor = Math.sqrt(Math.pow(Math.abs(xDist), 2) + Math.pow(Math.abs(yDist), 2)) / targetMagnitude;

    // Use scaleFactor to change components to proper magnitudes
    let resultX = xDist / scaleFactor;       
    let resultY = yDist / scaleFactor;

    return new Phaser.Math.Vector2(resultX, resultY);
}

function increaseCorruption(amount) {
    if(corruption + amount < maxCorruption){
        corruption += amount;
    } else {
        corruption = maxCorruption;
    }
}