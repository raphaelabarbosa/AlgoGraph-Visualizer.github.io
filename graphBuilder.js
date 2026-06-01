let Input;
let Positions;

function setup(){
    let canvas = createCanvas(500,500);
    canvas.parent('canvas-side'); 

    Input = createInput();
    Input.parent('graph-builder-container');

    Button = createButton('submit');
    Button.parent('graph-builder-container');

     background(220);
}

function draw(){
    Button.mousePressed(graph_draw);
}

function graph_draw(){
    background(220);

    //Nota:
    //1.Receber número de vértice (n)
    //2.Receber vértices
    //3.Fazer compressão de coordenada com map (Compr.,Original)
    //4.Construir vetor de adj com compr.
    //5.Desenhar grafo consultando no map

    let graph_input = Input.value().split(","); //Separando valores do input em um array: string "n, v1-v2, v3-v2,...""
    
    let n = parseInt(graph_input[0].trim()); //Número de vértices
    //console.log(n);
    
    // Separa vértices únicos e ordena em ordem crescente.
    let vertices_set = new Set();
    // Cria uma lista de adjacência. 
    let adjacency_list = new Map();
    for(let i = 0; i < graph_input.length; i++){ 
        let edge = graph_input[i].split("-").map(x => parseInt(x.trim())); //edge = {x1,x2}
        //console.log(edge);

        vertices_set.add(edge[0]);
        vertices_set.add(edge[1]);

        if(!adjacency_list.has(edge[0])) adjacency_list.set(edge[0], []);
        if(!adjacency_list.has(edge[1])) adjacency_list.set(edge[1], []);

        adjacency_list.get(edge[0]).push(edge[1]);
        adjacency_list.get(edge[1]).push(edge[0]);
    }
    const vertices_ordenados = [...vertices_set].sort((a, b) => a - b);
    
    // Configura posição inicial dos pontos
    Positions = new Map();
    for(let i = 0; i < vertices_ordenados.length; i++){
        let v = vertices_ordenados[i];
        let max = 450; let min = 50;
        let x = Math.floor(Math.random() * (max - min + 1)) + min;
        let y = Math.floor(Math.random() * (max - min + 1)) + min;
        Positions.set(v, createVector(x, y));
    }
    
    // Desenho aresta
    let edgeThickness = 5;
    for(v of vertices_ordenados){
        for(j of adjacency_list.get(v)){
            if(j < v) continue;
            let edgeLength = Positions.get(v).dist(Positions.get(j));
            let midPoint = p5.Vector.lerp(Positions.get(v), Positions.get(j), 0.5);
            let angle = p5.Vector.sub(Positions.get(j), Positions.get(v)).heading();

            // Retângulo representando aresta
            push();
            rectMode(CENTER);
            
            translate(midPoint.x, midPoint.y); 
            rotate(angle); 
            
            fill(0); 
            noStroke();
            rect(0, 0, edgeLength, edgeThickness); 
            
            pop();  
        }
    }
    
    
    // Desenho vértice
    let diametro = 25;
    for(let v of vertices_ordenados){
        push();
        //Circulo
        fill(255); 
        stroke(0); 
        circle(Positions.get(v).x, Positions.get(v).y, diametro);
        //Texto
        fill(0); 
        textSize(10);
        textAlign(CENTER, CENTER); 
        text(String(v), Positions.get(v).x, Positions.get(v).y);
        pop();
    }
}