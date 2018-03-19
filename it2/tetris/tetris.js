// @flow

import { Tetrino } from './Tetrino.js';
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
  let board = new Board(divBrett);
  let tname = "T";
  let tetrino = new Tetrino(tname);
  let score = 0;
  let linesCleared = 0;

  let timer = setInterval(gameEngine, 800);
  document.addEventListener("keydown", respondToUser);

  /**
   * Responds to user key-press
   * @param {Event} e 
   */
  function respondToUser(e) {
    tetrino.render(board, true); // wipe tetrino from board
    switch (e.keyCode) {
      case 40:
        if (tetrino.legalMove(board, 0, 0, 1)) tetrino.rotate(1);
        break;
      case 38:
        if (tetrino.legalMove(board, 0, 0, -1)) tetrino.rotate(-1);
        break;
      case 37:
        if (tetrino.legalMove(board, -1, 0, 0)) tetrino.x--;
        break;
      case 39:
        if (tetrino.legalMove(board, 1, 0, 0)) tetrino.x++;
        break;
      case 32:
        clearInterval(timer);
        timer = setInterval(gameEngine, 30);
    }
    tetrino.render(board);  // render tetrino onto board
  }
 
  /**
   * Invoked by setInterval - moves tetrinos
   * @param {Event} e 
   */
  function gameEngine(e) {
    if (tetrino.legalMove(board, 0, 1, 0)) {
      tetrino.y++;
    } else {
      if (tetrino.y < 0) {
        gameOver();
        clearInterval(timer);
        return;
      }
      board.merge(tetrino); // merge tetrino onto board
      let lines = board.complete();
      if (lines) {
        linesCleared++;
        score += 3 ** (lines);
        divScore.innerHTML = String(score);
      }
      tname = "IOJLSZT"
        .replace(tname, "")
        .charAt(Math.floor(Math.random() * 6));
      tetrino = new Tetrino(tname);
      clearInterval(timer);
      timer = setInterval(gameEngine, newSpeed(linesCleared));
    }
    board.render();
    tetrino.render(board);
  }

  function gameOver() {
    document.getElementById("main").innerHTML = `
      <h1>Game over</h1>
      You scored ${score} points and cleared ${linesCleared} lines
    `
  }
}

setup();

/** Pure functions */

let newSpeed = (n) => Math.max(100,800 - 50*Math.floor(n/10));