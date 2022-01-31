class AudioController {
    constructor() {
        this.background = new Audio('Music/Technologic.mp3');
        this.background.volume = 0.15;
        this.background.loop = true;
        this.flip_s = new Audio('Music/flip.mp3');
        this.match_s = new Audio('Music/match.mp3');
        this.fail_s = new Audio('Music/fail.mp3');
        this.win_s = new Audio('Music/Victory.mp3');
        this.lose_s = new Audio('Music/Defeat.mp3');
    }
    startMusic() {
        this.background.play();
    }
    stopMusic() {
        this.background.pause();
        this.background.currentTime = 0;
    }
    flip() {
        this.flip_s.play();
    }
    match() {
        this.match_s.play();
    }
    fail() {
        this.fail_s.play();
    }
    win() {
        this.stopMusic();
        this.win_s.play();
    }
    lose() {
        this.stopMusic();
        this.lose_s.play();
    }

}

class Matching {
    constructor(time_total, cards_in) {
        this.cardsArray = cards_in;
        this.time_total = time_total;
        this.time_remain = time_total;
        this.timer = document.getElementById('time');
        this.flips = document.getElementById('flips');
        this.paired = document.getElementById('paired');
        this.marks = document.getElementById('overlay-text-mark');
        this.marks1 = document.getElementById('overlay-text-mark1');
        this.audioController = new AudioController();
    
    }
    start() {
        this.flip_total = 0;
        this.card_check = null;
        this.totalMatch = 0;
        this.time_remain = this.time_total;
        this.matchedCards = [];
        this.pairs = 0;
        this.busy = true; //doing animation

        //Time delay before doing anything
        setTimeout(() => {
            this.shuffle();
            this.audioController.startMusic();
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);

        this.hide();
        this.timer.innerText = this.time_remain;
        this.flips.innerText = this.flip_total;
        this.paired.innerText = this.pairs;
    }

    over() {
        clearInterval(this.countdown);
        this.audioController.lose();
        document.getElementById('game_over').classList.add('visible')
        let fixed = this.flip_total / this.pairs;
        if (this.flip_total === 0 || this.pairs === 0)
            fixed = 0;
        this.marks.innerText = fixed.toFixed(1);
    }

    win() {
        clearInterval(this.countdown);
        this.audioController.win();
        document.getElementById('game_win').classList.add('visible')
        let fixed1 = this.flip_total / this.pairs;
        this.marks1.innerText = fixed1.toFixed(1);

    }

    startCountdown() {
        return setInterval(() => {
            this.time_remain--;
            this.timer.innerText = this.time_remain;
            if (this.time_remain === 0)
                this.over();
        }, 1000);
    }

    hide() {
        this.cardsArray.forEach(card =>{
            card.classList.remove('visible');
            card.classList.remove('matched');
            });
    }

    flipCard(card) {
        if (this.flippable(card)) {
            this.audioController.flip();
            this.flip_total++;
            this.flips.innerText = this.flip_total;
            card.classList.add('visible');

            if (this.card_check) {
                this.checkMatch(card);
            }
            else {
                this.card_check = card;
            }
        }
    }

    checkMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.card_check)) {
            this.matched(card,this.card_check);
        }
        else {
            this.Unmatched(card, this.card_check);
        }

        this.card_check= null;
    }

    matched(card1,card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        this.pairs++;
        this.paired.innerText = this.pairs;
        if (this.matchedCards.length === this.cardsArray.length)
            this.win();
    }

    Unmatched(card1,card2) {
        this.busy = true;
        this.audioController.fail();
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);

    }
    getCardType(card) {
        return card.getElementsByClassName('card_value')[0].src;
    }
    //shuffle card!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    shuffle() {
        //Fisher-Yates shuffle-> create j: a random integer such that 0 ¡Ü j ¡Ü i
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let rand = Math.floor(Math.random()*(i+1));
        //Then exchange a[j] and a[i]
            this.cardsArray[rand].style.order = i;
            this.cardsArray[i].style.order = rand;
        }

    }


    flippable(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.card_check);
        //1.not doing animation 2.not paired yet 3.not the same card
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMcontentLoaded', ready());
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Matching(100, cards);
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible')
            game.start();
        });
    });
    cards.forEach(card=> {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}


