let Input;
let adj_map = new Map(); //Map de adjacência
let pos = new Map(); //Posições dos vértices
let color = new Map(); //Cor de cada vértice

//Lista de steps da animação
let animationSteps = [];
let currentStep = 0;

let lastUpdate = 0;
let delay = 1000; // ms animação

function setup(){
    let canvas = createCanvas(500,500);
    background(220);
    canvas.parent('canvas-side'); 

    //Input
    Input = createElement('textarea');
    Input.parent('graph-builder-container');
    Input.size(300, 100);
    Input.attribute(
        'placeholder',
        '1 2\n3 4'
    );

    // Opções de geração do grafo
    layoutRadio = createRadio();
    layoutRadio.parent('graph-builder-container');

    layoutRadio.option('random', 'Random');
    layoutRadio.option('layer', 'Layered');
    layoutRadio.option('F&R', 'Fruchterman & Reingold');
    
    layoutRadio.selected('random'); // padrão

    //Desenhar grafo
    Button_draw = createButton('Draw');
    Button_draw.parent('graph-builder-container');
    Button_draw.mousePressed(draw_graph);

    //Animações
    Button_dfs = createButton('DFS');
    Button_dfs.parent('graph-builder-container');
    Button_dfs.mousePressed(draw_dfs);

    Button_bfs = createButton('BFS');
    Button_bfs.parent('graph-builder-container');
    Button_bfs.mousePressed(draw_bfs);
}

function input_processing(){
    let graph_input =  Input.value().split('\n'); //Separando valores do input em um array: string "v1 v2,v3 v4,..""
    adj_map.clear(); 
    pos.clear();
    color.clear();

    // let n = parseInt(graph_input[0].trim()); //Número de vértices
    //console.log(n);

    //Separa os vértices de cada aresta, converte de string para inteiro e constroi map de adj.
    for(let i = 0; i < graph_input.length; i++){ 
        if (graph_input[i].trim() === "") continue; //Trata linhas em branco

        let edge = graph_input[i].trim().split(/\s+/).map(Number); //edge[] = {x1,x2}
        //console.log(edge);

        //Trata caso seja a primeira inserção
        if (!adj_map.has(edge[0])) {
            adj_map.set(edge[0], []);
        }

        if (!adj_map.has(edge[1])) {
            adj_map.set(edge[1], []);
        }

        adj_map.get(edge[0]).push(edge[1]);
        adj_map.get(edge[1]).push(edge[0]);
    }
}

function set_pos(){
    let selectedLayout = layoutRadio.value(); //Tipo de geração grafos

    const layer_vertices = () =>{
        let vis = new Set();
        // let pai = new Map();

        const bfs = (x) =>{
            let queue = [];
            let head = 0;
            vis.add(x);
            queue.push(x);
            // pai.set(v, null);

            //Setar posição -  centro
            pos.set(x, {
                x: random(100, width - 100),
                y: random(100, height - 100)
            });

            while(head < queue.length){
                let v = queue[head]; head++;
                for(const viz of adj_map.get(v)){
                    if(!vis.has(viz)){
                        // pai.set(viz, v);
                        vis.add(viz);
                        queue.push(viz);

                        //Setar posição
                        pos.set(viz, {
                            x: pos.get(v).x + random(-100,100),
                            y: pos.get(v).y + 100
                        });
                    }
                }
            }
        }

        for(const x of adj_map.keys()){
            if(!vis.has(x)){
                bfs(x);
            }
        }
    }

    const random_vertices = () =>{
        //Posições randomicas
        for (const v of adj_map.keys()) {
            pos.set(v, {
                x: random(25, width - 25),
                y: random(25, height - 25)
            });
        }
    }

    const fr_vertices = () => {
        //Iniciar posições randômicas;
        random_vertices();
        
        let k = 35; //spring lenght
        let temp = 8.5; //Temp

       for(let t = 0; t < 1000; t++){

            //Mapa de deslocamento
            let disp = new Map(); 
            for (const v of adj_map.keys()) { 
                disp.set(v, { x: 0, y: 0 }); 
            }

            //Cálculo da força de repulsão
            for (const v of adj_map.keys()) {
                for (const u of adj_map.keys()) {

                    if(v == u) continue;

                    //Posições
                    let pv = pos.get(v); 
                    let pu = pos.get(u); 

                    //Vetor
                    let dx = pv.x - pu.x; 
                    let dy = pv.y - pu.y;

                    //Distância euclidiana
                    let dist = max(sqrt(dx*dx + dy*dy),0.01);

                    //Força de repulsão em v por u
                    let force = (k*k)/dist;
                    let dx_un = dx/dist;
                    let dy_un = dy/dist;

                    disp.get(v).x += dx_un * force;
                    disp.get(v).y += dy_un * force;
                }
            }

            //Cálculo da força de atração
            for (const [v, vizinhos] of adj_map) {
                for (const viz of vizinhos) {
                    if(v < viz){
                        //Posições
                        let pv = pos.get(v); 
                        let pviz = pos.get(viz); 

                        //Vetor
                        let dx = pv.x - pviz.x; 
                        let dy = pv.y - pviz.y;

                        //Distância euclidiana
                        let dist = max(sqrt(dx*dx + dy*dy),0.01);

                        //Força de atração entre v e viz
                        let force = (dist*dist)/k;
                        let dx_un = dx/dist;
                        let dy_un = dy/dist;

                        disp.get(v).x -= dx_un * force; 
                        disp.get(v).y -= dy_un * force; 
                        disp.get(viz).x += dx_un * force; 
                        disp.get(viz).y += dy_un * force;
                    }
                }
            }

            //Atualização das posições
            for (const v of adj_map.keys()) {

                let dx =  disp.get(v).x;
                let dy = disp.get(v).y;
                let norm = sqrt((dx*dx)+(dy*dy));

                if(norm > 0){
                    let move = min(temp,norm);
                    let dx_un = dx/norm;
                    let dy_un = dy/norm;

                    pos.get(v).x += dx_un*move;
                    pos.get(v).y += dy_un*move;

                    //Limita a posição para dentro do canvas
                    pos.get(v).x = constrain(
                        pos.get(v).x,
                        25,
                        width - 25
                    );

                    pos.get(v).y = constrain(
                        pos.get(v).y,
                        25,
                        height - 25
                    );
                }
            }
            //CoolDown
            temp *= 0.965;
       }
    }

    if (selectedLayout === 'random') {
        random_vertices();
    }
    else if (selectedLayout === 'layer') {
        layer_vertices();
    }
    else if (selectedLayout === 'F&R') {
        fr_vertices();
    }
}

function render_graph(){
    background(220);

    const draw_edge = () =>{
        //Desenha as arestas O(n+m)
        for (const [v, vizinhos] of adj_map) {
            let p = pos.get(v);

            for (const viz of vizinhos) {
                if (v < viz) {
                    let pz = pos.get(viz);
                    line(p.x, p.y, pz.x, pz.y);
                }
            }
        }
    }

    const draw_vertices = () =>{
        //Desenha os vértices O(n)
        let diametro = 25;
        for (const v of adj_map.keys()) {
            let p = pos.get(v);
            fill(color.get(v)); 
            stroke(0);
            circle(p.x, p.y, diametro);
            fill(0); 
            textSize(10);
            textAlign(CENTER, CENTER);
            text(v, p.x, p.y);
        }
    }

    draw_edge();
    draw_vertices();
}

function draw_graph(){
    //Processa o input atual
    input_processing();
    //Seta as posições dos vértices pelo tipo de geração atual
    set_pos();

    //Coloca todo o grafo em cinza
    for (const v of adj_map.keys()) {
        color.set(v, 255);
    }

    //Limpa as animações
    animationSteps = [];
    currentStep = 0;
}

function draw_dfs(){

    //Limpa as animações
    animationSteps = [];
    currentStep = 0;

    //Coloca o grafo na cor padrão
    for (const v of adj_map.keys()) {
        color.set(v, 255);
    }

    let vis = new Set();

    const dfs = (v, pai) => {
        vis.add(v);

        // Step de animação: Vértice atual verde e pai em processamento azul
        if (pai != null) {
            animationSteps.push([
                {
                    vertex: pai,
                    color: "blue"
                },
                {
                    vertex: v,
                    color: "green"
                }
            ]);
        }
        else {
            animationSteps.push([
                {
                    vertex: v,
                    color: "green"
                }
            ]);
        }

        for (const viz of adj_map.get(v)) {
            if (!vis.has(viz)) {
                dfs(viz, v);
            }
        }

        //Step de animação: Vértice v finalizado, vermelho, e pai próximo atual, verde.
        if (pai != null) {
            animationSteps.push([
                {
                    vertex: pai,
                    color: "green"
                },
                {
                    vertex: v,
                    color: "red"
                }
            ]);
        }
        else {
            animationSteps.push([
                {
                    vertex: v,
                    color: "red"
                }
            ]);
        }
    };
        

    for (const x of adj_map.keys()) {
        if (!vis.has(x)) {
            dfs(x, null);
        }
    }
}

function draw_bfs(){

    //Limpa as animações
    animationSteps = [];
    currentStep = 0;

    //Coloca o grafo na cor padrão
    for (const v of adj_map.keys()) {
        color.set(v, 255);
    }

    let vis = new Set();

    const bfs = (x) => {
        let queue = [];
        let head = 0;
        vis.add(x);
        queue.push(x);

        //Step animação: Vértice na fila, azul.
        animationSteps.push([
            {
                vertex: x,
                color: "blue"
            }
        ]);

        while(head < queue.length){
            let v = queue[head++];

            //Step animação: Vértice atual, verde.
            animationSteps.push([
                {
                    vertex: v,
                    color: "green"
                }
            ]);

            for(const viz of adj_map.get(v)){
                if(!vis.has(viz)){
                    vis.add(viz);
                    queue.push(viz);

                    //Step animação: Vértice na fila, azul.
                    animationSteps.push([
                        {
                            vertex: viz,
                            color: "blue"
                        }
                    ]);
                }
            }

            //Step animação: Vértice finalizado, vermelho.
            animationSteps.push([
                {
                    vertex: v,
                    color: "red"
                }
            ]);
        }
    };

    for (const x of adj_map.keys()) {
        if (!vis.has(x)) {
            bfs(x);
        }
    }
}

function draw() {

    render_graph();

    if (
        currentStep < animationSteps.length &&
        millis() - lastUpdate > delay
    ) {

        let step = animationSteps[currentStep];

        if(Array.isArray(step)){

            for(const change of step){
                color.set(change.vertex, change.color);
            }

        }else{

            color.set(step.vertex, step.color);

        }

        currentStep++;
        lastUpdate = millis();
    }
}