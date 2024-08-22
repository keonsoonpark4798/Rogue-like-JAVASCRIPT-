import chalk from 'chalk';
import readlineSync from 'readline-sync';
import {start} from "./server.js";

class Player {
  constructor(hp,atk,x,luk,combo,def) {
    this._hp = hp;                // 최대 체력
    this._currentHP = hp;         // 현재 체력
    this._atk = atk;              // 최소 공격력
    this._maxatk = x;             // 최대 공격력 배율
    this._luk = luk;              // 도망 확률
    this._combo = combo;          // 연속 공격 확률
    this._def = def;              // 방어확률
  }

  get hp(){  // 최대 체력 get,set
    return this._hp;
  }
  set hp(value){
    this._hp = value;
  }

  get currentHp(){  // 현재 체력 get,set
    return this._currentHP;
  }
  set currentHp(value){
    this._currentHP = value;
  }

  get atk(){  // 최소 공격력 get,set
    return this._atk;
  }
  set atk(value){
    this._atk = value;
  }

  get maxatk(){  // 최대 공격력 배율 get,set
    return this._maxatk;
  }
  set maxatk(value){
    this._maxatk = value;
  }

  get luk(){  // 도망 확률 get,set
    return this._luk;
  }
  set luk(value){
    this._luk = value;
  }

  get combo(){  // 연속 공격 확률 get,set
    return this._combo;
  }
  set combo(value){
    this._combo = value;
  }

  get def(){  // 방어 확률 get,set
    return this._def;
  }
  set def(value){
    this._def = value;
  }

  attack(monster) {  // 공격 함수
    let damage =  Math.floor(Math.random() * ((this._atk + Math.ceil(this._atk * this._maxatk)) - this._atk + 1) + this._atk);
    monster.damage(damage);
    return chalk.green(`몬스터에게 ${damage}의 데미지를 주었습니다.`);
  }
  Parrying(monster) {  // 방어 성공 함수
    monster.damage(this._atk * 0.6);
    return chalk.green(`몬스터에게 ${this._atk * 0.6}의 데미지가 반사되었습니다.`);
  }
  damage(damage){  // 데미지 함수
    this._currentHP -= damage;
  }
  heal(){  // 스테이지 클리어시 체력 풀피 회복 함수
    this._currentHP = this._hp;
  }
  levelup(){  // 스테이지 클리어시 레벨업 함수
    const ran = Math.floor(Math.random() * 5) + 1;
    let num = 0;
    switch(ran)
    {
      case 1: // 체력 업
        num = Math.floor(Math.random() * 30) + 20;
        this._hp += num;
        break;
      case 2: // 최소 공격력 업
        num = Math.floor(Math.random() * 15) + 5;
        this._atk += num;
        break;
      case 3: // 최대 공격력 배율 업
        num = Math.floor(Math.random() * 0.9) + 0.1;
        this._maxatk += num;
        break;
      case 4: // 도망 확률 업
        num = Math.floor(Math.random() * 2) + 1;
        this._luk += num;
        break;
      case 5: // 연속 공격 확률 업
        num = Math.floor(Math.random() * 4) + 3;
        this._combo += num;
        break;
      case 6: // 방어 수치 업(방어 확률 업)
        num = Math.floor(Math.random() * 7) + 3;
        this._def += num;
        break;
      default:
        break;
    }
  }
}

class Monster extends Player{
  constructor(stage,hp,atk) {
    super(hp);
    let ran =  (Math.floor(Math.random() * 6) + 5) / 10;
    this._hp = hp * stage * ran;
    this._atk = Math.ceil(atk * stage * ran);
  }

  attack(player) {
    player.damage(this._atk);
    return chalk.red(`몬스터가 ${this._atk}의 데미지를 입혔습니다.`);
  }
  damage(damage){
    this._hp -= damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 HP: ${player._currentHP}, Attack: ${player._atk}-${player._atk + Math.ceil(player._atk * player._maxatk)}`,
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
  while(player.currentHp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격(${player._combo}%) 3. 방어한다(${player._def}%) 4. 도망친다(${player._luk}%) 5. 주변을 살핀다(10%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    let ran = Math.random() * 99 + 1;
    switch(choice)
    {
        case "1" : // 공격
            logs.push(player.attack(monster));
            logs.push(monster.attack(player));
            break;
        case "2" : // 연속 공격
            if(ran<=player._combo) {
              logs.push(chalk.green(`이연참!`));
              logs.push(player.attack(monster));
              logs.push(player.attack(monster));
            }
            else {
              logs.push(chalk.green(`스킬 발동에 실패했습니다.`));
            }
            logs.push(monster.attack(player));
            break;
        case "3" : // 방어
            if(ran<=player._def) {
              logs.push(chalk.green(`방어에 성공했습니다.`));
              logs.push(player.Parrying(monster));
            }
            else {
              logs.push(chalk.green(`방어에 실패했습니다.`));
              logs.push(monster.attack(player));
            }
            break;
        case "4" : // 도망
            if(ran<=player._luk) {
              logs.push(chalk.green(`무사히 도망쳤다!`));
              run = true;
            }
            else {
              logs.push(chalk.green(`당신은 몬스터의 프레셔에 몸이 굳어 도망치지 못했습니다.`));
              logs.push(monster.attack(player));
            }
            break;
        case "5" : // 아이템 획득
            if(ran<=10) {
              let randomItem = Math.floor((Math.random() * 3) + 1);
              switch(randomItem)
              {
                case 1:
                  logs.push(chalk.green(`검을 발견했습니다!(공격력 1 증가)`));
                  player.atk += 1;
                  break;
                case 2:
                  logs.push(chalk.green(`런닝화를 발견했습니다!(도망확률 2 증가)`));
                  player.luk += 2;
                  break;
                case 3:
                  logs.push(chalk.green(`생명수를 발견했습니다!(체력 30 회복)`));
                  if(player.currentHp + 30 > player.hp)
                  {
                    player.currentHp = player.hp;
                  }
                  else {
                    player.currentHp += 30;
                  }
                  break;
                default:
                  break;
              }
            }
            else {
              logs.push(chalk.green(`당신은 주변을 살펴보았지만, 아무것도 보지 못했습니다.`));
            }
            logs.push(monster.attack(player));
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

export async function startGame(cheat) {
  console.clear();
  let hp = 100;     // 초기 값 : 체력, 공격력, 최대공격력 배율, 도망 확률, 연속 공격 확률, 방어 확률
  let atk = 5;
  let maxatk = 0;
  let luk = 2;
  let combo = 25;
  let def = 55;

  if(cheat == '1')
  {
    hp = 99999;
    atk = 99999;
    luk = 100;
    combo = 100;
    def = 100;
  }
  const player = new Player(hp,atk,maxatk,luk,combo,def);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage,100,3);
    await battle(stage, player, monster);
    
    if(player.currentHp <= 0){
      console.clear();
      console.log(chalk.red("Game Over"));
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