import chalk from 'chalk';
import readlineSync from 'readline-sync';
import * as util from './lib/util.js';

class Player {
  constructor(name,hp,atk,x,luk,combo,def) {
    this._name = name;            // 플레이어 이름
    this._hp = hp;                // 최대 체력
    this._currentHP = hp;         // 현재 체력
    this._atk = atk;              // 최소 공격력
    this._x = x;                  // 최대 공격력 배율
    this._maxatk = atk + atk * x; // 최대 공격력
    this._luk = luk;              // 도망 확률
    this._combo = combo;          // 연속 공격 확률
    this._def = def;              // 방어확률
  }
  
  get name(){  // 이름 get,set
    return this._name;
  }
  set name(value){
    this._name = value;
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

  get x(){  // 최대 공격력 배율 get,set
    return this._x;
  }
  set x(value){
    this._x = value;
  }

  get maxatk(){  // 최대 공격력 get,set
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
    let damage =  util.random(this.atk,this.maxatk-this.atk+1);
    monster.damage(damage);
    return chalk.green(`몬스터에게 ${damage}의 데미지를 주었습니다.`);
  }
  Parrying(monster) {  // 방어 성공 함수
    let parryingdamage = Math.round(this._atk * 0.6);
    monster.damage(parryingdamage);
    return chalk.green(`몬스터에게 ${parryingdamage}의 데미지가 반사되었습니다.`);
  }
  damage(damage){  // 데미지 함수
    this._currentHP -= damage;
  }
  heal(){  // 스테이지 클리어시 체력 풀피 회복 함수
    this._currentHP = this._hp;
  }
  levelup(){  // 스테이지 클리어시 레벨업 함수
    console.log(chalk.green(`레벨업!!\n`));
    for(let i = 0; i<3; i++)
    {
      const ran = util.random(1,5);
      let num = 0;
      switch(ran)
      {
        case 1: // 체력 업
          num = util.random(20,30); // 20 ~ 50
          this.hp += num;
          console.log(chalk.green(`체력이 ${num}만큼 상승했습니다.`));
          break;
        case 2: // 최소 공격력 업
          num = util.random(5,15);  // 5 ~ 20
          this.atk += num;
          console.log(chalk.green(`공격력이 ${num}만큼 상승했습니다.`));
          break;
        case 3: // 최대 공격력 배율 업
          num = util.random(1,9)/10; // 0.1 ~ 0.9
          this.x += num;
          this.maxatk = Math.ceil(this.atk + this.atk * this.x);
          console.log(chalk.green(`최대공격력배율이 ${num}만큼 상승했습니다.`));
          break;
        case 4: // 도망 확률 업
          num = util.random(1,2); // 1 ~ 3
          this.luk += num;
          console.log(chalk.green(`도망확률이 ${num}만큼 상승했습니다.`));
          break;
        case 5: // 연속 공격 확률 업
          num = util.random(3,4); // 3 ~ 7
          this.combo += num;
          console.log(chalk.green(`연속 공격 확률이 ${num}만큼 상승했습니다.`));
          break;
        case 6: // 방어 수치 업(방어 확률 업)
          num = util.random(3,7);  // 3 ~ 10
          this.def += num;
          console.log(chalk.green(`방어 확률이 ${num}만큼 상승했습니다.`));
          break;
        default:
          break;
      }
    }
  }
}

class Monster extends Player{
  constructor(stage,hp,atk) {
    super(hp);
    let ran =  util.random(4,8) / 10; // 0.1 ~ 0.8
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
      `| ${player.name} HP: ${player.currentHp}, Attack: ${player.atk}-${player.maxatk}`,
    ) +
    chalk.redBright(
      `| 몬스터 정보 HP: ${monster.hp}, Attack: ${monster.atk} |`,
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
    let ran = util.random(1,99);
    switch(choice)
    {
        case "1" : // 공격
            logs.push(player.attack(monster));
            logs.push(monster.attack(player));
            break;
        case "2" : // 연속 공격
            if(ran<=player._combo) {
              logs.push(chalk.green(`이연참!`));
              util.sound();
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
              logs.push(chalk.green(`도망칠 수 없다!`));
              logs.push(monster.attack(player));
            }
            break;
        case "5" : // 아이템 획득
            if(ran<=10) {
              let randomItem = util.random(1,3);
              switch(randomItem)
              {
                case 1:
                  logs.push(chalk.green(`검을 발견했습니다!(공격력 1 증가)`));
                  player.atk += 1;
                  player.maxatk = player.atk + player.atk * player.x;
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
        logs.push(chalk.red(`잘못된 선택`));
            break;
    }
    logs.push(chalk.green(`${player.currentHp}만큼 체력이 남았습니다.`));
    if(monster.hp <= 0 || run === true)
    {
      logs.push(chalk.green(`스테이지${stage} 클리어!`));
      break;
    }
  }
};
const rise = async () => {
  const choice = readlineSync.question('\n\n휴식을 마치고 탑을 오르겠습니까?(yes/no)');
  switch(choice)
  {
    case 'yes':
      break;
    default:
      rise();
      break;
  }
};
export async function startGame(cheat, playername) {
  console.clear();
  if(playername == null)
    playername = "플레이어";

  let hp = 100;     // 초기 값 : 체력, 공격력, 최대공격력 배율, 도망 확률, 연속 공격 확률, 방어 확률
  let atk = 5;
  let maxatk = 0;
  let luk = 2;
  let combo = 25;
  let def = 55;

  if(cheat)
  {
    hp = 99999;
    atk = 99999;
    luk = 100;
    combo = 100;
    def = 100;
  }
  const player = new Player(playername,hp,atk,maxatk,luk,combo,def);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage,100,5);
    await battle(stage, player, monster);
    
    if(player.currentHp <= 0){
      console.clear();
      console.log(chalk.red("Game Over"));
      process.exit(0);
    }
    else {
      player.levelup();
      player.heal();
      await rise();
      stage++;
    }
  }
  
  console.clear();
  console.log("Game Clear");
}