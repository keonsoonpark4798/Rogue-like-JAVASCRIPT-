// 유틸 함수 모음
import createPlayer from 'play-sound';
import fs from 'fs';
// 랜덤 함수
export function random(min, range){
let ran = Math.floor((Math.random() * range) + min);
return ran;
}

export async function sound(){
    const player = createPlayer();
    player.play('source/doubleattack.mp3',{ start: ['-af', 2 ]});
}

export function Create_achievements(){
    if(fs.existsSync('achievement.json')){  
    }
    else
    {
        const achievement = {
            monster_kill: 0,
            game_clear: 0,
            game_over: 0,
        };
        fs.writeFileSync('achievement.json', JSON.stringify(achievement,null,2), (err) => {
            if (err) {
                console.log("업적 파일 생성 실패");
            } else {
                console.log('업적 파일 생성 성공');
            }
        });
    }
}

export function print_achievement(){
    const dataBuffer = fs.readFileSync('achievement.json');
    const dataJSON = dataBuffer.toString();
    const data = JSON.parse(dataJSON);
    return data;
}

export function update_achievement(value){
    const dataBuffer = fs.readFileSync('achievement.json');
    const dataJSON = dataBuffer.toString();
    const data = JSON.parse(dataJSON);
    switch(value)
    {
        case 'monster' :
            data.monster_kill++;
            break;
        case 'gameclear' :
            data.game_clear++;
            break;
        case 'gameover' :
            data.game_over++;
            break;
    }

    const achieveJSON = JSON.stringify(data);
    fs.writeFileSync('achievement.json', achieveJSON);
}
