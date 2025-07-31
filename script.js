// 定数の宣言
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");
const audio = new Audio("sound.mp3");
const audio1 = new Audio("lvUp.mp3");

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
            spawnHeal()
        }
        if (Math.random() < 0.15) spawnToughEnemy();
    }, 1000);

    

    // ★1秒経った場合
    timerInterval = setInterval(() => {

        timeLimitCount--; //残り秒数を1減らす

        //スコア表示を更新
        document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore} / 残り： ${timeLimitCount}s`;

        // 時間切れになったらゲーム終了
        if (timeLimitCount <= 0) {
            audio.currentTime = 0;
            audio1.currentTime = 0;
            audio1.play();
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            startButton.disabled = false;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }

            document.getElementById("score-area").textContent = `🎊 ゲーム終了！ スコア： ${score} / ハイスコア： ${highScore}`;

            // ★ ランキングモーダルを表示
            showRankingModal(score);
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

// === 背景設定機能 ===

// ページ読み込み時に保存済み背景を適用
const savedBg = localStorage.getItem("selectedBackground");
if (savedBg) {
    document.body.style.background = `url('${savedBg}') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
}

// 設定ボタンとモーダル要素取得
const settingsBtn = document.getElementById("settings-btn");
const bgModal = document.getElementById("background-modal");
const closeModal = document.getElementById("close-modal");

// モーダルを開く
settingsBtn.addEventListener("click", () => {
    bgModal.style.display = "block";
});

// モーダルを閉じる
closeModal.addEventListener("click", () => {
    bgModal.style.display = "none";
});

// 背景画像をクリックしたときの処理
document.querySelectorAll(".bg-option img").forEach(img => {
    img.addEventListener("click", () => {
        const selectedBg = img.getAttribute("data-bg");
        document.body.style.background = `url('${selectedBg}') no-repeat center center fixed`;
        document.body.style.backgroundSize = "cover";
        localStorage.setItem("selectedBackground", selectedBg);
        bgModal.style.display = "none"; // 閉じる
    });
});

// スコアに応じた順位を計算する関数
function calculateRank(score) {
    if (score >= 35) return 1;
    if (score >= 30) return 10;
    if (score >= 25) return 20;
    if (score >= 20) return 40;
    if (score >= 10) return 70;
    return 100;
}

function showRankingModal(score) {
    const finalRank = calculateRank(score);
    const rankDisplay = document.getElementById("rank-number");
    const modal = document.getElementById("ranking-modal");

    modal.style.display = "block";
    rankDisplay.textContent = finalRank;

    // スクロール付きランキング演出
    showScrollingRanking(score, "あなた");
}

// モーダル閉じるボタンの動作
document.getElementById("ranking-close").addEventListener("click", () => {
    document.getElementById("ranking-modal").style.display = "none";
});

function showScrollingRanking(score, name = "あなた") {
    const entries = document.getElementById("rank-entries");
    entries.innerHTML = "";

    const fakeNames = ["さくら", "ゆうた", "たろう", "あかね", "りょう", "みさき", "けんじ"];
    const allEntries = [];
    const yourRank = calculateRank(score);

    let currentRank = 100;
    while (currentRank >= yourRank) {
        const isYou = currentRank === yourRank;
        const entry = {
            rank: currentRank,
            name: isYou ? name : fakeNames[Math.floor(Math.random() * fakeNames.length)],
            score: isYou ? score : Math.floor(Math.random() * (score - 1)) + 1,
            isYou
        };
        allEntries.push(entry);
        currentRank -= Math.floor(Math.random() * 3) + 1;
    }

    // ランキングを100位 → 自分の順位で表示（逆順しない）
    allEntries.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.rank}位　${entry.name}　スコア: ${entry.score}`;
        if (entry.isYou) li.classList.add("you");
        entries.appendChild(li);
    });

    // 一旦スクロール位置をリセット
    const list = document.getElementById("rank-entries");
    list.style.transform = "translateY(0px)";

    // requestAnimationFrameを使って確実に描画後にスクロール処理を実行
    requestAnimationFrame(() => {
        setTimeout(() => {
            const youItem = list.querySelector(".you");

            if (youItem) {
                const wrapper = document.getElementById("rank-scroll-wrapper");
                const wrapperHeight = wrapper.clientHeight;
                const youOffset = youItem.offsetTop;
                const youHeight = youItem.clientHeight;

                // 中央に表示されるように調整
                const scrollTarget = youOffset - wrapperHeight / 2 + youHeight / 2;

                // スクロールアニメーション開始（上に移動）
                list.style.transform = `translateY(-${scrollTarget}px)`;
            }
        }, 100); // 少し遅らせることで描画タイミングに合わせる
    });
}

// タフな敵を出現させる関数
function spawnToughEnemy() {
    const enemy = document.createElement("div");
    enemy.className = "tough-enemy";

    // 耐久値（例：3回タップで倒れる）
    let hp = 3;
    const bonusScore = 5; // 倒した時のスコアボーナス

    // ランダムな位置に配置
    const maxX = gameArea.clientWidth - 80;
    const maxY = gameArea.clientHeight - 80;
    enemy.style.left = Math.random() * maxX + "px";
    enemy.style.top = Math.random() * maxY + "px";

    // クリック処理
    enemy.addEventListener("click", () => {
        hp--;

        // 残りHPでエフェクト（小さくしたり色を変えたりできる）
        enemy.style.opacity = 0.3 + 0.5 * (hp / 3);

        if (hp <= 0) {
            gameArea.removeChild(enemy);
            score += bonusScore; // ボーナス加算

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }

            audio.currentTime = 0;
            audio.play();
        }
    });

    // 出現から4秒で消える
    setTimeout(() => {
        if (gameArea.contains(enemy)) gameArea.removeChild(enemy);
    }, 4000);

    gameArea.appendChild(enemy);
}

// ルールボタンとモーダル取得
const rulesBtn = document.getElementById("rules-btn");
const rulesModal = document.getElementById("rules-modal");
const rulesClose = document.getElementById("rules-close");

// ルールボタンをクリック → モーダル表示
rulesBtn.addEventListener("click", () => {
    rulesModal.style.display = "block";
});

// 閉じるボタンをクリック → モーダル非表示
rulesClose.addEventListener("click", () => {
    rulesModal.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {
    // localStorageに「rulesShown」がない場合は初回表示とみなす
    if (!localStorage.getItem("rulesShown")) {
        rulesModal.style.display = "block";
        localStorage.setItem("rulesShown", "true"); // 一度表示したら記録
    }
});

const resetRulesBtn = document.getElementById("reset-rules-btn");

// ショートカットキーでデバッグボタンを表示
window.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key.toLowerCase() === "r") {
        resetRulesBtn.style.display = "block"; // 表示
    }
});

// ボタンを押すと localStorage をリセット
resetRulesBtn.addEventListener("click", () => {
    localStorage.removeItem("rulesShown");
    alert("ルールモーダルの初回表示をリセットしました。ページを再読み込みしてください。");
    resetRulesBtn.style.display = "none"; // 押した後は再び隠す
});