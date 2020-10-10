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

import PlatformTesting from './platform-testing.js';
import MainMenu from './menus/main-menu.js';

var isWeb = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// if(this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone)
// {
  var config = {
    type:Phaser.AUTO,
    width:  isWeb ? 1280 * window.screen.width / 2560 : window.screen.width,//900 * window.screen.width / 760 ,
    height: isWeb ? 720 * window.screen.height / 1440 : window.screen.height,//400 * window.screen.height / 400,
    parent: "game",
    dom: {
      createContainer: true
    },
    physics:{
      default:'arcade',
      arcade: {
        gravity: { y: 1000}
      }
    },
    scene: [MainMenu, PlatformTesting/*, localGameSettings, settingsMenu, controlsMenu, creditsMenu,onlineLobby, localgame*/]
  };
var game = new Phaser.Game(config);

