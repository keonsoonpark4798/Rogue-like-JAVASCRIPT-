// 유틸 함수 모음
import createPlayer from 'play-sound';
// 랜덤 함수
export function random(min, range){
let ran = Math.floor((Math.random() * range) + min);
return ran;
}

export async function sound(){
    const player = createPlayer();
    player.play('source/doubleattack.mp3', function(err){
        if (err) throw err
        console.log('Audio file played successfully');
      })
}
