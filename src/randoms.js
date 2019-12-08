export function getRandomInt(max, min=0) {
    return Math.floor(min + Math.random() * (max-min));
}

function *generateRandomNumber(max){
    let part = max/4;
    while(true){
        yield getRandomInt(part);
        yield getRandomInt(3*part, 2*part);
        yield getRandomInt(2*part, part);       
        yield getRandomInt(4*part, 3*part);
    }
}

export function randomGenerator(max){
    return generateRandomNumber(max);
}