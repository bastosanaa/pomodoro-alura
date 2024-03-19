const adicionarTarefaBt = document.querySelector('.app__button--add-task')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textareaAdicionarTarefa = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const cancelarBt = document.querySelector('.app__form-footer__button--cancel')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

const removerConcluidasBt = document.querySelector('#btn-remover-concluidas')
const removerTodasBt = document.querySelector('#btn-remover-todas')
//retorna as tarefas guardadas localmente como strings e as transforma em objeto
// ou retorna uma lista vazia de tarefas caso nao tenha nada guardado
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas (){
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
 
}

function limparFormulario() {
    textareaAdicionarTarefa.value = ''
    formAdicionarTarefa.classList.add('hidden')
}


function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E"></path>
    </svg>
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }
        
        
    }

    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src' , '/imagens/edit.png')
    botao.append(imagemBotao)

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if (tarefa.completa){
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elementoTarefa => {
                    elementoTarefa.classList.remove('app__section-task-list-item-active')
                })
            if (tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            
            li.classList.add('app__section-task-list-item-active')
        }
    }


    return li
}

adicionarTarefaBt.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    // impedir o refresh padrao da pagina após um submit
    evento.preventDefault();
    const tarefa = {
        descricao: textareaAdicionarTarefa.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    limparFormulario()
});

cancelarBt.addEventListener('click',limparFormulario)

tarefas.forEach(tarefa => { 
    const elementoTarefa =  criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

document.addEventListener('FocoFinalizado' , () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
});

const removerTarefas = (somenteCompletas) => {
    let seletor = ".app__section-task-list-item"
    if (somenteCompletas) {
        seletor = ".app__section-task-list-item-complete"
    }
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    // if ternário (se somenteCompletas true ... else : ...)
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

removerConcluidasBt.onclick = () => removerTarefas(true)
removerTodasBt.onclick = () => removerTarefas(false)