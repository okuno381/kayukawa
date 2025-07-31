// 定数の宣言
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");
const audio = new Audio("sound.mp3");

// ゲームの制限時間
const timeLimit = 10;

// 変数の宣言
// 現在のスコアを記録する変数
let score = 0;

// ハイスコアを記録する変数
let highScore = 0;

// 敵の出現とタイマー用の変数
let gameInterval;
let timerInterval;

// ゲームの制限時間をカウントする変数
let timeLimitCount;

// 関数の宣言
//  ゲームスタート時に呼ばれる関数
function startGame() {

    score = 0;
    timeLimitCount = timeLimit; // ゲームの制限時間を設定
    startButton.disabled = true; // ボタンを連打できないように無効化

    gameArea.innerHTML = ""; // ゲームエリアを空にする
    clearInterval(gameInterval); // 前回のゲームが動いていたら止める
    clearInterval(timerInterval);

    // 残り時間・スコア・ハイスコアを表示
    document.getElementById("score-area").textContent = `スコア： 0 / ハイスコア： ${highScore} / 残り： ${timeLimitCount}s`;

    // 1秒ごとに敵を出現させる
    gameInterval = setInterval(() => {
        spawnEnemy();

        // 30%の確率で回復アイテムも出す
        if (Math.random() < 0.3) {
            spawnHeal();
        }
    }, 1000);

    

    // ★1秒経った場合
    timerInterval = setInterval(() => {

        timeLimitCount--; //残り秒数を1減らす

        //スコア表示を更新
        document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore} / 残り： ${timeLimitCount}s`;

        // 時間切れになったらゲーム終了
        if (timeLimitCount <= 0) {

            clearInterval(gameInterval); // 敵の出現を止める
            clearInterval(timerInterval); // タイマーを止める
            startButton.disabled = false; // スタートボタンを再び有効にする

            // 今回のスコアがハイスコアを超えたら保存する
            if (score > highScore) { 
                highScore = score;
                localStorage.setItem("highScore", highScore); //ブラウザに保存
            }

            // 最終結果を表示
            document.getElementById("score-area").textContent = `🎊 ゲーム終了！ スコア： ${score} / ハイスコア： ${highScore}`;
        }
    }, 1000);
}

// 敵キャラを1体出現させる関数
function spawnEnemy() {

    // divタグを作って、enemyクラスをつける
    const enemy = document.createElement("div");
    enemy.className = "enemy";

    // 敵の出現位置（画面内のランダムな場所）
    const maxX = gameArea.clientWidth - 60; // 敵の幅の分引いている
    const maxY = gameArea.clientHeight - 60;
    enemy.style.left = Math.random() * maxX + "px";
    enemy.style.top = Math.random() * maxY + "px";

    // ★敵をクリック（タップ）した場合
    enemy.addEventListener("click", () => {

        gameArea.removeChild(enemy); // 敵を消す
        score++;

        //ハイスコアを更新
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // 保存
        }

        audio.currentTime = 0;
        audio.play();
    });

    // ★3秒経った場合
    setTimeout(() => {

        //タップされなければ自動で消す
        if (gameArea.contains(enemy)) {
            gameArea.removeChild(enemy);
        }
    }, 3000)

    // 敵を画面に追加
    gameArea.appendChild(enemy);
}

// 回復アイテムを出現させる関数
function spawnHeal() {
    const heal = document.createElement("div");
    heal.className = "heal";

    const maxX = gameArea.clientWidth - 40; // ヒールのサイズ分調整
    const maxY = gameArea.clientHeight - 40;
    heal.style.left = Math.random() * maxX + "px";
    heal.style.top = Math.random() * maxY + "px";

    // 回復アイテムがクリックされた場合
    heal.addEventListener("click", () => {
        gameArea.removeChild(heal); // アイテムを消す
        timeLimitCount += 2; // 残り時間を2秒回復（お好みで調整）
        
        // 最大時間制限（例：15秒まで）を設定したい場合
        if (timeLimitCount > timeLimit) timeLimitCount = timeLimit;

        // 表示更新
        document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore} / 残り： ${timeLimitCount}s`;

        // 効果音再生（任意）
        audio.currentTime = 0;
        audio.play();
    });

    // 3秒後に消える
    setTimeout(() => {
        if (gameArea.contains(heal)) {
            gameArea.removeChild(heal);
        }
    }, 3000);

    gameArea.appendChild(heal);
}

// 実行時に呼ばれるところ
// 以前に保存したハイスコアを読み込む（localStorageから取得）、なければ0
highScore = localStorage.getItem("highScore") || 0;
// ハイスコアを画面に表示
document.getElementById("highscore").textContent = highScore;
//  ★「スタート」ボタンが押されたらゲーム開始
startButton.addEventListener("click", startGame);