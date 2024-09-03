import chalk from 'chalk';
import readlineSync from 'readline-sync';
import * as util from './lib/util.js';
import * as achieve from './lib/achievenemt.js';

class Player {
  constructor(name, hp, atk, x, luk, combo, def) {
    this._name = name; // 플레이어 이름
    this._hp = hp; // 최대 체력
    this._currentHP = hp; // 현재 체력
    this._atk = atk; // 최소 공격력
    this._x = x; // 최대 공격력 배율
    this._maxatk = atk + atk * x; // 최대 공격력
    this._luk = luk; // 도망 확률
    this._combo = combo; // 연속 공격 확률
    this._def = def; // 방어확률
  }

  get name() {
    // 이름 get,set
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get hp() {
    // 최대 체력 get,set
    return this._hp;
  }
  set hp(value) {
    this._hp = value;
  }

  get currentHp() {
    // 현재 체력 get,set
    return this._currentHP;
  }
  set currentHp(value) {
    this._currentHP = value;
  }

  get atk() {
    // 최소 공격력 get,set
    return this._atk;
  }
  set atk(value) {
    this._atk = value;
  }

  get x() {
    // 최대 공격력 배율 get,set
    return this._x;
  }
  set x(value) {
    this._x = value;
  }

  get maxatk() {
    // 최대 공격력 get,set
    return this._maxatk;
  }
  set maxatk(value) {
    this._maxatk = value;
  }

  get luk() {
    // 도망 확률 get,set
    return this._luk;
  }
  set luk(value) {
    this._luk = value;
  }

  get combo() {
    // 연속 공격 확률 get,set
    return this._combo;
  }
  set combo(value) {
    this._combo = value;
  }

  get def() {
    // 방어 확률 get,set
    return this._def;
  }
  set def(value) {
    this._def = value;
  }

  attack(monster) {
    // 공격 함수
    let damage = util.random(this.atk, this.maxatk - this.atk + 1);
    monster.damage(damage);
    return chalk.green(`몬스터에게 ${damage}의 데미지를 주었습니다.`);
  }
  Parrying(monster) {
    // 방어 성공 함수
    let parryingdamage = Math.round(this._atk * 0.6);
    monster.damage(parryingdamage);
    return chalk.green(`몬스터에게 ${parryingdamage}의 데미지가 반사되었습니다.`);
  }
  damage(damage) {
    // 데미지 함수
    this._currentHP -= damage;
  }
  heal() {
    // 스테이지 클리어시 체력 풀피 회복 함수
    this._currentHP = this._hp;
  }
  levelup() {
    // 스테이지 클리어시 레벨업 함수
    console.log(chalk.green(`레벨업!!\n`));
    for (let i = 0; i < 3; i++) {
      const ran = util.random(1, 6);
      let num = 0;
      switch (ran) {
        case 1: // 체력 업
          num = util.random(20, 50); // 20 ~ 50
          this.hp += num;
          console.log(chalk.green(`체력이 ${num}만큼 상승했습니다.`));
          break;
        case 2: // 최소 공격력 업
          num = util.random(5, 20); // 5 ~ 20
          this.atk += num;
          console.log(chalk.green(`공격력이 ${num}만큼 상승했습니다.`));
          break;
        case 3: // 최대 공격력 배율 업
          num = util.random(1, 9) / 10; // 0.1 ~ 0.9
          this.x += num;
          this.maxatk = Math.ceil(this.atk + this.atk * this.x);
          console.log(chalk.green(`최대공격력배율이 ${num}만큼 상승했습니다.`));
          break;
        case 4: // 도망 확률 업
          num = util.random(1, 3); // 1 ~ 3
          this.luk += num;
          console.log(chalk.green(`도망확률이 ${num}만큼 상승했습니다.`));
          break;
        case 5: // 연속 공격 확률 업
          num = util.random(3, 7); // 3 ~ 7
          this.combo += num;
          console.log(chalk.green(`연속 공격 확률이 ${num}만큼 상승했습니다.`));
          break;
        case 6: // 방어 수치 업(방어 확률 업)
          num = util.random(3, 10); // 3 ~ 10
          this.def += num;
          console.log(chalk.green(`방어 확률이 ${num}만큼 상승했습니다.`));
          break;
        default:
          break;
      }
    }
  }
}

class Monster extends Player {
  // 몬스터 객체
  constructor(stage, hp, atk) {
    super(hp);
    let ran = util.random(4, 6) / 10; // 0.4 ~ 0.6
    this._hp = hp * stage * ran;
    this._atk = Math.ceil(atk * stage * ran);
    this.pattern = false; // 일반 몬스터는 패턴 x
    this.flag = false; // 일반 몬스터는 패턴 x
  }

  attack(player) {
    // 공격 함수
    player.damage(this._atk);
    return chalk.red(`몬스터가 ${this._atk}의 데미지를 입혔습니다.`);
  }
  damage(damage) {
    // 데미지 함수
    this._hp -= damage;
  }
}

class Boss extends Player {
  // 보스 객체
  constructor(hp, atk) {
    super(hp);
    this._hp = hp;
    this._atk = atk;
    this._shield = 100; // 실드
    this._pattern = false; // 패턴중인지 여부
    this.flag = true; // 패턴을 했는지 안 했는지 체크
    this._count = 5; // 5턴간 보스 패턴 실행
  }

  get shield() {
    // 실드 get,set
    return this._shield;
  }
  set shield(value) {
    this._shield = value;
  }

  get count() {
    // 카운트 get,set
    return this._count;
  }
  set count(value) {
    this._count = value;
  }

  get pattern() {
    // 패턴 get,set
    return this._pattern;
  }
  set pattern(value) {
    this._pattern = value;
  }

  attack(player) {
    // 공격 함수
    if (this.hp < 250 && this.pattern === true) {
    } else {
      player.damage(this._atk);
      return chalk.red(`보스가 ${this._atk}의 데미지를 입혔습니다.`);
    }
  }
  damage(damage) {
    // 데미지 함수
    if (this.hp < 250 && this.pattern === true) {
      // 패턴중일땐 체력이 아닌 실드가 먼저 깎임
      this.shield -= damage;
      if (this.shield < 0)
        // 남은 실드보다 더 큰 데미지를 입었으면 남은 데미지는 체력을 깎음
        this.hp += this.shield;
    } else {
      this.hp -= damage;
    }
  }
  countdown(player) {
    // 카운트다운 함수
    if (this.shield <= 0) {
      // 실드가 깨졌다면 패턴 파훼 완료
      this.pattern = false;
      this.flag = false;
      return chalk.green(`실드가 깨지며 보스의 집중이 깨졌습니다.`);
    }

    if (this.hp < 250 && this.pattern === true && this.count > 0) {
      // 실드가 남아있고 카운트가 남았다면 실드와 남은 턴 카운트을 알려줌
      this.count--;
      return chalk.red(
        `보스가 힘을 모으고 있습니다.\n남은 실드 : ${this.shield}\n남은 턴 : ${this.count}`,
      );
    }

    if (this.count <= 0) {
      // 카운트가 0이 되면 보스가 강력한 딜을 함
      player.damage(300);
      this.pattern = false;
      this.flag = false;
      return chalk.red(`보스가 힘을 방출합니다.\n 300의 데미지를 입었습니다.`);
    }
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        // 플레이어 정보
        `| ${player.name} HP: ${player.currentHp}, Attack: ${player.atk}-${player.maxatk}`,
      ) +
      chalk.redBright(
        // 몬스터 정보
        `| 몬스터 정보 HP: ${monster.hp}, Attack: ${monster.atk} |`,
      ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  // 배틀
  let logs = [];
  let run = false;
  while (player.currentHp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        // * 기능 추가 : 주변을 살펴 일정 확률로 아이템 획득
        `\n1. 공격한다 2. 연속 공격(${player._combo}%) 3. 방어한다(${player._def}%) 4. 도망친다(${player._luk}%) 5. 주변을 살핀다(10%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    let ran = util.random(1, 99);
    switch (choice) {
      case '1': // 공격
        logs.push(player.attack(monster));
        if (monster.pattern != true) logs.push(monster.attack(player));
        break;
      case '2': // 연속 공격
        if (ran <= player._combo) {
          logs.push(chalk.green(`이연참!`));
          util.sound(); // 연속 공격 성공시 사운드 출력
          logs.push(player.attack(monster));
          logs.push(player.attack(monster));
        } else {
          logs.push(chalk.green(`스킬 발동에 실패했습니다.`));
        }
        logs.push(monster.attack(player));
        break;
      case '3': // 방어
        if (ran <= player._def) {
          logs.push(chalk.green(`방어에 성공했습니다.`));
          logs.push(player.Parrying(monster));
        } else {
          logs.push(chalk.green(`방어에 실패했습니다.`));
          logs.push(monster.attack(player));
        }
        break;
      case '4': // 도망
        if (ran <= player._luk) {
          logs.push(chalk.green(`무사히 도망쳤다!`));
          run = true;
        } else {
          logs.push(chalk.green(`도망칠 수 없다!`));
          logs.push(monster.attack(player));
        }
        break;
      case '5': // 아이템 획득
        if (ran <= 10) {
          let randomItem = util.random(1, 3);
          switch (randomItem) {
            case 1: // 3분의 1 확률로 검 획득(공격력 2 증가)
              logs.push(chalk.green(`검을 발견했습니다!(공격력 2 증가)`));
              player.atk += 2;
              player.maxatk = player.atk + player.atk * player.x;
              break;
            case 2: // 3분의 1 확률로 런닝화 획득(도망확률 3 증가)
              logs.push(chalk.green(`런닝화를 발견했습니다!(도망확률 3 증가)`));
              player.luk += 3;
              break;
            case 3: // 3분의 1 확률로 생명수 획득(체력 30 회복)
              logs.push(chalk.green(`생명수를 발견했습니다!(체력 30 회복)`));
              if (player.currentHp + 30 > player.hp) {
                // 최대 체력 이상으론 회복되지 못하게 제한
                player.currentHp = player.hp;
              } else {
                player.currentHp += 30;
              }
              break;
            default:
              break;
          }
        } else {
          logs.push(chalk.green(`당신은 주변을 살펴보았지만, 아무것도 보지 못했습니다.`));
        }
        logs.push(monster.attack(player));
        break;
      default:
        logs.push(chalk.red(`잘못된 선택`));
        break;
    }
    if (stage === 10 && monster.pattern == true) {
      // 보스가 패턴중이라면 출력
      logs.push(monster.countdown(player));
    }

    if (stage === 10 && monster.hp <= 250 && monster.flag === true) {
      // 보스가 패턴을 하지 않았고 체력이 250이하면 패턴 ON
      monster.pattern = true;
    }
    logs.push(chalk.green(`플레이어 체력 : ${player.currentHp}`)); // 플레이어 남은 체력을 보여줌
    if (monster.hp <= 0 || run === true) {
      // 몬스터 체력이 0이 되거나 도망에 성공하면 스테이지 클리어
      achieve.update_achievement('monster'); // 업적 : 잡은 몬스터 수 카운트
      logs.push(chalk.green(`스테이지${stage} 클리어!`));
      break;
    }
  }
};
const rise = async () => {
  // 한 스테이지 클리어 후 레벨업한 결과를 보여주기 위해 휴식 구현(스테이지 클리어하면 체력 풀피되는게 휴식이라 말하면 괜찮을듯해서)
  const choice = readlineSync.question('\n\n휴식을 마치고 탑을 오르겠습니까?(yes/no)');
  switch (choice) {
    case 'yes':
      break;
    default:
      rise();
      break;
  }
};
export async function startGame(cheat, playername) {
  console.clear();
  if (playername == null)
    // 옵션에서 플레이어 이름 변경을 하지 않았다면 자동으로 '플레이어'라는 이름으로 시작
    playername = '플레이어';

  let hp = 100; // 초기 값 : 체력, 공격력, 최대공격력 배율, 도망 확률, 연속 공격 확률, 방어 확률
  let atk = 5;
  let maxatk = 0;
  let luk = 2;
  let combo = 25;
  let def = 55;

  if (cheat) {
    // 옵션에서 치트 모드 선택시 모든 능력치가 99999인 상태로 시작
    hp = 99999;
    atk = 99999;
    luk = 100;
    combo = 100;
    def = 100;
  }
  const player = new Player(playername, hp, atk, maxatk, luk, combo, def);
  let stage = 1;

  while (stage <= 10) {
    let monster;

    if (stage === 10) {
      // 10스테이지에는 보스 객체 생성 그 이전 스테이지는 몬스터 생성
      monster = new Boss(600, 30); // 보스 객체 생성
    } else {
      monster = new Monster(stage, 100, 5); // 스테이지에 따른 몬스터 객체 생성
    }

    await battle(stage, player, monster);

    if (player.currentHp <= 0) {
      // 죽었다면 게임 오버
      console.clear();
      achieve.update_achievement('gameover'); // 업적 : 죽은 횟수 카운트
      console.log(chalk.red('Game Over'));
      process.exit(0); // 게임 종료
    } else {
      // 죽지 않았다면 게임 속행
      player.levelup(); // 레벨 업
      player.heal(); // 풀피 회복
      await rise(); // 비동기로 레벨업 로그를 볼 수 있게 함
      stage++; // NEXT STAGE
    }
  }

  console.clear();
  achieve.update_achievement('gameclear'); // 업적 : 게임 클리어
  console.log(chalk.green('Game Clear'));
}
