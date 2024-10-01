let url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt";
const section_cartas = document.getElementById('section_cartas');
const modal = document.getElementById('modal');
const modal_infomacoes = document.getElementById('modal_informacoes');
const x_fecha_modal = document.getElementById('x_fecha_modal');
const quantidade_cartas_deck = document.getElementById('quantidade_cartas_deck')
const botao_procurar = document.getElementById('botao_procurar');
const botao_deck = document.getElementById('botao_deck');
const menu_procurar = document.getElementById('procurar_div');
const corpo_body = document.getElementById('corpo_body');
const menu = document.getElementById('menu');
const background_procurar = document.getElementById('background_procurar');
const imagem_logo = document.getElementById('imagem_logo');

background_procurar.addEventListener("click", ()=>{
    menu_procurar.classList.toggle('desativar_procura');

});

botao_procurar.style.cursor = 'pointer';
botao_procurar.addEventListener("click", () => {
    menu_procurar.classList.toggle('desativar_procura');
    menu_procurar.classList.toggle('ativar_procura');    
});

x_fecha_modal.addEventListener("click", abre_fecha_modal);

function abre_fecha_modal(){
    modal.classList.toggle('desativado');
    modal.classList.toggle('ativado');    
    corpo_body.classList.toggle('scroll_body');
}

section_cartas.style.minHeight = (window.innerHeight - 150 - 40) +"px";  

function atualizar_cartas(url){

    fetch(url)
    .then(response => response.json())
    .then((data) => {
        //console.log(data.data)
        let lista_total_cartas = data.data;
        var limite_cartas_tela = 0;
        let cartas_amostrar = lista_total_cartas;
        let favoritos = (localStorage.length > 0) ? JSON.parse(localStorage.getItem("Deck")) : [];
        quantidade_cartas_deck.innerHTML = (10 > favoritos.length > 0)? ("0" + favoritos.length) : favoritos.length;

        imagem_logo.style.cursor = 'pointer';
        imagem_logo.addEventListener("click", () => {
            section_cartas.innerHTML = "";
            limite_cartas_tela = 0;
            cartas_amostrar = lista_total_cartas;
            inserir_x_cartas(12);
        })
        
        let lista_ids = [];
        function pegar_ids(lista_favoritos){
            let lista_i = []
            lista_favoritos.map((item_lista)=>{
                lista_i.push(item_lista.id);
            })
            return lista_i   
        }
        function definir_icone_favoritos(x, lista){
            lista = pegar_ids(lista);
            console.log(lista)
            return (lista.includes(x)) ? "imagens/card-burn.svg":"imagens/card-draw.svg";
        }

        function adicionar_carta(item){
            const div_container = document.createElement('div');
            const img_icone = document.createElement('img');
            const img = document.createElement('img');
            const imagem_carta = item.card_images[0].image_url;
            
            img_icone.classList.add('img_icone');
            img_icone.alt = "Adicionar ou remover carta ao Deck";
            img_icone.src = definir_icone_favoritos(item.id, favoritos);
            //FUNCAO PARA ADICIONAR OU RETIRAR DOS FAVORITOS
            img_icone.addEventListener("click", ()=>{
                lista_ids = pegar_ids(favoritos);
                console.log(lista_ids)
                console.log(item.id)
                if (!(lista_ids.includes(item.id))){
                    if (lista_ids.length >= 60){
                        alert("Número Máximo de cartas no deck atingido! Para continuar remova uma carta!");
                    } else {
                        favoritos.push(item);
                    }
                } else{
                    const indice = lista_ids.indexOf(item.id);
                    favoritos.splice(indice,1);
                }
                img_icone.src = definir_icone_favoritos(item.id, favoritos);
                localStorage.setItem("Deck", JSON.stringify(favoritos));
                quantidade_cartas_deck.innerHTML = (10 > favoritos.length >=1) ? ("0" + favoritos.length) : favoritos.length;
            })
            
            img.classList.add('img_cartas');
            img.src = imagem_carta;

            div_container.classList.add('div_content');
            div_container.appendChild(img);
            div_container.appendChild(img_icone);
            
            section_cartas.appendChild(div_container);
            //ADICIONAR MODAL
            img.addEventListener("click",()=>{
                abre_fecha_modal();
                
                
                modal_infomacoes.innerHTML = `
                <img src="${imagem_carta}" class="img_modal" alt="">
                <div id="infomacoes">
                <ul class="ul_informacoes">
                <li class="informacoes_cartas nome_carta">
                <p>Nome:</p>
                <p>${item.name}</p>
                </li>
                <li class="informacoes_cartas tipo_carta">
                <p>Tipo:</p>
                <p>${item.type}</p>
                </li>
                ${
                    (item.level != undefined) ? 
                    `<li class="informacoes_cartas atributo_carta">
                    <p>Atributo:</p>
                    <p>${item.attribute}</p>
                    </li>
                    <li class="informacoes_cartas level_carta">
                    <p>Level:</p>
                    <p>${item.level}</p>
                    </li>` : ""
                }
                
                <li class="informacoes_cartas desc_carta">
                <p>Descrição:</p>
                <p>${item.desc}</p>
                </li>
                </ul>
                </div>
                `;
            });
        }


        function inserir_x_cartas(quantidade){
            quantidade = (quantidade >= cartas_amostrar.length) ? cartas_amostrar.length : quantidade; 
            for ( j = 0; j < quantidade; j++ ) {
                adicionar_carta(cartas_amostrar[limite_cartas_tela]);
                limite_cartas_tela++;
            };
        }
        /*
        const tipos = lista_total_cartas.map(item => item.atk)
        const tipos_unicos = [new Set(tipos)]
        console.log(tipos_unicos)
        */

        /* DECK COM AS CARTAS FAVORITAS */

        function mostrar_deck(){
            //deck_inicial = favoritos.length;
            let tamanho = (favoritos.length > 12) ? 12 : favoritos.length;
            if (tamanho === 0) return alert("Não há cartas no Deck!");
            section_cartas.innerHTML = "";
            limite_cartas_tela = 0;
            cartas_amostrar = favoritos;
            //console.log(cartas_amostrar);
            inserir_x_cartas(tamanho);
        }

        botao_deck.style.cursor = 'pointer';
        botao_deck.addEventListener("click", mostrar_deck);

         
        inserir_x_cartas(12);
        // CONSULTAR CARTAS DE ACORDO COM O (NOME DO ATRIBUTO, )
        function retornar_consulta(atributo_procurado, id_input){
            const input = document.getElementById(id_input);
            function consulta(item){
                try{
                    return item[atributo_procurado].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(document.getElementById(id_input).value.toLowerCase()); //primeiro coloca o nome para lower case depois retira os acentos.
                } catch (err){
                    return item[atributo_procurado] === parseInt(document.getElementById(id_input).value); //primeiro coloca o nome para lower case depois retira os acentos.
                    
                }
            };
            input.addEventListener('keyup', ()=>{
                const procurar_p = document.getElementById('procurar_p');
                limite_cartas_tela = 0;
                section_cartas.innerHTML = ""
                const cartas_com_informacao_procurada = lista_total_cartas.
                filter(item => item[atributo_procurado] !== undefined);
                const resultado_consulta = cartas_com_informacao_procurada.filter(consulta);
                
                resultado_consulta.slice(0,limite_cartas_tela).map(adicionar_carta);
                if (input.value.length > 0){
                    cartas_amostrar = resultado_consulta;
                    procurar_p.innerHTML = `${cartas_amostrar.length} Cards Encontrados`;
                } else {
                    cartas_amostrar = lista_total_cartas
                    procurar_p.innerHTML = "Utilize um dos campos para pesquisar!";
                }
                //console.log(input.value.length);
                inserir_x_cartas(9);
            })
        }
        
       
        retornar_consulta('name', 'pesquisar_nome');
        retornar_consulta('type', 'pesquisar_tipo');
        retornar_consulta('race', 'pesquisar_raca');
        retornar_consulta('attribute', 'pesquisar_atributo');
        retornar_consulta('level', 'pesquisar_level');
        retornar_consulta('atk', 'pesquisar_atk');
        retornar_consulta('def', 'pesquisar_def');
        
        // SCROLL INFINITO
        window.addEventListener("scroll", () =>{
            if ((window.scrollY + window.innerHeight + 5) > document.body.scrollHeight){
                console.log(limite_cartas_tela);
                console.log(cartas_amostrar);
                inserir_x_cartas(9);
            };
            if (window.scrollY > menu.clientHeight){
                menu.classList.add('fixar_menu_topo');
            } else {
                menu.classList.remove('fixar_menu_topo');
            }
        } );
    })//final do then
}
atualizar_cartas(url);