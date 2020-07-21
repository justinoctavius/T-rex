// variables globales
var velocidad = 50;
var desplazamiento = 5;
var bucle;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var superficie = 267;
var modal = document.getElementById("modal");
var nCactus = 600;

//classes
//class objet start
class Objeto {
    constructor(){
        this.img = document.createElement('img');
    }
    choque(otro){
        if(this.fondo < otro.techo || 
            this.techo > otro.fondo || 
             this.derecha < otro.izquierda ||
              this.izquierda > otro.derecha) {
                return false;
        } else {
            return true;
        }
    }
}
//class objet start

//background and the word class start
class mundo {
    constructor(){
        this.x = 0;//the initial x position 
        this.y = superficie;//the initial y position
        this.tamano = 15000;
        this.espacio = 32;//the spaces between img
        this.img = document.createElement('img');//create the img
        this.img.src = "assets/mundo.png";
    }
    draw(){
        var tx = this.x;
        for(var i = 0; i <= this.tamano; i++){
            ctx.drawImage(this.img,tx,this.y);
            tx += this.espacio;
        }
    }
    mover(){
        this.x-=desplazamiento;
    }
}//the background and the word class end

//the class dinosaurio start
class Dinosaurio extends Objeto {

        constructor(){
            super(); 
            this.x = 35;
            this.w = 100;
            this.h = 116;
            this.y = superficie - this.h;
            this.img.src = "assets/trex.png";

            this.techo = this.y;
            this.fondo = this.y+this.h-15;

            this.bordeDerecha = 30;
            this.borderIzquierda = 50;
            this.derecha = this.x+this.w-this.bordeDerecha
            this.izquierda = this.x+this.borderIzquierda
        }
    draw(){
        ctx.drawImage(this.img,this.x,this.y);
    }

    actualizarBordes(){
        this.techo = this.y;
        this.fondo = this.y+this.h-15;
    }

}
//the class dinosaurio end

//class arbol start
class Arbol extends Objeto{
    constructor(x){
        super();
        this.x = x;
        this.hmin = 20;
        this.hmax = 40;
        this.h = this.generate(this.hmin,this.hmax);
        this.w = (this.h*0.58);
        this.y = superficie - this.h;
        this.nmin = 1;
        this.nmax = 2;
        this.n = this.generate(this.nmin,this.nmax);
        this.dmin = 350;
        this.dmax = 600;
        this.d = this.generate(this.dmin,this.dmax);
        this.siguiente = null;
        this.img.src = 'assets/cactus.png'

        this.techo = this.y;
        this.fondo = this.y+this.h;
        this.izquierda = this.x;
        this.derecha = this.x+this.w;
    }
    draw(){
        var tx = this.x;
        for(var i = 0; i < this.n;i++){
            ctx.drawImage(this.img,tx,this.y,this.w,this.h);
            tx += this.w;
            this.derecha = tx;
        }
        if(this.siguiente != null){
            this.siguiente.draw()
        }
    }

    generate(a,b){
        return Math.floor((Math.random()*b) + a);
    }

    mover(){
        this.x -= desplazamiento;
        this.izquierda = this.x;
        if(this.siguiente != null){
            this.siguiente.mover()
        }
    }

    agregar(){
        if(this.siguiente == null){
        this.siguiente = new Arbol(this.x + this.d);
        }else{
            this.siguiente.agregar();
        }
    }

    verSiguiente(){
        return this.siguiente;
    }

}
//class arbol end

//Time class
class Time {
    constructor(){
        this.nivel = 0;
        this.tiempo = 0;
        this.limite = 10;
        this.intervalo = 0.1;
        this.x = 500;
        this.y = 40;
        this.sonido = document.createElement("audio");
        this.sonido.src = "assets/aviso.mp3"
        this.print
    }

    draw(){
        this.print = Math.floor(this.tiempo)
        ctx.font = "25px Arial"
        ctx.fillText(this.nivel.toString(), this.x, this.y);
        ctx.fillText(this.print.toString(), this.x+50, this.y);
    }

    tick(){
        this.tiempo += this.intervalo;
        if(this.tiempo >= this.limite){
            this.tiempo = 0;
            this.nivel += 1;
            this.sonido.play();
            desplazamiento += 0.01;
            desplazamientoSalto += 2;
            this.intervalo += 0.01;
            cancelAnimationFrame(bucle);
            iniciar()
        }
    }
}
//classes end

// objet instance 
var mundos = new mundo;
var dinosaurio = new Dinosaurio;
var cactus = new Arbol(600);

//cactus loop
for(var i = 0; i < 600; i++){
    cactus.agregar()
}

//funciones de Control
//variables
var velocidadSalto = 25;
var desplazamientoSalto = 10;
var salto;
var puedeSaltar = true;
var tiempo = new Time;
var bucle;
var margenSalto;
//funciones
function subir(){
    dinosaurio.y-=desplazamientoSalto;
    dinosaurio.actualizarBordes();
    if(dinosaurio.y <= dinosaurio.y/2){
        cancelAnimationFrame(salto)
        bajar()
    }else{
    iniciarSalto()
    }
}

function bajar(){
    salto = requestAnimationFrame(bajar)
    dinosaurio.y+=(desplazamientoSalto*1.5);
    dinosaurio.actualizarBordes();
    if(dinosaurio.y >= (superficie-dinosaurio.h)){
        margenSalto = dinosaurio.y - (superficie-dinosaurio.h)
        dinosaurio.y -= margenSalto
        cancelAnimationFrame(salto);
        puedeSaltar = true;
        }
    }

function iniciarSalto(){
    salto = requestAnimationFrame(subir)
}

function saltar(event){
    if(event.keyCode == 32 && puedeSaltar == true){
        iniciarSalto();
        puedeSaltar = false
    }        
}

//fin de juego
function gameOver(){
    cancelAnimationFrame(bucle);
    modal.style.display = 'block'
    document.getElementById('imgbtn').src = "assets/otravez.png";
    desplazamientoSalto = 10;
    velocidad = 50;
    desplazamiento = 8;
    puedeSaltar = true;
    mundos = new mundo;
    dinosaurio = new Dinosaurio;
    cactus = new Arbol(600);
    tiempo = new Time;
    for(var i = 0; i < 600; i++){
        cactus.agregar()
    }
}

//function choque cactus
function choqueCactus(){
    var temp = cactus;
    while(temp != null){
        if(temp.choque(dinosaurio)){
            cancelAnimationFrame(bucle);
            console.log('gameOver')
            gameOver();
            break;
        }else{
            temp = temp.verSiguiente();
        }
    }
}

//destruir cactus
function destruirCactus(){
    if(cactus.derecha < 0){
        cactus = cactus.verSiguiente();
    }
}

//control function end

//global function start
function draw(){
    ctx.clearRect(0,0,width,height);
    mundos.draw();
    dinosaurio.draw();
    cactus.draw()
    tiempo.draw();
}

function frame(){
    draw();
    mundos.mover();
    cactus.mover();
    tiempo.tick();
    choqueCactus();
    destruirCactus()
    iniciar();
}

function iniciar() {
    modal.style.display = 'none';
    bucle = requestAnimationFrame(frame);
}
//global function end