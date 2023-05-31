// import "./roles.js"
//数字转文字
let roleNumber = {
    0: '0',
    2: '安伯',
    4: '芭芭拉',
    8: '班尼特',
    16: '菲谢尔',
    32: '可莉',
    64: '胡桃',
    128: '魈',
    256: '神里绫华',
    512: '七七',
    1024: '刻晴',
    2048: '雷神'
};
//文字转拼音
let roleNumberToString = {
    '安伯': 'anbo',
    '芭芭拉': 'babala',
    '班尼特': 'bannite',
    '菲谢尔': 'feixieer',
    '可莉': 'keli',
    '胡桃': 'hutao',
    '魈': 'xiao1',
    '神里绫华': 'linghua',
    '七七': 'qiqi',
    '刻晴': 'keqing',
    '雷神': 'leishen',
};
//用来判重的集合
let disRole = new Set();
//常用的dom
//游戏界面
let container1 = document.querySelector('.container');
let container2 = document.querySelector('.container .game-area');
let container = document.querySelector('.container .game-area .game');
//音乐播放器
let audio = document.querySelector('audio');
//得分面板
let scoreContainer = document.querySelector('.setscore .score');
//改变棋盘大小的下拉框
let setChessSize = document.querySelector('#select');
//重新开始的按钮
let restart = document.querySelector('.restart');
//外挂按钮
let waigua = document.querySelector('.waiguacon #waigua');
//更改角色的元素
let changeRole = document.querySelector('.change-role');
//更改角色的按钮
let changeBut = document.querySelector('.change-role #change-done');
//容器的宽和高
let conWidth = container.clientWidth;
let conHeight = container.clientHeight;
// 棋盘的大小，默认是4X4
let ChessboardSize = 4;
//得分
let score = 0;
//上一次选择的角色
let prve = -1;
//上一次更改的角色
let prve1 = null;
//控制生成的数值
let number = [1];
//棋盘数组
let qipan = Array(ChessboardSize);
for (let i = 0; i < ChessboardSize; i++) {
    qipan[i] = Array(ChessboardSize);
}
//为棋盘数组赋初始值
for (let i = 0; i < ChessboardSize; i++) {
    for (let j = 0; j < ChessboardSize; j++) {
        qipan[i][j] = 0;
    }
}
// console.log(qipan);
function undateQipan() {
    qipan = Array(ChessboardSize);
    for (let i = 0; i < ChessboardSize; i++) {
        qipan[i] = Array(ChessboardSize);
    }
}

//创建棋盘
function creatChessboard() {
    //先清空棋盘
    container.innerHTML = "";
    //先确定每一个方块的大小
    let ChessboardWidth = conWidth / ChessboardSize;
    let ChessboardHeight = conHeight / ChessboardSize;
    let temp = document.createDocumentFragment();
    for (let i = 0; i < ChessboardSize; i++) {
        for (let j = 0; j < ChessboardSize; j++) {
            //创建包含图片的div
            let imgDiv = document.createElement('div');
            //创建div中的图片标签
            let img = document.createElement('img');
            //设置图片容器的大小与样式
            imgDiv.style.width = ChessboardWidth + "px";
            imgDiv.style.height = ChessboardHeight + "px";
            imgDiv.classList.add('img-container');
            //设置图片的大小与样式
            img.style.width = ChessboardWidth - 10 + "px";
            img.style.height = ChessboardHeight - 10 + "px";
            img.style.borderRadius = "10px";
            let role = roleNumber[qipan[i][j]];
            img.src = "./images/roles/" + role + ".png";
            // console.log("./images/roles/" + role + ".png");
            img.classList.add(roleNumberToString[role]);
            //将img加入到div当中
            imgDiv.appendChild(img);
            //设置div的位置
            imgDiv.style.position = "absolute";
            imgDiv.style.top = i * ChessboardHeight + "px";
            imgDiv.style.left = j * ChessboardWidth + "px";
            //加入到游戏区域中
            temp.appendChild(imgDiv);
        }
    }
    container.appendChild(temp);
}

//判断棋盘数组是否满了
function is_fill() {
    flag = false;
    for (let i = 0; i < ChessboardSize; i++) {
        for (let j = 0; j < ChessboardSize; j++) {
            if (!qipan[i][j]) flag = true;
        }
    }
    return !flag;
}

//为棋盘生成随机数
function getNums() {
    if (is_fill()) return;
    let x = Math.floor(Math.random() * ChessboardSize);
    let y = Math.floor(Math.random() * ChessboardSize);
    let t = 2 ** number[Math.floor(Math.random() * number.length)];
    // console.log(t);
    if (qipan[x][y] == 0) qipan[x][y] = t;
    else getNums();
}

//判断是否结束游戏
function is_over() {
    if (!is_fill()) return false;
    let backup;
    backup = Array(ChessboardSize);
    for (let i = 0; i < ChessboardSize; i++) {
        backup[i] = Array(ChessboardSize);
    }
    for (let i = 0; i < ChessboardSize; i++)
        for (let j = 0; j < ChessboardSize; j++)
            backup[i][j] = qipan[i][j];
    ops = ['w', 'a', 's', 'd'];

    for (let i = 0; i < 4; i++) {
        player_trun(ops[i], true);
        if (!is_fill()) {
            for (let i = 0; i < ChessboardSize; i++)
                for (let j = 0; j < ChessboardSize; j++)
                    qipan[i][j] = backup[i][j];
            return false;
        }
    }
    return true;
}

//打印棋盘
function print() {
    console.log(qipan);
}

//上下左右四种操作
function player_trun(op, ceshi) {
    switch (op) {
        case 'W':
        case 'w': {
            for (let j = 0; j < ChessboardSize; j++) {		//枚举每一列 
                flag = true;
                while (flag) {
                    flag = false;
                    for (let r = 0; r < ChessboardSize - 1; r++) {
                        if (qipan[r][j] != 0 && qipan[r][j] == qipan[r + 1][j]) {
                            if (!ceshi) score += qipan[r][j];
                            qipan[r][j] *= 2;
                            qipan[r + 1][j] = 0;
                            flag = true;
                        }
                        else if (!qipan[r][j] && qipan[r + 1][j]) {
                            [qipan[r][j], qipan[r + 1][j]] = [qipan[r + 1][j], qipan[r][j]];
                            flag = true;
                        }
                    }
                }
            }
            break;
        }

        case 'A':
        case 'a': {
            for (let r = 0; r < ChessboardSize; r++) {
                flag = true;
                while (flag) {
                    flag = false;
                    for (let j = 0; j < ChessboardSize - 1; j++) {
                        if (qipan[r][j] != 0 && qipan[r][j] == qipan[r][j + 1]) {
                            if (!ceshi) score += qipan[r][j];
                            qipan[r][j] *= 2;
                            qipan[r][j + 1] = 0;
                            flag = true;
                        }
                        else if (!qipan[r][j] && qipan[r][j + 1]) {
                            [qipan[r][j], qipan[r][j + 1]] = [qipan[r][j + 1], qipan[r][j]];
                            flag = true;
                        }
                    }
                }
            }
            break;
        }

        case 'S':
        case 's': {
            for (let j = 0; j < ChessboardSize; j++) {
                flag = true;
                while (flag) {
                    flag = false;
                    for (let r = ChessboardSize - 1; r > 0; r--) {
                        if (qipan[r][j] != 0 && qipan[r][j] == qipan[r - 1][j]) {
                            if (!ceshi) score += qipan[r][j];
                            qipan[r][j] *= 2;
                            qipan[r - 1][j] = 0;
                            flag = true;
                        }
                        else if (!qipan[r][j] && qipan[r - 1][j]) {
                            [qipan[r][j], qipan[r - 1][j]] = [qipan[r - 1][j], qipan[r][j]];
                            flag = true;
                        }
                    }
                }
            }
            break;
        }

        case 'D':
        case 'd': {
            for (let r = 0; r < ChessboardSize; r++) {
                flag = true;
                while (flag) {
                    flag = false;
                    for (let j = ChessboardSize - 1; j > 0; j--) {
                        if (qipan[r][j] != 0 && qipan[r][j] == qipan[r][j - 1]) {
                            if (!ceshi) score += qipan[r][j];
                            qipan[r][j] *= 2;
                            qipan[r][j - 1] = 0;
                            flag = true;
                        }
                        else if (!qipan[r][j] && qipan[r][j - 1]) {
                            [qipan[r][j], qipan[r][j - 1]] = [qipan[r][j - 1], qipan[r][j]];
                            flag = true;
                        }
                    }
                }
            }
            break;
        }
        default:
            break;
    }
}

function initGame() {

    //给集合加上0
    disRole.clear();
    disRole.add(0);
    //初始化分数
    score = 0;
    scoreContainer.innerHTML = score;
    //初始化生成的人物
    number = [1];
    //上一次没有选择角色
    prve = -1;
    //上一次没有更改角色
    prve1 = null;
    //清空棋盘
    for (let i = 0; i < ChessboardSize; i++) {
        for (let j = 0; j < ChessboardSize; j++) {
            qipan[i][j] = 0;
        }
    }
    // let t = 2;
    // for (let i = 0; i < ChessboardSize; i++) {
    //     for (let j = 0; j < ChessboardSize; j++) {
    //         if (i == ChessboardSize - 1) continue;
    //         qipan[i][j] = t;
    //         t *= 2;
    //         if (t == 2048) t = 2;
    //     }
    // }
    //获取初始人物
    getNums();
    //创建棋盘
    creatChessboard();
}

function getMax() {
    let ret = -123;
    for (let i = 0; i < ChessboardSize; i++) {
        for (let j = 0; j < ChessboardSize; j++) {
            ret = Math.max(ret, qipan[i][j]);
        }
    }
    return ret;
}

function isHas(val) {
    for (let i = 0; i < ChessboardSize; i++) {
        for (let j = 0; j < ChessboardSize; j++) {
            if (qipan[i][j] == val) return true;
        }
    }
    return false;
}

//根据分数更改生成什么角色
function changeNum() {
    if (score >= 500 && score < 1000) {
        for (let i = 0; i < 2; i++)  number.push(2);
    }
    else if (score >= 1000 && score < 2000) {
        for (let i = 0; i < 3; i++)  number.push(3);
    }
    else if (score >= 2000 && score < 4000) {
        for (let i = 0; i < 4; i++)  number.push(4);
    }
    else if (score >= 4000) {
        for (let i = 0; i < 5; i++)  number.push(5);
    }
    // console.log(score, number);
}

//资源加载完毕后开始游戏
window.onload = function () {
    //删除预加载资源
    let yuImg = document.querySelector('.loadImg');
    yuImg.remove();
    //删除遮罩层
    let shadow = document.querySelector('.shadow');
    shadow.remove();
    initGame();
};

//添加下拉框监听事件
setChessSize.addEventListener('change', function () {
    ChessboardSize = parseInt(setChessSize.value);
    // console.log(setChessSize);
    undateQipan();
    print();
    initGame();
});
// 添加重新开始游戏事件
restart.addEventListener('click', function () {
    initGame();
});
let flag11 = true;
//外挂按钮事件
waigua.addEventListener('click', function (ev) {
    let childs = container.getElementsByTagName('div');
    for (let i = 0; i < childs.length; i++) {
        childs[i].style.opacity = '0.5';
        childs[i].style.backgroundImage = 'url(./images/img边框.png)';
        childs[i].style.backgroundSize = 'cover';
    }
    prve = -1;
    function conClick(ev) {
        return function (ev) {
            // console.log(childs);
            //先确定每一个方块的大小
            let ChessboardWidth = conWidth / ChessboardSize;
            let ChessboardHeight = conHeight / ChessboardSize;
            //获取相对于游戏区域点击的位置
            let dx = ev.x - (container1.offsetLeft + container2.offsetLeft + container.offsetLeft);
            let dy = ev.y - (container1.offsetTop + container2.offsetTop + container.offsetTop);
            //获取对应棋盘的横纵下标
            let y = Math.floor(dx / ChessboardWidth), x = Math.floor(dy / ChessboardHeight);
            // console.log(x, y);
            let t = x * ChessboardSize + y;
            if (prve == -1) {
                childs[t].style.opacity = '1';
            }
            else {
                childs[prve].style.opacity = '0.5';
                childs[t].style.opacity = '1';
            }
            //记录上一个点
            prve = t;
        }
    }

    function conChange(ev) {
        return function (ev) {
            // console.log(1111);
            //将选择角色的元素显示出来
            changeRole.style.display = 'block';
            changeRole.style.zIndex = 1020;
            //强行渲染
            changeRole.clientHeight;
            changeRole.style.opacity = '1';
            // console.log(11);
        }
    }

    // alert('请选择你要改变的位置');
    // console.log(111);
    container.onclick = conClick(ev);
    container.ondblclick = conChange(ev);
    //强行渲染
    container.clientHeight;
    if (flag11) {
        alert('请单击选择，双击更改角色');
        flag11 = false;
    }
});
//给更改角色的元素添加点击事件（冒泡）
changeRole.addEventListener('click', function (ev) {
    if (ev.target.tagName == 'IMG') {
        if (prve1 == null) {
            ev.target.style.opacity = '1';
        }
        else {
            prve1.style.opacity = '0.5';
            ev.target.style.opacity = '1';
        }
        //记录上一个点
        prve1 = ev.target;
    }
});
//给更改角色的按钮添加事件
changeBut.addEventListener('click', function () {
    if (prve1 == null) {
        alert('请选择您要更改的角色');
        return;
    }
    //prve是需要更改的角色的下标号，prve1是更改之后的角色的对象
    let num = parseInt(prve1.getAttribute('data-value'));
    let x = Math.floor(prve / ChessboardSize), y = prve % ChessboardSize;
    qipan[x][y] = num;
    //清空上一次的对象
    prve1.style.opacity = '0.5';
    prve = -1;
    prve1 = null;
    //将选择角色的元素设置回去，透明度为0，z-index为0
    changeRole.style.display = 'none';
    changeRole.style.zIndex = 0;
    changeRole.style.opacity = '0';
    //执行完毕，取消点击事件
    container.onclick = null;
    container.ondblclick = null;
    creatChessboard();
});
//添加键盘事件
window.addEventListener('keyup', function (e) {
    // print();
    if (e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd') {
        player_trun(e.key, false);
        //根据分数更改生成什么角色  它要放在getNums之前
        changeNum();
        getNums();
        //更新分数
        scoreContainer.innerHTML = score;
        //重新更新棋盘内容
        creatChessboard();
        let max1 = getMax();
        if (!disRole.has(max1)) {
            disRole.add(max1);
            //播放对应的音频
            let roleName = roleNumber[max1];
            audio.src = "./MP3/" + roleName + ".mp3";
            // console.log("./MP3/" + roleName + ".mp3");
            audio.play();
        }
        if (max1 == 2048) {
            this.setTimeout(function () {
                this.alert('你太厉害了！过关啦！！！恭喜您！');
                initGame();
            }, 100);
        }
        //判断是否结束游戏
        if (is_over()) {
            creatChessboard();
            this.setTimeout(function () {
                this.alert('游戏结束，您的分数是' + score + '分');
                initGame();
            }, 100);
        }
    }
    // print();
});
