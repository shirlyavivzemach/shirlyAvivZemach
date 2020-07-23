function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function counter(args) {
    let countMap = {};
    for (let i = 0; i < args.length; i++) {
      let num = args[i]
      countMap[num] = (countMap[num]) ? countMap[num] + 1 : 1;
    }
    return countMap
  }


