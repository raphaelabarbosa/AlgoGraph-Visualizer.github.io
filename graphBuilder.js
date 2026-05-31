let Input;

function setup(){
    createCanvas(300,300);
    background(220);

    Input = createInput();
    Button = createButton('submit');
    Input.parent('graph-builder-container');
    Button.parent('graph-builder-container');
}

function draw(){
    Button.mousePressed(graph_draw);
}

function graph_draw(){
    background(220);
    let msg = Input.value();
    text(msg, 25, 55);
}