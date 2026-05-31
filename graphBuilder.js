let Input;

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
    for(let i = 1; i < graph_input.length; i++){ 
        let edge = graph_input[i].split("-").map(x => parseInt(x.trim())); //edge = {x1,x2}
        //console.log(edge);

        vertices_set.add(edge[0]);
        vertices_set.add(edge[1]);
    }
    const vertices_ordenados = [...vertices_set].sort((a, b) => a - b);

    //Compressão e map


    //Desenho vértice
    // let x = 50;
    // let y = 50;
    // let diametro = 25;
    // for(let v of par){
    //     //Circulo
    //     fill(255); 
    //     stroke(0); 
    //     circle(x, y, diametro);
    //     //Texto
    //     fill(0); 
    //     textSize(10);
    //     textAlign(CENTER, CENTER); 
    //     text(v.trim(), x, y);
    //     x+= 50;
    // }
    // x = 50;
    // y += 50;
}