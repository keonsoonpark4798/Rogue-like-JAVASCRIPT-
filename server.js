import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from './game.js';
import * as util from './lib/util.js';

let playername = '플레이어';
// 로비 화면을 출력하는 함수
function displayLobby() {
  //console.clear();

  // 타이틀 텍스트
  console.log(
    chalk.cyan(
      figlet.textSync('RL- Javascript', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );

  // 상단 경계선
  const line = chalk.magentaBright('='.repeat(50));
  console.log(line);

  // 게임 이름
  console.log(chalk.yellowBright.bold('CLI 게임에 오신것을 환영합니다!'));
  console.log(chalk.yellowBright.bold(`${playername}님`));

  // 설명 텍스트
  console.log(chalk.green('옵션을 선택해주세요.'));
  console.log();

  // 옵션들
  console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
  console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
  console.log(chalk.blue('3.') + chalk.white(' 옵션'));
  console.log(chalk.blue('4.') + chalk.white(' 종료'));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
  const choice = readlineSync.question('입력: ');

  switch (choice) {
    case '1': // 여기에서 새로운 게임 시작 로직을 구현
      console.log(chalk.green('게임을 시작합니다.'));
      startGame(false, playername);
      break;
    case '2': // 업적 확인하기 로직을 구현
      seeAchievement();
      handleAchievementInput();
      break;
    case '3': // 옵션 메뉴 로직을 구현
      console.log(
        chalk.blue('1. 치트 모드(모든 스탯이 99999가 됩니다) 2. 플레이어 이름 변경 3. 로비로'),
      );
      handleOptionInput();
      break;
    case '4': // 게임 종료 로직을 구현
      console.log(chalk.red('게임을 종료합니다.'));
      process.exit(0); // 게임 종료
      break;
    default: // 유효하지 않은 입력일 경우 다시 입력 받음
      console.log(chalk.red('올바른 선택을 하세요.'));
      handleUserInput();
  }
}

// 옵션칸에서 입력
function handleOptionInput() {
  const choice = readlineSync.question('옵션 입력: ');
  switch (choice) {
    case '1':
      startGame(true, playername);
      break;
    case '2':
      playernameChange();
      break;
    default:
      start();
  }
}

// 업적칸에서 입력
function handleAchievementInput() {
  const choice = readlineSync.question('타이틀로 이동(yes/no)');
  switch (choice) {
    case 'yes':
      start();
      break;
    default:
      handleAchievementInput();
  }
}

// 플레이어 이름 변경 함수
function playernameChange() {
  const name = readlineSync.question('이름 입력(한글입력 x): ');
  const regx = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // readlineSync에서는 한글 입력하면 깨져서 정규식을 통해 한글 입력을 제한
  if (!regx.test(name)) {
    playername = name;
  }
  start();
}

// 업적 보기 함수
function seeAchievement() {
  let data = util.print_achievement();
  console.log(chalk.green(`\n몬스터 킬 : ${data.monster_kill}`));
  console.log(chalk.green(`게임 클리어 횟수 : ${data.game_clear}`));
  console.log(chalk.green(`게임 오버 횟수 : ${data.game_over}\n`));
}

// 게임 시작 함수
function start() {
  util.Create_achievements();
  displayLobby();
  handleUserInput();
}

// 게임 실행
start();
