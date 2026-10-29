// 宣告待機動畫的六張獨立圖片陣列。
let stopFrames = [];

// 宣告向右動畫的六張獨立圖片陣列。
let rightFrames = [];

// 宣告向左動畫的六張獨立圖片陣列。
let leftFrames = [];

// 設定每組動畫包含六張圖片。
const frameCount = 6;

// 設定動畫換圖的間隔幀數。
const animationSpeed = 8;

// 設定角色每幀移動的像素數。
const moveSpeed = 4;

// 設定目前播放的動畫狀態。
let currentState = "stop";

// 設定目前顯示的圖片編號。
let currentFrame = 0;

// 設定動畫計時器目前的數值。
let animationTimer = 0;

// 設定角色在畫布上的水平座標。
let characterX = 0;

// 設定角色在畫布上的垂直座標。
let characterY = 0;

// 使用 preload 在畫布建立前載入所有獨立圖片。
function preload() {
  // 逐一載入待機資料夾中的 0.png 到 5.png。
  for (let i = 0; i < frameCount; i++) {
    // 載入 01/stop/ 資料夾中的待機圖片。
    stopFrames[i] = loadImage("01/stop/" + i + ".png");

    // 載入 01/right/ 資料夾中的向右圖片。
    rightFrames[i] = loadImage("01/right/" + i + ".png");

    // 載入 01/left/ 資料夾中的向左圖片。
    leftFrames[i] = loadImage("01/left/" + i + ".png");
  }
}

// 建立全螢幕畫布並設定初始顯示方式。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 將角色水平位置設定在畫布中央。
  characterX = width / 2;

  // 將角色垂直位置設定在畫布中央。
  characterY = height / 2;

  // 將圖片繪製位置設定為圖片中心點。
  imageMode(CENTER);

  // 關閉圖片平滑處理以保留圖片原本的像素效果。
  noSmooth();
}

// 每一幀執行背景、控制、移動、動畫與繪圖。
function draw() {
  // 使用指定的米白色清除畫布背景。
  background("#f2e8cf");

  // 取得使用者目前按住的方向鍵狀態。
  const nextState = getCurrentState();

  // 判斷目前動畫狀態是否發生改變。
  if (nextState !== currentState) {
    // 更新目前播放的動畫狀態。
    currentState = nextState;

    // 切換動畫時從第一張圖片重新播放。
    currentFrame = 0;

    // 切換動畫時重新計算換圖時間。
    animationTimer = 0;
  }

  // 依照目前狀態移動角色並限制角色邊界。
  updateMovement();

  // 更新目前播放的獨立圖片編號。
  updateAnimation();

  // 顯示目前動畫狀態的單張圖片。
  drawCharacter();
}

// 依照方向鍵取得角色目前的動畫狀態。
function getCurrentState() {
  // 優先判斷使用者是否按住右方向鍵。
  if (keyIsDown(RIGHT_ARROW)) {
    // 按住右方向鍵時回傳向右狀態。
    return "right";
  }

  // 判斷使用者是否按住左方向鍵。
  if (keyIsDown(LEFT_ARROW)) {
    // 按住左方向鍵時回傳向左狀態。
    return "left";
  }

  // 沒有按住方向鍵時回傳待機狀態。
  return "stop";
}

// 依照目前狀態移動角色並防止角色超出畫布。
function updateMovement() {
  // 判斷角色目前是否處於向右移動狀態。
  if (currentState === "right") {
    // 增加角色的水平座標以向右移動。
    characterX += moveSpeed;
  }

  // 判斷角色目前是否處於向左移動狀態。
  if (currentState === "left") {
    // 減少角色的水平座標以向左移動。
    characterX -= moveSpeed;
  }

  // 取得目前圖片的寬度作為水平邊界依據。
  const characterWidth = getCurrentFrame().width;

  // 限制角色中心點不小於圖片左半部寬度。
  characterX = max(characterWidth / 2, characterX);

  // 限制角色中心點不大於畫布寬度減去圖片右半部寬度。
  characterX = min(width - characterWidth / 2, characterX);
}

// 依照固定速度循環切換六張獨立圖片。
function updateAnimation() {
  // 增加動畫計時器的數值。
  animationTimer++;

  // 判斷是否已經達到下一張圖片的切換時間。
  if (animationTimer >= animationSpeed) {
    // 將動畫計時器歸零。
    animationTimer = 0;

    // 將目前圖片編號往後移動一張。
    currentFrame++;

    // 判斷是否已經超過第五張圖片。
    if (currentFrame >= frameCount) {
      // 回到第一張圖片形成循環動畫。
      currentFrame = 0;
    }
  }
}

// 取得目前動畫狀態與圖片編號對應的單張圖片。
function getCurrentFrame() {
  // 判斷目前是否為向右動畫。
  if (currentState === "right") {
    // 回傳向右動畫的目前圖片。
    return rightFrames[currentFrame];
  }

  // 判斷目前是否為向左動畫。
  if (currentState === "left") {
    // 回傳向左動畫的目前圖片。
    return leftFrames[currentFrame];
  }

  // 其他情況回傳待機動畫的目前圖片。
  return stopFrames[currentFrame];
}

// 將目前的單張角色圖片繪製在畫布中央位置。
function drawCharacter() {
  // 取得目前動畫狀態的單張圖片。
  const currentImage = getCurrentFrame();

  // 將單張圖片直接繪製到角色座標，不使用精靈圖裁切參數。
  image(currentImage, characterX, characterY);
}

// 當瀏覽器視窗尺寸改變時重新調整畫布與角色位置。
function windowResized() {
  // 將畫布調整為新的瀏覽器視窗大小。
  resizeCanvas(windowWidth, windowHeight);

  // 讓角色重新位於畫布垂直中央。
  characterY = height / 2;

  // 取得目前圖片以重新計算水平邊界。
  const currentImage = getCurrentFrame();

  // 限制角色不超出畫布左側。
  characterX = max(currentImage.width / 2, characterX);

  // 限制角色不超出畫布右側。
  characterX = min(width - currentImage.width / 2, characterX);
}
