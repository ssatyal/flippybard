// Creating 'main' state that will contain the game
var mainState = {
  preload: function(){
    // load the bird sprite
    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.audio('jump', 'assets/jump.wav');
  },

  create: function(){
    //if this is not a desktop (it's mobile)
    if (game.device.desktop == false) {
      //set the scaling mode to SHOW_ALL to show all the game
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      //set min and max size for game
      //here the min is half the game size
      //here the max is the original game size
      game.scale.setMinMax(game.width/2, game.height/2,
      game.width, game.height);

      //center the game horizontally and vertically
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }

    // change the background color of the game to blue
    game.stage.backgroundColor = "#71C5CF";

    //sets physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //display bird at position x=100 and y=245
    this.bird = game.add.sprite(100, 245, 'bird');

    //add physics to bird
    //needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    //add gravity to bird to make it fall
    this.bird.body.gravity.y = 1000;

    // call 'jump' function when spacekey hit
    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    //create and empty group
    this.pipes = game.add.group();

    //sends pipes flying by!
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    //keeping track of the score
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",
      {font: "30px Arial", fill: "#FFFFFF"});

    //move the anchor of pivot to the left and down
    this.bird.anchor.setTo(-0.2, 0.5);
    this.jumpSound = game.add.audio('jump');

    //call 'jump' function when tap/click on screen
    game.input.onDown.add(this.jump, this);
  },

  update: function() {
    // if the bird is out of the screen (too high or low)
    //call restartGame function
    if (this.bird.y < 0 || this.bird.y > 490)
      {this.restartGame()};
    game.physics.arcade.overlap(
      this.bird, this.pipes, this.hitPipe, null, this);
    if (this.bird.angle < 20){
      this.bird.angle += 1};
  },

  //make the bird jump
  jump: function(){
    if (this.bird.alive == false)
      return;
    //add vertical velocity to bird
    this.bird.body.velocity.y = -350;

    //create animation on bird
    var animation = game.add.tween(this.bird);

    //change angle of bird to -20 degrees in 100 millisec.
    animation.to({angle: -20}, 100);

    //start the animation
    animation.start();
    this.jumpSound.play();
  },

  //restart the game
  restartGame: function(){
    //start the 'main' state, which restarts the game
    game.state.start('main');
  },

  addOnePipe: function(x, y){
    //create a pipe at the position of x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    //add the pipe to our previously created group
    this.pipes.add(pipe);

    //enable physics on pipe
    game.physics.arcade.enable(pipe);

    //add velocity to pipe to move left
    pipe.body.velocity.x = -200;

    //auto kill the pipe when its no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    //randomly pick a number between 1 and 5
    //this will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    //add the 6 pipes
    //with one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++){
      if (i != hole && i != hole + 1)
      this.addOnePipe(400, i * 60 + 10);
    };

    this.score += 1;
    this.labelScore.text = this.score;
  },

  hitPipe: function(){
    //if the bird has already hit a pipe, do nothing
    //bird will already be falling
    if (this.bird.alive == false)
      return;

    //set the alive property of the bird to false
    this.bird.alive = false;

    //prevent new pipes from appearing
    game.time.events.remove(this.timer);

    //go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
  }
};

//initialize phaser, create 400px by 490px game
var game = new Phaser.Game(400, 490);

//add and start the main state to start game
game.state.add('main', mainState, true);
