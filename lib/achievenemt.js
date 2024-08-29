// 업적 함수 모음

import fs from 'fs';

// 업적 json 생성 함수
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

// 업적 불러오기 함수
export function print_achievement(){
    const dataBuffer = fs.readFileSync('achievement.json');
    const dataJSON = dataBuffer.toString();
    const data = JSON.parse(dataJSON);
    return data;
}

// 업적 수정 함수
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