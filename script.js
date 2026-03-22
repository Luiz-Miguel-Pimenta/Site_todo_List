const doListForm = document.querySelector("form");
const quickListInput = document.getElementById("QuickList_input");
const lista_Ul = document.getElementById("lista");

//localStorage.removeItem("itens") //serve para remover os itens do banco de dados (só para testes)
let todasTarefas = buscarItensNoBancoDeDados();
atualizarListaVisivel();
console.log(todasTarefas);

doListForm.addEventListener("submit", function(error){
    error.preventDefault();
    adiconaItem();
});

function adiconaItem(){
    let textoInput = quickListInput.value.trim(); // a função trim() serve para remover espaços indejasedos no final e no inicio das strings
    
    const itemObject = {  //Cria-se um objeto da tarefa para armazenar se a tarefa está concluída ou não.
        texto: textoInput,
        concluido: false
    };
    
    todasTarefas.push(itemObject);
    atualizarListaVisivel();
    salvarItensNoBancoDeDados();

    quickListInput.value = "";
};

function atualizarListaVisivel(){
    lista_Ul.innerHTML = ""; /*Limpa a lista na tela*/

    todasTarefas.forEach((item, posicaoItem) => { /*percorre todas as tarefas da lista "todasTarefas"*/
        let item_lista = criarItemVisivel(item, posicaoItem); /*chama a função para criar um item HTML na variável item_lista*/
        lista_Ul.append(item_lista); /*adiciona o item na lista da tela*/
    });
}

function criarItemVisivel(item, posicaoItem){
    const item_LI = document.createElement("li"); /*Cria um elemento <li>*/
    const item_ID = `item-${posicaoItem}` /*armazena a posição do item da lista "todasTarefas" em uma variável*/
    const item_texto = item.texto;
    item_LI.className = "item" /*Atribui a class "item" ao item_LI*/
    item_LI.innerHTML = `
        <input type="checkbox" id="${item_ID}">
        <label class="checkbox-item" for="${item_ID}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="transparent">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>

        <label class="texto-item" for="${item_ID}">
                ${item_texto}
        </label>

        <button class="botao-deleta">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--secondary-color)">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `

    const button_delete = item_LI.querySelector(".botao-deleta"); //Usa o "item_LI" e não "document", pois cada item tem seu próprio "botao-deleta"
    button_delete.addEventListener("click", () => {
        deletarItemLista(posicaoItem);
    })

    const checkbox = item_LI.querySelector("input");
    checkbox.addEventListener("change", () => {
        todasTarefas[posicaoItem].concluido = checkbox.checked; // "..checked" serve para checar se a "type="checkbox" está marcado (true) ou não (false)
        salvarItensNoBancoDeDados();
    })

    checkbox.checked = item.concluido; //Se no objeto a tarefa estiver marcada como concluída (true), então mostre este checkbox marcado na tela."

    return item_LI; //retorna uma <li> com o texto da tarefa
}

function deletarItemLista(posicaoItem){
    todasTarefas = todasTarefas.filter((_, i) => i !== posicaoItem) 
    /* O método .filter() cria uma nova lista, percorrendo cada item da lista original (todasTarefas). 
       "i" representa o índice (a posição) do item que o código está olhando no momento.
       O filtro diz: "Mantenha na lista todos os itens onde a posição "i" não seja igual à "posicaoItem"""
    */
   salvarItensNoBancoDeDados();
   atualizarListaVisivel();
}

function salvarItensNoBancoDeDados(){
    const itensJson = JSON.stringify(todasTarefas) /*Transforma os itens do Arrat "todasTarefas" em um JSON*/
    localStorage.setItem("itens", itensJson)
}

function buscarItensNoBancoDeDados(){
    const itens = localStorage.getItem("itens") || "[]" /*Retorna os itens do banco de dados OU um array vazio*/
    return JSON.parse(itens); /*Transforma o JSON em um Array de volta */
}

