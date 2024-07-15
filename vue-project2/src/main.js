import './assets/main.css'
/*
import App from './App.vue'

createApp(App).mount('#app')*/

import { createApp, ref, reactive, watch, computed }  from 'vue'
createApp({
    setup() {
        const ANIMALS = ["aslan", "fil", "kedi", "köpek", "ördek", "tavşan", "timsah", "zürafa"];
        const ROW = 4;
        const GAME_STATUSES = {
          "idle": 0,
          "start": 1,
          "reset": 2
        }; 
        const time = ref('01:00');
        const gameStatus = ref(GAME_STATUSES.idle);
        const chosenCards = reactive([]);

        function createBoard () {
            const grid = document.getElementById("grid");
            let gridCell = ROW * ROW;
            for (let i = 0; i < gridCell; i++) {
              const cell = document.createElement("div");
              cell.classList.add("grid-cell");
              cell.addEventListener("click", flipCard);
              grid.appendChild(cell);
            }
          };
          function fillBoard () {
            const cells = document.querySelectorAll(".grid-cell");
            let pickedAnimals = chooseAnimals();
            pickedAnimals = pickedAnimals.concat(pickedAnimals);
            pickedAnimals.sort(() => 0.5 - Math.random());
            for (let index = 0; index < cells.length; index++) {
              const gridCell = cells[index];
              const pickAnimal = pickedAnimals[index];
              const img = createImgDiv(pickAnimal);
              gridCell.appendChild(img);
            }
          };
          function chooseAnimals (cellCount = ROW * ROW){
            let animalCount = cellCount / 2;
            let tmpArr = [...ANIMALS];
            let pickedAnimals = [];
            for (let i = 0; i < animalCount; i++) {
              const pickIndex = rnd(0, tmpArr.length - 1);
              pickedAnimals.push(tmpArr[pickIndex]);
              tmpArr.splice(pickIndex, 1);
            }
            return pickedAnimals;
          };
          function createImgDiv (imageName) {
            const img = document.createElement("img");
            img.setAttribute("src", `assets/img/${imageName}.png`);
            img.setAttribute("data-id", imageName);
            return img;
          };
         function rnd (min = 0, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };
          function flipCard (event) {
            if (gameStatus.value !== GAME_STATUSES.start) {
              return;
            }
      
            if (chosenCards.length >= 2) {
              return;
            }
      
            let img = event.target.firstChild;
            let pick = img.getAttribute("data-id");
            event.target.classList.add("flipped");
            chosenCards.push({ pick, element: event.target });
      
            if (chosenCards.length === 2) {
              let firstPick = chosenCards[0].pick;
              let secondPick = chosenCards[1].pick;
      
              if (firstPick === secondPick) {
                setTimeout(() => {
                  chosenCards.forEach(card => {
                    card.element.classList.add("matched");
                  });
                  chosenCards.splice(0, 2);
                }, 1000);
              } else {
                setTimeout(() => {
                  chosenCards.forEach(card => {
                    card.element.classList.remove("flipped");
                  });
                  chosenCards.splice(0, 2);
                }, 1000);
              }
            }
          };
         function clearBoard () {
            const grid = document.getElementById("grid");
            grid.innerHTML = "";
          };
         function prepareGame (){
            document.documentElement.style.setProperty("--repeat-count", ROW + "");
            clearBoard();
            resetTimer();
            createBoard();
            fillBoard();
          };
        function startTimer(){
            gameStatus.value = GAME_STATUSES.start;
            let remaining = 60;
            let interval = setInterval(() => {
              remaining -= 1;
              gameTime.value = `00:${remaining}`;
              if (!remaining) {
                clearInterval(interval);
                alert("Zaman Doldu!");
              }
            }, 1000);
          };
         function resetTimer(){
           time.value = "01:00";
          };
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

        
        return{
            time,
            startGame,
            gameStatus
           
        }

    }
}).mount('#app1');