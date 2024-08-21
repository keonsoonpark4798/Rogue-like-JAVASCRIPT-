import chalk from 'chalk';
import readlineSync from 'readline-sync';
import {start} from "./server.js";

class Player {
  constructor(hp,atk) {
    this._hp = hp;
    this._currentHP = hp;
    this._atk = atk;
  }

  get hp(){
    return this._hp;
  }
  set hp(value){
    this._hp = value;
  }

  get currenthp(){
    return this._currentHP;
  }
  set currenthp(value){
    this._currentHP = value;
  }

  get atk(){
    return this._atk;
  }
  set atk(value){
    this._atk = value;
  }

  attack(monster) {
    monster.damage(this._atk);
    return chalk.green(`몬스터에게 ${this._atk}의 데미지를 주었습니다.`);
  }
  damage(monsterAtk){
    this._currentHP -= monsterAtk;
  }
  heal(){
    this._currentHP = this._hp;
  }
  levelup(){
    const ran = Math.floor(Math.random() * 2) + 1;
    let num = 0;
    switch(ran)
    {
      case 1:
        num = Math.floor(Math.random() * 50) + 20;
        this._hp += num;
        break;
      case 2:
        num = Math.floor(Math.random() * 20) + 5;
        this._atk += num;
        break;
      default:
        break;
    }
  }
}

class Monster {
  constructor(stage,hp,atk) {
    this._hp = hp * stage * 0.5;
    this._atk = Math.ceil(atk * stage * 0.5);
  }

  get hp(){
    return this._hp;
  }
  set hp(value){
    this._hp = value;
  }

  get atk(){
    return this._atk;
  }
  set atk(value){
    this._atk = value;
  }

  attack(player) {
    player.damage(this._atk);
    return chalk.red(`몬스터가 ${this._atk}의 데미지를 입혔습니다.`);
  }
  damage(playerAtk){
    this._hp -= playerAtk;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 HP: ${player._currentHP}, Attack: ${player._atk}`,
    ) +
    chalk.redBright(
      `| 몬스터 정보 HP: ${monster._hp}, Attack: ${monster._atk} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let run = false;
  while(player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 도망친다.`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    switch(choice)
    {
        case "1" :
            logs.push(player.attack(monster));
            logs.push(monster.attack(player));
            break;
        case "2" :
            logs.push(chalk.green(`무사히 도망쳤다!`));
            run = true;
            break;
        default :
        logs.push(chalk.green(`잘못된 선택`));
            break;
    }

    if(monster.hp <= 0 || run === true)
    {
      logs.push(chalk.green(`스테이지${stage} 클리어!`));
      break;
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player(100,5);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage,100,2);
    await battle(stage, player, monster);
    
    if(player.hp <= 0){
      console.clear();
      console.log("Game Over");
      process.exit(0);
    }
    else {
      player.levelup();
      player.heal();
      stage++;
    }
  }
  
  console.clear();
  console.log("Game Clear");
}