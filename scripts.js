const html = document.querySelector('html');
const displayTempo = document.querySelector('#timer');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const iniciarOuPausarBt =document.querySelector('#start-pause span')
const playPauseLogo = document.querySelector('.app__card-primary-butto-icon')
const musicaFocoInput = document.querySelector('#alternar-musica')
const tempoNaTela = document.querySelector('#timer')

const musica = new Audio('/sons/luna-rise-part-one.mp3')
musica.loop = true;
musica.volume  = 0.3;
const playSom = new Audio('/sons/play.wav')
const pauseSom = new Audio('/sons/pause.mp3')
const TempoFinalizadoSom = new Audio('/sons/beep.mp3')

const duracaoFoco = 1500; 
const duracaoDescansoCurto = 300; 
const duracaoDescansoLongo = 900;

let tempoDecorridoEmSegundos = 5 
let intervaloId = null

//sons
musicaFocoInput.addEventListener('change', function() {
    if(musica.paused){
        musica.play()
    } else {
        musica.pause()
    }
})


//alterar contexto
focoBt.addEventListener('click', function() {
    tempoDecorridoEmSegundos = duracaoFoco
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', function() {
    tempoDecorridoEmSegundos = duracaoDescansoCurto
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')    
})

longoBt.addEventListener('click', function() {
    tempoDecorridoEmSegundos = duracaoDescansoLongo
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})


function alterarContexto(contexto){
    mostrarTempo()
    botoes.forEach(function (contexto){
        contexto.classList.remove('active')
    })

    html.setAttribute('data-contexto' , contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = 
            `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case "descanso-curto":
            titulo.innerHTML =
            `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;
        case "descanso-longo":
            titulo.innerHTML =
            `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0){
        TempoFinalizadoSom.play()
        alert('Tempo Finalizado!')
        // evento de finalizacao de tarefa
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerarContagemRegressiva()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if (intervaloId){
        pauseSom.play()
        iniciarOuPausarBt.textContent = "Começar"
        playPauseLogo.setAttribute('src' , '/imagens/play_arrow.png')
        zerarContagemRegressiva()
        return
    }
    playSom.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar"
    playPauseLogo.setAttribute('src' , '/imagens/pause.png')
}

function zerarContagemRegressiva() {
    clearInterval(intervaloId)
    intervaloId = null
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second:'2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()