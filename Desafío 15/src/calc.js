let argNumbers = parseInt(process.argv[2]);
const resultObj = {};

for (let index = 0; index < argNumbers; index++) {

    let randomNum = Math.ceil(Math.random()*1000);

    resultObj[randomNum] = resultObj[randomNum]? resultObj[randomNum] + 1 
                            : 1;
}; 



process.send(resultObj)