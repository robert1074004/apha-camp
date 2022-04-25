const GAME_STATE = {
    FirstCardAwaits: 'FirstCardAwaits',
    SecondCardAwaits: 'SecondCardAwaits',
    CardsMatchFailed: 'CardsMatchFailed',
    CardsMatched: 'CardsMatched',
    GameFinished: 'GameFinished',
}
const Symbols = [
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
  ]

const view = {
    getCardElement (index) {
        return `<div class="card back" data-index = "${index}">
      </div>`
    },
    getCardContent (index) {
        const number = this.transformNumber((index % 13 ) + 1)
        const symbol = Symbols[Math.floor(index/13)]
        return `
        <p>${number}</p>
        <img src="${symbol}">
        <p>${number}</p>
      `
    },
    flipCards (...cards) {
        cards.map(card => {
            if (card.classList.contains('back')) {
                // 回傳正面
                card.classList.remove('back')
                card.innerHTML = this.getCardContent(Number(card.dataset.index))
                return
            }
            // 回傳背面
            card.classList.add('back')
            card.innerHTML = null
        }) 
    },
    displayCards (indexs) {
        const rootElement = document.querySelector('#cards')
        rootElement.innerHTML = indexs.map(index => this.getCardElement(index)).join('')
    },
    transformNumber (number) {
        switch (number) {
            case 1:
                return 'A'
            case 11:
                return 'J'
            case 12:
                return 'Q'
            case 13:
                return 'K'
            default:
                return number                
        }
    },
    pairCards (...cards) {
        cards.map(card => {card.classList.add('paired')})   
    },
    renderScore(score) {
        document.querySelector('.score').innerText = `Score: ${score}`
    },
    renderTriedTimes(times) {
        document.querySelector('.tried').innerText = `You've tried: ${times} times`
    },
    appendWrongAnimation(...cards) {
        cards.map(card => {
            card.classList.add('wrong')
            card.addEventListener('animationend',function () {
                this.classList.remove('wrong'),{once:true}
            } )       
        })
    },
    showGameFinished () {
        const div = document.createElement('div')
        div.classList.add('completed')
        div.innerHTML = `
        <p>Complete!</p>
        <p>Score: ${model.score}</p>
        <p>You've tried: ${model.triedTimes} times</p>
      `
        const header = document.querySelector('#header')
        header.before(div)
    }
}
const utility = {
    getRandomNunberArray (count) {
        const number = Array.from(Array(count).keys())
        for (let index = number.length - 1 ; index > 0 ; index--) {
            let randomIndex = Math.floor(Math.random()*(index+1));[number[index],number[randomIndex]] = [number[randomIndex],number[index]]
        }
        return number
    }
}
const controller = {
    currentState: GAME_STATE.FirstCardAwaits,
    generateCards () {
        view.displayCards(utility.getRandomNunberArray(52))
    },
    dispatchCardAction (card) {
        if (!card.classList.contains('back')) {
            return
        }
        switch (this.currentState) {
            case GAME_STATE.FirstCardAwaits :
                view.flipCards(card)
                model.revealCards.push(card)
                this.currentState = GAME_STATE.SecondCardAwaits
                break
            case GAME_STATE.SecondCardAwaits:
                view.renderTriedTimes(model.triedTimes++)
                view.flipCards(card)
                model.revealCards.push(card)
                // 判斷是否成功
                if (model.isRevealedCardsMatched()) {
                    // 配對成功
                    view.renderScore(model.score += 10)
                    this.currentState = GAME_STATE.CardsMatched
                    view.pairCards(...model.revealCards)
                    model.revealCards = []
                    if (model.score === 260) {
                        this.currentState = GAME_STATE.GameFinished
                        view.showGameFinished()
                        return
                    }
                    this.currentState = GAME_STATE.FirstCardAwaits
                } else {
                    // 配對失敗
                    this.currentState = GAME_STATE.CardsMatchFailed
                    view.appendWrongAnimation(...model.revealCards)
                    setTimeout(this.resetCards,1000)
                }   
                break
        }
        console.log('this.currentState', this.currentState)
},
    resetCards () {
        view.flipCards(...model.revealCards)
        model.revealCards = []
        controller.currentState = GAME_STATE.FirstCardAwaits
    }
}
const model = {
    revealCards : [],
    isRevealedCardsMatched() {
        return this.revealCards[0].dataset.index % 13 === this.revealCards[1].dataset.index % 13
    },
    score:0,
    triedTimes:0
}
controller.generateCards()
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click',event => {
        controller.dispatchCardAction(card)
    })
})

