let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
  'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
  'cards' : ['cards/2.png', 'cards/3.png', 'cards/4.png', 'cards/5.png', 'cards/6.png', 'cards/7.png', 'cards/8.png', 'cards/9.png', 'cards/10.png', 'cards/A.png', 
   'cards/J.png', 'cards/K.png', 'cards/Q.png'],
   'cardsMap': {'cards/2.png': 2, 'cards/3.png': 3, 'cards/4.png': 4, 'cards/5.png': 5, 'cards/6.png': 6, 'cards/7.png': 7, 'cards/8.png': 8
  , 'cards/9.png': 9, 'cards/10.png': 10, 'cards/A.png': [1, 11], 'cards/J.png': 10, 'cards/K.png': 10, 'cards/Q.png': 10 },
   'wins':0,
   'losses': 0,
   'draws' : 0,
   'isStand': false,
   'turnsOver': false,
 };
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('cards/swish.m4a');
const winSound = new Audio('cards/cash.mp3');
const lossSound = new Audio('cards/aww.mp3');
//Replacement of get element by id

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackhit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackhit() {
  if(blackjackGame['isStand'] === false) { //If stand is not yet activated only then hit should work
   let card = randomCard();
   showCard(card, YOU);
   updateScore(card, YOU);
   showScoreFunction(YOU);
  }
  
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
  if(activePlayer['score'] <=21) {
  let cardImage = document.createElement('img');
  if(cardImage && cardImage.style) {
    cardImage.style.height = '70px';
    cardImage.style.width = '70px';
  }

  cardImage.src = card;
  document.querySelector(activePlayer['div']).appendChild(cardImage);
  hitSound.play();
}
}

function blackjackDeal() {
  /*showResult(computeWinner()); */
  if(blackjackGame['turnsOver'] === true) {
    blackjackGame['isStand'] = false;
    let yourImage = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImage = document.querySelector('#dealer-box').querySelectorAll('img');
    for(i=0; i<yourImage.length; i++) {
      yourImage[i].remove();
    }
    for(i=0; i<dealerImage.length; i++) {
      dealerImage[i].remove();
    }
    YOU['score']=0;
    DEALER['score']=0;
    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;

    document.querySelector('#your-blackjack-result').style.color = '#ffffff';
    document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

    document.querySelector('#blackjack-result').textContent = "Let's play";
    document.querySelector('#blackjack-result').style.color = 'black';

    blackjackGame['turnsOver'] = true;
  }
}

function updateScore(card, activePlayer) {
  if(card === 'cards/A.png') {
  //if adding 11 keeps me below 21, add 11, otherwise add 1 [ace]
    if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <=21) {
         activePlayer['score'] += blackjackGame['cardsMap'][card][1];
  } else {
    activePlayer['score'] += blackjackGame['cardsMap'][card][0];
  }
} else {
  activePlayer['score'] += blackjackGame['cardsMap'][card];
}
}

function showScoreFunction(activePlayer) {
  if(activePlayer['score'] > 21){
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    
  } else {
  document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function dealerLogic() {
  blackjackGame['isStand'] = true;
  while(DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
   let card = randomCard();
   showCard(card, DEALER);
   updateScore(card, DEALER);
   showScoreFunction(DEALER);
   await sleep(1000);
  }
  
  blackjackGame['turnsOver']= true;
  let winner = computeWinner();
  showResult(winner);
  
}

//computing winner
//update win, losses, drwasd
let winner;
function computeWinner() {

   if(YOU['score'] <=21) {
     //higher score than dealer or if dealer bust
     if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
       blackjackGame['wins']++;
      console.log('You Won');
       winner = YOU;
     } else if(YOU['score'] < DEALER['score']) {
      blackjackGame['losses']++;
      console.log('You lost');
       winner = DEALER;
     }else if(YOU['score'] === DEALER['score']) {
      blackjackGame['draws']++;
       winner = null;
       console.log('You drew');
     }
     //condition when user bust but dealer doesnt
   } else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
     blackjackGame['losses']++;
     console.log('You lost');
     winner = DEALER;
   } //condition when both bust
   else if(YOU['score'] > 21 && DEALER['score'] > 21) {
     blackjackGame['draws']++;
     winner = null;
     console.log('You drew!');
   }
   console.log(blackjackGame);
   return winner;
}

//Displaying results
function showResult() {
  let message, messageColor;
  if(blackjackGame['turnsOver'] === true) {
   if(winner === YOU) {
     document.querySelector('#wins').textContent = blackjackGame['wins'];
     message = 'YOU WON!';
     messageColor = 'green';
     winSound.play();
   } else if(winner === DEALER) {
      document.querySelector('#losses').textContent = blackjackGame['losses'];
      message = "YOU LOST!";
      messageColor = 'red';
      lossSound.play();
   } else if(winner == null) {
      document.querySelector('#draws').textContent = blackjackGame['draws'];
      message = "YOU DREW!";
      messageColor = 'black';
   }
     document.querySelector('#blackjack-result').textContent = message;
     document.querySelector('#blackjack-result').style.color = messageColor;
  }
}