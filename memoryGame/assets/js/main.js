const ANIMALS = ["aslan", "fil", "kedi", "kopek", "ordek", "tavsan", "timsah", "zurafa"];
const ROW = 4; //satır sayısı
const GAME_STATUSES = { //obje tanımladık
  "idle": 0, //oyunun pasif olduğunu
  "start": 1, //oyunun başladığını
  "reset": 2 //oyunun sıfırlandığını belirtir
};

let gameStatus = GAME_STATUSES.idle; //oyun başlangıçta pasif olsun


const timeEl = document.getElementById("game_actions_time"); //oyun süresini göstermek için kullanıcaz , id:game_actions_time
const grid = document.getElementById("grid"); //oyun tahtasını göstermek için kullanıcaz  , id:grid

let choosenCards = []  //oyuncunun seçtiği kartları tutmak için. Başlangıçta boş bir dizi

function createBoard() {  //Bu fonksiyon oyun tahtasını oluşturmak için
  let gridCell = ROW * ROW;
  for (let i = 0; i < gridCell; i++) { //her bir döngü adımında div öğesi oluşturulur
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.addEventListener("click", flipCard); //tıklama olayı ve flipCard fonksiyonu
    grid.append(cell);   //oluşturulan divler grid elementine eklenir

  }
}

function fillBoard() { //oyun tahtasını doldurmak için
  const cells = document.querySelectorAll(".grid-cell") //yukarda fonk. içinde oluştırduğumuz grid-cell sınıfına ait tüm hücreleri seçtik. cells isimli diziye atadık
  let pickedAnimals = chooseAnimals(); // fil ve aslan , rasgele seçilen hayvanları aldık
  pickedAnimals = pickedAnimals.concat(pickedAnimals); // 2 fil ve 2 aslan
  pickedAnimals.sort(() => 0.5 - Math.random());  //pickedanimals dizisi rastgele sıralanır. Hayvanların rastgele sıralanmasını sağlar
  for (let index = 0; index < cells.length; index++) { //döngüyle her bir hücreye resim eklenir
    const gridCell = cells[index];
    const pickAnimal = pickedAnimals[index];
    const img = createImgDiv(pickAnimal);
    gridCell.append(img);
  }
}

function chooseAnimals(cellCount = ROW * ROW) {  //cellCount parametresi varsayılan olarak ROW*ROW değerine ayarlandı. toplam hücre sayısı
  let animalCount = cellCount / 2; //2   //hücre sayısının yarısını bulduk. çünkü her hayvan iki kez tahtaya yerleştirilir.
  let tmpArr = [...ANIMALS];  //anımals dizisinin kopyası oluşturulır.
  let pickedAnimals = []; //seçilen hayvanların tutulacağı boş dizi
  for (let i = 0; i < animalCount; i++) {
    const pickIndex = rnd(0, tmpArr.length - 1); //rasgele hayvan seçilir
    pickedAnimals.push(tmpArr[pickIndex]); //pickedanimals dizisine eklenir.
    tmpArr.splice(pickIndex, 1);  //tmpArr dizisinden çıkartılır.
  }
  return pickedAnimals;  //seçilen hayvanların dizisi döndürülür
}

function createImgDiv(imageName) {   //belirli bir resmi içeren bir img elementi oluşturmak için kullanılabilir
  const img = document.createElement("img"); //<img> etiketi oluşturulur
  img.setAttribute("src", `assets/img/${imageName}.png`); //src ile resmin yolunu yazdık
  img.setAttribute("data-id", imageName); //data-id özelliğine imageName yazdık
  return img; //oluşşturulan resim elementi döndürülür
}

function rnd(min = 0, max) {   //min ve max parametreleri, rastgele sayının oluşturulacağı aralığı belirler. Math.random() fonksiyonu, 0 ile 1 arasında (1 dahil değil) rastgele bir sayı döndürür.(max - min + 1) ile çarpılarak ve min ile toplanarak, belirtilen aralık içinde bir rastgele tam sayı elde etmek için kullanılır.
  return Math.floor(Math.random() * (max - min + 1)) + min;  //Math.floor() fonksiyonu ile aşağıya yuvarlanır ve döndürülür.
};

/*1------------------ */
let flipLock = false;
function flipCard() {
  if (gameStatus !== GAME_STATUSES.start || flipLock) {
    return;
  }

  // Seçilen kart sayısı 2 veya daha fazlaysa, işlem yapmayı durdur
  if (choosenCards.length >= 2) {
    return;
  }

  let img = this.firstChild;
  let pick = img.getAttribute("data-id");
  this.classList.add("flipped");
  choosenCards.push({ pick, element: this }); // Her kartı hem adını hem de DOM öğesini saklayın

  if (choosenCards.length === 2) {
    let firstPick = choosenCards[0].pick;
    let secondPick = choosenCards[1].pick;

    if (firstPick === secondPick) {
      // Eşleşme kontrolü
      // İki kart eşleşirse, biraz bekleyerek işlem yapmayı durdur
      flipLock = true; // Kart dönüşlerini kilitle
      setTimeout(() => {
        // Kart dönüşlerini kilidi kaldır ve eşleşmeyi kontrol et
        flipLock = false;
        choosenCards.forEach(card => {
          card.element.classList.add("matched"); // Eşleşen kartları belirtmek için bir sınıf ekle
        });
        choosenCards = []; // Eşleşen kartları sıfırla
      }, 1000); // 1000 milisaniye (1 saniye) gecikme
    } else {
      // Eşleşme yoksa, biraz bekleyerek kartları geri çevir
      flipLock = true; // Kart dönüşlerini kilitle
      setTimeout(() => {
        choosenCards.forEach(card => {
          card.element.classList.remove("flipped"); // Eşleşmeyen kartları geri çevir
        });
        flipLock = false; // Kart dönüş kilidini kaldır
        choosenCards = []; // Kartları sıfırla
      }, 1000); // 1000 milisaniye (1 saniye) gecikme
    }
  }
}

function clearBoard() {
  grid.innerHTML = "";
}

function prepareGame() {
  document.documentElement.style.setProperty("--repeat-count", ROW + "");
  clearBoard();
  resetTimer();
  createBoard();
  fillBoard();
}

function startTimer() {
  gameStatus = GAME_STATUSES.start;
  let remaining = 60;
  let interval = setInterval(() => {
    remaining -= 1;
    timeEl.innerText = `00:${remaining}`;
    if (!remaining) {
      clearInterval(interval);
      alert("Zaman Doldu!");
    }
  }, 1000);
}

function resetTimer() {
  timeEl.innerHTML = "01:00";
}

function startGame() {
  switch (gameStatus) {
    case GAME_STATUSES.idle:
      startTimer();
      break;
    case GAME_STATUSES.start:
      startTimer();
      break;
    case GAME_STATUSES.reset:
      resetTimer();
      prepareGame();
      break;

    default:
      break;
  }

}
function removeFlippedCards() {
  const cards = document.querySelectorAll(".flipped:not(.won)");
  cards.forEach(function (item) {
    item.classList.remove("flipped");
  });
}

function addWonCard() {
  const cards = document.querySelectorAll(".flipped");
  cards.forEach((item) => item.classList.add("won"));
}

function checkMatch(lastPick) {

  console.log(choosenCards);

  if (choosenCards.every(x => x == choosenCards[0])) {
    addWonCard();
  } else {
    setTimeout(removeFlippedCards, 500);
  }

  // if (lastPick == choosenCards[0]) {

  // }
  choosenCards = [];
}

prepareGame();