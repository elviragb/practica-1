/**
 * Codigo desarrollado por:
 * -
 * Germán López Gutiérrez
 * Ignacio Atance Loras
 * Fernando Martín Espina
 * Jorge Sánchez Sánchez
 * Elvira Gutiérrez Bartolomé
 * -
 */

import UsefulMethods from './useful-methods.js';
import Enemy from './Enemy.js';
import Player from './player.js';

//Escena para testeo de juego de plataformas
export default class Level_1 extends Phaser.Scene {
  //Constructor de la escena, con el identificador de la misma.
  constructor() {
    super('Level_1');
  }


  /**
   * Método que se ejecuta ANTES de cargar la página
   * En el se inicializan los sprites y otros elementos
   * como la barra de carga
   */
  preload() {

    // #region VARIABLES
    this.debugMode = true;

    //this.sys.game.config.width = 100;

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    this.xSpeed = 180; // 280
    this.ended = false;
    this.isPlayable = false;
    this.pointerOver = true;
    this.fallingP1 = false;

    // Movimiento con ratón o pulsación
    this.isMouseMoving = false;
    this.initialMouseX = 0;
    this.initialMouseY = 0;
    this.maxMouseDistance = 125;

    this.combatHappening = false;
    this.currentEnemy;

    this.DButton = this.input.keyboard.addKey('D');
    this.AButton = this.input.keyboard.addKey('A');
    this.WButton = this.input.keyboard.addKey('W');

    this.rightButton = this.input.keyboard.addKey('right');
    this.leftButton = this.input.keyboard.addKey('left');
    this.upButton = this.input.keyboard.addKey('space');
    // #endregion

    this.load.image('Law', 'assets/test/Law.jpg');
    this.load.image('Floor', 'assets/game-elements/ground.png');
    this.load.image('Circle-UI', 'assets/test/circle-ui.png');
    this.load.image('Rana', 'assets/test/Rana1.png');
    this.load.spritesheet('Character', 'assets/test/spritesheet-1.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  /**
   * Método que se ejecuta al comienzo del juego, cuandos se ha creado todo.
   */
  create() {
    

    this.movementPointerId = 0;
    this.input.addPointer(2);
    this.velocity = 0;
    
    // Se crea el objeto player en la escena.
    this.player = new Player({scene:this, x:UsefulMethods.RelativePosition(10, "x", this), y:UsefulMethods.RelativePosition(75, "y", this), texture:'Character', frame:4});
    this.player.create();

    //Creamos los enemigos
    this.createEnemies();

    this.testingText = this.add.text(UsefulMethods.RelativePosition(80, "x", this), UsefulMethods.RelativePosition(90, "y", this), this.enemy.enemyState, { fontFamily: '"Roboto Condensed"',fontFamily: '"brush_font"', fontSize: 21 , color: 'white'});
    this.testingText2 = this.add.text(UsefulMethods.RelativePosition(80, "x", this), UsefulMethods.RelativePosition(85, "y", this), "Energía: " + this.enemy.stamina, { fontFamily: '"Roboto Condensed"',fontFamily: '"brush_font"', fontSize: 21 , color: 'white'});
    this.testingText3 = this.add.text(UsefulMethods.RelativePosition(80, "x", this), UsefulMethods.RelativePosition(80, "y", this), "Vida: " + this.enemy.hp, { fontFamily: '"Roboto Condensed"',fontFamily: '"brush_font"', fontSize: 21 , color: 'white'});

    this.testingText.setScrollFactor(0);
    this.testingText2.setScrollFactor(0);
    this.testingText3.setScrollFactor(0);

    this.InitFloor();
    this.InitPlayer();
    this.InitColliders();
    this.InitMobileCircleUI();

    if (this.debugMode) {
      this.HandleMobileTouchMovement();
    }
    else {
      if (this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone) {
        this.HandleMobileTouchMovement();
      }
    }

    this.SetupCamera();

    this.ConfigureUI();
  }


  //Método para crear a los enemigos.
  createEnemies(){
    //Creación de enemigo 1
    this.enemy = new Enemy({scene:this, x:UsefulMethods.RelativePosition(50,"x", this), y:UsefulMethods.RelativePosition(75, "y", this), texture:'Rana', frame:0, attackTime:2, window: 1, stamina: 2, hp:2});
    this.enemy.create();

    this.enemy1Collision = this.physics.add.sprite(UsefulMethods.RelativePosition(40, "x", this), UsefulMethods.RelativePosition(75, "y", this), 'Rana', 4);
    this.enemy1Collision.setAlpha(0.2);

    this.enemy1Collision.displayWidth = UsefulMethods.RelativeScale(10, "x", this);
    this.enemy1Collision.scaleY = this.enemy1Collision.scaleX;

    //Creación de enemigo 2
    this.enemy2 = new Enemy({scene:this, x:UsefulMethods.RelativePosition(95,"x", this), y:UsefulMethods.RelativePosition(75, "y", this), texture:'Rana', frame:0, attackTime:2, window: 1, stamina: 2, hp:2});
    this.enemy2.create();

    this.enemy2Collision = this.physics.add.sprite(UsefulMethods.RelativePosition(85, "x", this), UsefulMethods.RelativePosition(75, "y", this), 'Rana', 4);
    this.enemy2Collision.setAlpha(0.2);

    this.enemy2Collision.displayWidth = UsefulMethods.RelativeScale(10, "x", this);
    this.enemy2Collision.scaleY = this.enemy2Collision.scaleX;

    //Creación de enemigo 3
    this.enemy3 = new Enemy({scene:this, x:UsefulMethods.RelativePosition(140,"x", this), y:UsefulMethods.RelativePosition(75, "y", this), texture:'Rana', frame:0, attackTime:2, window: 1, stamina: 2, hp:2});
    this.enemy3.create();

    this.enemy3Collision = this.physics.add.sprite(UsefulMethods.RelativePosition(130, "x", this), UsefulMethods.RelativePosition(75, "y", this), 'Rana', 4);
    this.enemy3Collision.setAlpha(0.2);

    this.enemy3Collision.displayWidth = UsefulMethods.RelativeScale(10, "x", this);
    this.enemy3Collision.scaleY = this.enemy3Collision.scaleX;
  }


  ConfigureUI() {
    this.UIContainer = this.add.container(this.cameras.main.worldView.x, this.cameras.main.worldView.y);
    this.UIContainer.add(this.circle_UI);
    this.UIContainer.add(this.circle_UI_Base);
  }

  /**
   * Configura la cámara (seguimiento, zoom, etc)
   */
  SetupCamera() {
    // Ambos zooms sirven
    // this.cameras.main.setZoom(1.3);
    // this.cameras.main.zoom = 0.5;

    // La cámara sigue al jugador
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  }

  /**
   * Configura la UI que únicamente será mostrada en móvil (pulsación sobre la pantalla)
   */
  InitMobileCircleUI() {
    this.circle_UI = this.add.sprite(UsefulMethods.RelativePosition(0, "x", this), UsefulMethods.RelativePosition(0, "y", this), 'Circle-UI').setInteractive();
    this.circle_UI.alpha = 0;
    this.circle_UI.scaleX = UsefulMethods.RelativeScale(0.031, "x", this);
    this.circle_UI_OriginalScale = this.circle_UI.scaleX;
    this.circle_UI_MinScale = UsefulMethods.RelativeScale(0.029, "x", this);
    this.circle_UI.scaleY = this.circle_UI.scaleX;
    this.circle_UI.setDepth(10000);

    this.circle_UI_Base = this.add.sprite(this.width, this.height, 'Circle-UI').setInteractive();
    this.circle_UI_Base.alpha = 0;
    this.circle_UI_Base.scaleX = UsefulMethods.RelativeScale(0.0023, "x", this);
    this.circle_UI_Base_OriginalScale = this.circle_UI_Base.scaleX;
    this.circle_UI_Base_MinScale = UsefulMethods.RelativeScale(0.0019, "x", this);
    this.circle_UI_Base.scaleY = this.circle_UI_Base.scaleX;
    this.circle_UI_Base.setDepth(11000);
  }

  /**
   * Configura el movimiento del personaje mediante la pulsación sobre la pantalla
   * en dispositivos móviles
   */
  HandleMobileTouchMovement() {
    // Cuando el presiona el click izquierdo en el estado de caminar se
    // guarda la coordenada inicial del ratón en el eje x
    this.input.on('pointerdown', function (pointer) {
      if (this.isMouseMoving === false) {
        this.movementPointerId = pointer.id;
        this.isMouseMoving = true;
        this.initialMouseX = pointer.x;
        this.initialMouseY = pointer.y;
        this.circle_UI_Base.x = this.initialMouseX;
        this.circle_UI_Base.y = this.initialMouseY;
        this.circle_UI.x = Phaser.Math.Clamp(pointer.x, this.initialMouseX - 150, this.initialMouseX + 150);
        this.circle_UI.y = Phaser.Math.Clamp(pointer.y, this.initialMouseY - 150, this.initialMouseY + 150);
        this.tweens.add({
          targets: this.circle_UI,
          alpha: 0.65,
          scaleX: this.circle_UI_OriginalScale,
          scaleY: this.circle_UI_OriginalScale,
          ease: 'Linear',
          duration: 80,
          yoyo: false,
          repeat: 0
        });
        this.tweens.add({
          targets: this.circle_UI_Base,
          alpha: 0.65,
          scaleX: this.circle_UI_Base_OriginalScale,
          scaleY: this.circle_UI_Base_OriginalScale,
          ease: 'Linear',
          duration: 80,
          yoyo: false,
          repeat: 0
        });
      }
    }, this);

    // Cuando se mantiene presionado el click izquierdo del ratón y
    // se mueve el ratón, se resta la posición anterior del ratón en el eje x
    // a la actual y en función del valor obtenido, el personaje se mueve en una u
    // otra dirección
    this.input.on('pointermove', function (pointer) {
      // Comprobamos si el id del puntero es el mismo que inició el movimiento
      if (this.movementPointerId === pointer.id) {
        var module = UsefulMethods.vectorModule(pointer.x - this.initialMouseX, pointer.y - this.initialMouseY);
        //var module = Math.sqrt(Math.pow(pointer.x - this.initialMouseX, 2) + Math.pow(pointer.y - this.initialMouseY, 2));
        var xMax = Math.abs((pointer.x - this.initialMouseX) / module) * this.maxMouseDistance;
        var yMax = Math.abs((pointer.y - this.initialMouseY) / module) * this.maxMouseDistance;

        this.circle_UI.x = Phaser.Math.Clamp(pointer.x, this.initialMouseX - xMax, this.initialMouseX + xMax);
        this.circle_UI.y = Phaser.Math.Clamp(pointer.y, this.initialMouseY - yMax, this.initialMouseY + yMax);
        //this.circle_UI.x = pointer.x;
        //this.circle_UI.y = pointer.y;
      }
    }, this);

    // Cuando se suelta el click izquierdo del ratón, el personaje
    // detiene su movimiento horizontal
    this.input.on('pointerup', function (pointer) {
      // Comprobamos si el id del puntero es el mismo que inició el movimiento
      if (this.movementPointerId === pointer.id) {
        this.isMouseMoving = false;
        //this.circle_UI.alpha = 0;
        this.tweens.add({
          targets: this.circle_UI,
          alpha: 0,
          scaleX: this.circle_UI_MinScale,
          scaleY: this.circle_UI_MinScale,
          ease: 'Linear',
          duration: 80,
          yoyo: false,
          repeat: 0
        });
        this.tweens.add({
          targets: this.circle_UI_Base,
          alpha: 0,
          scaleX: this.circle_UI_Base_MinScale,
          scaleY: this.circle_UI_Base_MinScale,
          ease: 'Linear',
          duration: 80,
          yoyo: false,
          repeat: 0
        });
      }
    }, this);
  }

  /**
   * Inicializa la superficie sobre la que el personaje camina (sin hacer)
   */
  InitFloor() {
    this.floor = this.physics.add.sprite(UsefulMethods.RelativePosition(0, "x", this), UsefulMethods.RelativePosition(105, "y", this), 'Floor', 4);
    this.floor.body.allowGravity = false;
    this.floor.body.immovable = true;
    this.floor.scaleX = UsefulMethods.RelativeScale(0.1, "x", this);
    this.floor.scaleY = this.floor.scaleX;

    this.floor1 = this.physics.add.sprite(UsefulMethods.RelativePosition(45, "x", this), UsefulMethods.RelativePosition(105, "y", this), 'Floor', 4);
    this.floor1.body.allowGravity = false;
    this.floor1.body.immovable = true;

    this.floor2 = this.physics.add.sprite(UsefulMethods.RelativePosition(90, "x", this), UsefulMethods.RelativePosition(105, "y", this), 'Floor', 4);
    this.floor2.body.allowGravity = false;
    this.floor2.body.immovable = true;

    this.floor3 = this.physics.add.sprite(UsefulMethods.RelativePosition(135, "x", this), UsefulMethods.RelativePosition(105, "y", this), 'Floor', 4);
    this.floor3.body.allowGravity = false;
    this.floor3.body.immovable = true;
  }

  /**
   * Configura al jugador y su representación en pantalla
   */
  InitPlayer() {
// MOVER A SCENE LOADING
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('Character', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'stopped',
      frames: [{ key: 'Character', frame: 2 }],
      frameRate: 4,
      repeat: -1
    });
  }

  /**
   * Inicializa la relación entre los distintos elementos que
   * pueden colisionar entre sí
   */
  InitColliders() {
    this.walls = this.physics.add.staticGroup();
    this.wall_left = this.walls.create(-25, this.height / 2, 'wall');
    this.wall_left.setAlpha(0);
    this.wall_right = this.walls.create(825, this.height / 2, 'wall');
    this.wall_right.setAlpha(0);

    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.player, this.floor1);
    this.physics.add.collider(this.player, this.floor2);
    this.physics.add.collider(this.player, this.floor3);

    this.physics.add.collider(this.enemy, this.floor1);
    this.physics.add.collider(this.enemy1Collision, this.floor1);

    this.physics.add.collider(this.enemy2, this.floor2);
    this.physics.add.collider(this.enemy2Collision, this.floor2);

    this.physics.add.collider(this.enemy3Collision, this.floor3);
    this.physics.add.collider(this.enemy3, this.floor3);

    //Función que se ejecutará al chocar con el primer enemigo del nivel (hacer una por enemigo)
    var firstCombat = function(){
      this.player.canMove = false;
      this.combatHappening = true;
      this.currentEnemy = this.enemy;
      this.enemy.Attack();
      this.enemy1Collision.destroy();
    };

    //Función que se ejecutará al chocar con el segundo enemigo del nivel (hacer una por enemigo)
    var secondCombat = function(){
      this.player.canMove = false;
      this.combatHappening = true;
      this.currentEnemy = this.enemy2;
      this.enemy2.Attack();
      this.enemy2Collision.destroy();
    };

    //Función que se ejecutará al chocar con el tercer enemigo del nivel (hacer una por enemigo)
    var thirdCombat = function(){
      this.player.canMove = false;
      this.combatHappening = true;
      this.currentEnemy = this.enemy3;
      this.enemy3.Attack();
      this.enemy3Collision.destroy();
    };

    //Creamos un trigger entre el jugador y una zona cercana al primer enemigo
    this.physics.add.overlap(this.player, this.enemy1Collision, firstCombat, null, this);

    //Creamos un trigger entre el jugador y una zona cercana al segundo enemigo
    this.physics.add.overlap(this.player, this.enemy2Collision, secondCombat, null, this);

    //Creamos un trigger entre el jugador y una zona cercana al tercer enemigo
    this.physics.add.overlap(this.player, this.enemy3Collision, thirdCombat, null, this);
  }

  /**
   * Método que se ejecuta constantemente, en el de momento solo están los controles de movimiento.
   */
  update(delta) {

    //Si currentEnemy existe (lo hace en caso de estar en un combate) se actualizan los textos con sus datos para testear.
    if(this.currentEnemy != null){
      this.testingText.setText(this.currentEnemy.enemyState); 
      this.testingText2.setText("Energía: " + this.currentEnemy.stamina); 
      this.testingText3.setText("Vida: " + this.currentEnemy.hp); 
    }
    
    // Se actualiza en cada frame la posición de la UI con respecto a la cámara.
    this.UIContainer.x = this.cameras.main.worldView.x;
    this.UIContainer.y = this.cameras.main.worldView.y;
    // #region Teclas y movimiento
    this.player.update(delta);


    //Si se está combatiendo, se comprueba si se acaba de pulsar el espacio. En caso de ser así, y si el enemigo está en estado de parry, se le aplica un parry.
    //Si se ha pulsado espacio, y el enemigo está TIRED, se le quita vida. 
    //Si se pulsa y el enemigo está atacando, se penalizará al jugador, quitandole vida o algo similar (pendiente de programar).
    if(this.combatHappening){
      var spacePressed = Phaser.Input.Keyboard.JustDown(this.upButton);

      if(spacePressed && this.currentEnemy.enemyState == this.currentEnemy.enemyStates.PARRY){
        this.currentEnemy.GetParried();
      }else if(spacePressed && this.currentEnemy.enemyState == this.currentEnemy.enemyStates.TIRED){
        this.currentEnemy.getAttacked();
        console.log('Recibi ataque');
        if(this.currentEnemy.hp == 0){
          this.currentEnemy.die();
          this.combatHappening = false;
          this.player.canMove=true;
        }
      }
    }
  }

}