// 유틸 함수 모음
import createPlayer from 'play-sound';

// 랜덤 함수
export function random(min, max){
let ran = Math.floor((Math.random() * (max-min+1)) + min);
return ran;
}

// 사운드 함수
export async function sound(){
    const player = createPlayer();
    player.play('source/doubleattack.mp3',{ start: ['-af', 2 ]});
}
