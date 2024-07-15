<template>
  <div id="grid-wrapper">
    <div class="game-actions">
      <button @click="startGame" >Start</button>
      <span id="game_actions_time">{{time}}</span>
    </div>
    <div id="grid"> 
      <!--oyun tahtası için-->
      <div v-for="(animal, index) in shuffledAnimals" :key="index" class="grid-cell" @click="flipCard(index)">
        <img :src="'src/img/' + animal + '.png'" :data-id="animal">
      </div>
    </div>
  </div>

</template>
<script>
   import {ref,computed} from 'vue'
   export default{
      setup(){
        const ANIMALS = ["aslan", "fil", "kedi", "kopek", "ordek", "tavsan", "timsah", "zurafa"];
        const ROW = 4;
        const GAME_STATUSES = ref([
          "idle"= 0,
          "start"= 1,
          "reset"= 2
        ]);
        const gameStatus = ref(GAME_STATUSES.idle);
        const time = ref("01:00");
        const choosenCards = ref([]);
        const timeEl = document.getElementById("game_actions_time");

        const shuffledAnimals = computed(() => {
            return ANIMALS.concat(ANIMALS).sort(() => Math.random() - 0.5);
        });
        function createBoard () {
            const grid = document.getElementById("grid");
            let gridCell = ROW * ROW;
            for (let i = 0; i < gridCell; i++) {
              const cell = document.createElement("div");
              cell.classList.add("grid-cell");
              cell.addEventListener("click",() => flipCard(i));
              grid.appendChild(cell);
            }
          };
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
          function chooseAnimals(cellCount = ROW * ROW) {
             let animalCount = cellCount / 2;
             let tmpArr = [...ANIMALS];
             let pickedAnimals = [];
             for (let i = 0; i < animalCount; i++) {
                const pickIndex = rnd(0, tmpArr.length - 1);
                pickedAnimals.push(tmpArr[pickIndex]);
                tmpArr.splice(pickIndex, 1);
             }
            return pickedAnimals;
          }
          function createImgDiv(imageName) {
              const img = document.createElement("img");
              img.setAttribute("src", `assets/img/${imageName}.png`);
              img.setAttribute("data-id", imageName);
             return img;
          }
          function flipCard(index) {
              if (gameStatus.value !== GAME_STATUSES.start) {
                 return;
              }

              if (choosenCards.value.length >= 2) {
                 return;
              }

            let img = document.querySelector(`#grid .grid-cell:nth-child(${index + 1}) img`);
            let pick = img.getAttribute("data-id");
            let element = img.parentElement;
            element.classList.add("flipped");
            choosenCards.value.push({ pick, element });

            if (choosenCards.value.length === 2) { 
                     let firstPick = choosenCards.value[0].pick;
                   let secondPick = choosenCards.value[1].pick;

                 if (firstPick === secondPick) {
                      setTimeout(() => {
                        choosenCards.value.forEach(card => {
                          card.element.classList.add("matched");
                        });
                      choosenCards.value.splice(0, 2);
                     }, 1000);
                 } else {
                    setTimeout(() => {
                     choosenCards.value.forEach(card => {
                       card.element.classList.remove("flipped");
                     });
                     choosenCards.value.splice(0, 2);
                   }, 1000);
                 }
            }
          }
          function rnd(min = 0, max) {
             return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          function startGame () {
            switch (gameStatus.value) {
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
            }
          };
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

           if (choosenCards.every(x => x === choosenCards[0])) {
               addWonCard();
           } else {
              setTimeout(removeFlippedCards, 500);
           }
          choosenCards = [];
        }
        function resetTimer() {
          time.value = "01:00";
        }
        function startTimer() {
           gameStatus.value = GAME_STATUSES.start;
           let remaining = 60;
           let interval = setInterval(() => {
              remaining -= 1;
              time.value = `00:${remaining.toString().padStart(2, "0")}`;
              if (!remaining) {
                   clearInterval(interval);
                 alert("Zaman Doldu!");
              }
            }, 1000);
        }
        function prepareGame() {
           clearBoard();
           resetTimer();
           createBoard();
           fillBoard();
        }
        return{
            time,
            startGame,
            shuffledAnimals,
        }
     },
      mounted() {
       this.prepareGame();
      }
    
};
   
</script>
<style scoped>
  :root {
  --repeat-count: 4;
}

* {
  margin: 0;
  padding: 0;
}

img {
  width: 100%;
}

.hide {
  display: none;
}

#grid-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

#grid {
  display: grid;
  grid-template-columns: repeat(var(--repeat-count), 100px);
  grid-template-rows: repeat(var(--repeat-count), 100px);
  grid-auto-rows: 1fr;
  gap: 10px;
}

.grid-cell {
  height: 100px;
  background-color: #9E9E9E;
  border: solid 1px #9E9E9E;
  transition: all ease-out 0.5s;
}

.grid-cell.won {
  border: solid 1px red;
}

.grid-cell img {
  display: none;
}

.flipped.grid-cell img {
  display: block;
}

</style>