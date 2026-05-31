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
    let arestas = Input.value().split(",");

    let x = 50;
    let y = 50;
    let diametro = 25;
    for(let i = 0; i < arestas.length; i++){
            let par = arestas[i].split("-");
            for(let v of par){
            //Circulo
            fill(255); 
            stroke(0); 
            circle(x, y, diametro);
            //Texto
            fill(0); 
            textSize(10);
            textAlign(CENTER, CENTER); 
            text(v.trim(), x, y);
            x+= 50;
        }
        x = 50;
        y += 50;
    }
}