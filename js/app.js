// Enemies our player must avoid
const enemyPrimaryPositionX = -150,
      enemyPrimaryPositionY = [50, 140, 220],
      addedSpeed = 20,
      amountBugs = 3;
      

let minSpeed = 50, 
    maxSpeed = 150;
      
const playingFieldWidth = 505,
      playingFieldHeight = 606;

const playerPrimaryPositionX = 200,
      playerPrimaryPositionY = 380,
      playerWidth = 80,
      playerHeight = 50,
      stepX = 100,
      stepY = 80,
      minPositionX = 0,
      maxPositionX = playingFieldWidth - stepX * 2,
      minPositionY = 0,
      maxPositionY = playingFieldHeight - stepY * 3;
let   playerScore = 0;

const background = document.querySelector('.background_field_player'),
      scoreField = document.createElement('div');
      scoreText = document.createElement('p');
      scoreNumber = document.createElement('p'),
      button = document.createElement('button'),
      alertWin = document.createElement('img'),
      alertLose = document.createElement('img'),

      mobileControler = document.createElement('div'),
      upButton = document.createElement('img'),
      rightButton = document.createElement('img'),
      downButton = document.createElement('img'),
      leftButton = document.createElement('img');

button.innerText = "change player";

alertWin.src = "images/win.png";
alertLose.src = "images/lose.png";

upButton.src = 'images/up.png';
rightButton.src = 'images/right.png';
downButton.src = 'images/down.png';
leftButton.src = 'images/left.png';

scoreField.classList.add('score__field');
scoreText.classList.add('score__field__text');
scoreNumber.classList.add('score__field__number');
button.classList.add('change_player');
alertWin.classList.add('alert');
alertWin.classList.add('hide');
alertLose.classList.add('alert');
alertLose.classList.add('hide');

mobileControler.classList.add('controller');
upButton.classList.add('up');
rightButton.classList.add('right');
downButton.classList.add('down');
leftButton.classList.add('left');

document.querySelector('body').prepend(alertWin);
document.querySelector('body').prepend(alertLose);
document.querySelector('body').prepend(scoreField);
scoreText.innerText = 'Player score:'
scoreNumber.innerText = playerScore;
scoreField.appendChild(button);
scoreField.appendChild(scoreText);
scoreField.appendChild(scoreNumber);

document.querySelector('body').appendChild(mobileControler);
mobileControler.appendChild(upButton);
mobileControler.appendChild(rightButton);
mobileControler.appendChild(downButton);
mobileControler.appendChild(leftButton);



const Character = function (x,y,sprite) {
    this.primaryPositionX = x;
    this.primaryPositionY = y;
    this.sprite = sprite;
}

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.primaryPositionX, this.primaryPositionY);
};

const Enemy = function (x, y, sprite) {
    Character.apply(this, [x, y, sprite]);
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;
    this.speed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.player = player;
};

Enemy.prototype = Object.create(Character.prototype)

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.primaryPositionX += this.speed * dt
    if (this.primaryPositionX > playingFieldWidth) {
        this.primaryPositionX = enemyPrimaryPositionX;
    }
    this.collision();

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.primaryPositionX, this.primaryPositionY);
};

Enemy.prototype.collision = function () {
    if (this.player.primaryPositionX < this.primaryPositionX + this.player.width &&
        this.player.primaryPositionX + this.player.width > this.primaryPositionX && 
        this.player.primaryPositionY < this.primaryPositionY + this.player.height && 
        this.player.primaryPositionY + this.player.height > this.primaryPositionY) {
            alertLose.classList.remove('hide');
            alertLose.classList.add('show');
            setTimeout(() => {
                minSpeed = 50;
                maxSpeed = 150;
                player.zeroingScore();
                respaunEnemies ();
                alertLose.classList.add('hide');
                alertLose.classList.remove('show');

            }, 1000)
            player.respawn();
    }
}

// Now write your own player class
const Player = function (x,y, sprite) {
    Character.apply(this, [x, y, sprite])
    this.width = playerWidth;
    this.height = playerHeight;
    this.stepX = stepX;
    this.stepY = stepY;
    this.score = playerScore;
}

Player.prototype = Object.create(Character.prototype);

// This class requires an update(), render() and
// a handleInput() method.

Player.prototype.update = function(dt) {
    if(this.primaryPositionY <= minPositionY) {
        setTimeout(() => {this.win()}, 1000)
    };
};

Player.prototype.respawn = function () {
    this.primaryPositionX = playerPrimaryPositionX;
    this.primaryPositionY = playerPrimaryPositionY;

}

Player.prototype.addScore = function () {
    if(this.primaryPositionY <= minPositionY) {
        playerScore++;
        scoreNumber.innerText = playerScore;
        alertWin.classList.remove('hide');
        alertWin.classList.add('show');
    };
}

Player.prototype.zeroingScore = function () {
    if (playerScore > 0) {
        playerScore = 0;
        scoreNumber.innerText = playerScore;
    }
}

Player.prototype.win = function () {
    this.respawn();
    respaunEnemies ();
    alertWin.classList.remove('show');
    alertWin.classList.add('hide');
}

Player.prototype.handleInput = function (keyNumber) {
    switch (keyNumber) {
        case 'left':
            if(this.primaryPositionX > minPositionX) {
                this.primaryPositionX += -this.stepX;
            } else {
                return;
            }
            break;
        case 'up':
            if(this.primaryPositionY > minPositionY) {
                this.primaryPositionY += -this.stepY;
                this.addScore();
                maxSpeed += addedSpeed;
                minSpeed += addedSpeed;
            } else {
                return;
            }
            break;
        case 'right':
            if (this.primaryPositionX < maxPositionX) {
                this.primaryPositionX += this.stepX;
            } else {
                return;
            }
            break;
        case 'down':
            if (this.primaryPositionY < maxPositionY) {
                this.primaryPositionY += this.stepY;
            } else {
                return;
            }
            break;
    }
};

Player.prototype.enterPlayer = function (url) {
    this.sprite = url;
}

background.addEventListener('click', (e) => {
    const target = e.target;
    if(target && target.classList.contains('player')) {
        const url = getComputedStyle(target).backgroundImage;
        const urlPlayer = url.substring(url.indexOf('images'), url.length - 2)
        player.enterPlayer(urlPlayer);
        background.classList.add('hide');
    };
});

button.addEventListener('click', () => {
    background.classList.toggle('hide');
})

const player = new Player (200, 380, 'images/pikachu.png')

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];

function respaunEnemies () {
    allEnemies = []
    for (let i = 0; i < amountBugs; i++) {
        allEnemies.push(new Enemy (enemyPrimaryPositionX, enemyPrimaryPositionY[i], "images/pokeball.png"));
    }
}
respaunEnemies ();

// 

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for button click and sends the buttons to your
// Player.handleInput() method.

mobileControler.addEventListener('dblclick', (e) => {
    e.preventDefault();
})

mobileControler.addEventListener('click', (e) => {
    const target = e.target;
    if(target && target.classList.contains('up') || target && target.classList.contains('right') || target && target.classList.contains('down') || target && target.classList.contains('left')) {
        player.handleInput(target.className);
    }
})
