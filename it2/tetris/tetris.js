// @flow

import { Tetrino} from './Tetrino.js';
import { Board } from './Board.js';

const things = 12;

/**
 * 
 * @param {int} a gives b
 * @param {int} b resolves a
 */
function test(a,b) {

}


/**
 * Starts the game
 */
function setup() {
  let divBrett = document.getElementById("brett");
  let divScore = document.getElementById("score");
  let b = new Board(divBrett);
  let tname = "T";
  let t = new Tetrino(tname);
  let score = 0;

  let timer = setInterval(gameEngine, 800);
  document.addEventListener("keydown", respondToUser);

  /**
   * Responds to user key-press
   * @param {Event} e 
   */
  function respondToUser(e) {
    t.render(b, true); // wipe tetrino from board
    switch (e.keyCode) {
      case 40:
        if (t.legalMove(b, 0, 0, 1)) t.rotate(1);
        break;
      case 38:
        if (t.legalMove(b, 0, 0, -1)) t.rotate(-1);
        break;
      case 37:
        if (t.legalMove(b, -1, 0, 0)) t.x--;
        break;
      case 39:
        if (t.legalMove(b, 1, 0, 0)) t.x++;
        break;
      case 32:
        clearInterval(timer);
        timer = setInterval(gameEngine, 30);
    }
    t.render(b);  // render tetrino onto board
  }
 
  /**
   * Invoked by setInterval - moves tetrinos
   * @param {Event} e 
   */
  function gameEngine(e) {
    if (t.legalMove(b, 0, 1, 0)) {
      t.y++;
    } else {
      if (t.y < 0) {
        gameOver();
        clearInterval(timer);
        return;
      }
      b.merge(t); // merge tetrino onto board
      let lines = b.complete();
      if (lines) {
        score += 2 ** (lines - 1);
        divScore.innerHTML = String(score);
      }
      tname = "IOJLSZT"
        .replace(tname, "")
        .charAt(Math.floor(Math.random() * 6));
      t = new Tetrino(tname);
      clearInterval(timer);
      timer = setInterval(gameEngine, 800);
    }
    b.render();
    t.render(b);
  }

  function gameOver() {
    document.getElementById("main").innerHTML = "Game over";
  }
}

setup();
