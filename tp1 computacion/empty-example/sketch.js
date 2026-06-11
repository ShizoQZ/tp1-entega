// ==========================================
// AUDIO
// ==========================================

let mic;
let fft;

let volumen = 0;
let graves = 0;
let agudos = 0;

let tiempoAplauso = 0;
let volumenAnterior = 0;

// ==========================================
// VARIABLES ORIGINALES
// ==========================================

let anguloRotacion = 0;
let TodosAlCentro = 0;
let TodosAfuera = 0;

let animacionActiva = false;

let factorOrbita = 0;

let separacionVolumen = 0;

let separacionMaxima = 0;

// ==========================================
// SETUP
// ==========================================

function setup() {

  createCanvas(800, 480);
  rectMode(CENTER);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}

// Chrome necesita una interacción
function mousePressed() {
  userStartAudio();
}

// ==========================================
// DRAW
// ==========================================

function draw() {

  // ----------------------
  // AUDIO
  // ----------------------

  volumen = mic.getLevel();

  fft.analyze();



  graves =
    (
      fft.getEnergy("bass") +
      fft.getEnergy("lowMid")
    ) / 2;

  agudos =
    (
      fft.getEnergy("highMid") +
      fft.getEnergy("treble")
    ) / 2;

  actualizarInteracciones();

  let colorFondo = calcularColorFondo();

  background(colorFondo);


  // test
  fill(255);
  textSize(20);

  text("Graves: " + nf(graves, 0, 0), 20, 30);
  text("Agudos: " + nf(agudos, 0, 0), 20, 60);
  text("Dif: " + nf(agudos - graves, 0, 0), 20, 90);
  text("Angulo: " + degrees(anguloRotacion), 20, 120);

  translate(width / 2, height / 2);
  // ----------------------------------

  //orbita

  let orbitaX = 0;
  let orbitaY = 0;

  // ==========================================
  // FIGURA CAPA FONDO IZQUIERDA
  // ==========================================

  let izqX =
    lerp(-120, 0, TodosAlCentro)
    - separacionVolumen;

  izqX = lerp(
    izqX,
    -350,
    TodosAfuera
  );

  let izqY = 0;

  let MovFondoIzq =
    animacionActiva ?
      sin(frameCount * 0.03) * 10 :
      0;

  push();

  translate(
    izqX + MovFondoIzq - orbitaX,
    izqY - orbitaY
  );

  rotate(anguloRotacion);

  stroke(0);
  strokeWeight(2);

  for (let i = -120; i <= 130; i += 8) {

    let achique =
      map(i, -50, 220, 0, 80);

    let y1 = -220 + achique;

    let y2;

    if (i < 0) {

      y2 = 220;

    } else {

      let achiqueAbajo =
        map(i, 0, 120, 0, 80);

      y2 = 220 - achiqueAbajo;
    }

    line(i, y1, i, y2);
  }

  pop();

  // ==========================================
  // FIGURA CAPA FONDO DERECHA
  // ==========================================

  let derX =
    lerp(
      120,
      0,
      TodosAlCentro
    )
    + separacionVolumen;

  derX = lerp(
    derX,
    350,
    TodosAfuera
  );

  let derY = 0;

  let MovFondoDerecha =
    animacionActiva ?
      sin(frameCount * 0.03) * 10 :
      0;

  push();

  translate(
    derX + MovFondoDerecha + orbitaX,
    derY + orbitaY
  );

  rotate(anguloRotacion);

  stroke(0);
  strokeWeight(2);

  for (let i = -120; i <= 130; i += 8) {

    let achique =
      map(i, 130, -120, 0, 80);

    let y2 = 220 - achique;

    let y1;

    if (i > 0) {

      y1 = -220;

    } else {

      let achiqueArriba =
        map(i, 0, -120, 0, 80);

      y1 =
        -220 +
        achiqueArriba;
    }

    line(i, y1, i, y2);
  }

  pop();
  // ==========================================
  // FIGURA CAPA INTERMEDIA ARRIBA/SUPERIOR
  // ==========================================

  let supX = lerp(
    40,
    0,
    TodosAlCentro
  );

  let supY =
    lerp(
      -120,
      0,
      TodosAlCentro
    )
    - separacionVolumen;

  supY = lerp(
    supY,
    -300,
    TodosAfuera
  );

  let movArriba =
    animacionActiva ?
      sin(frameCount * 0.06) * 10 :
      0;

  push();

  translate(
    supX - orbitaX,
    supY + movArriba + orbitaY
  );

  rotate(anguloRotacion);

  stroke(0);
  strokeWeight(5);

  for (let i = -240; i <= 100; i += 10) {

    line(
      i + 80,
      -90,
      i,
      120
    );

  }

  pop();

  // ==========================================
  // FIGURA CAPA INTERMEDIA ABAJO/INFERIOR
  // ==========================================

  let infX = lerp(
    40,
    0,
    TodosAlCentro
  );

  let infY =
    lerp(
      90,
      0,
      TodosAlCentro
    )
    + separacionVolumen;

  infY = lerp(
    infY,
    300,
    TodosAfuera
  );

  let MovAbajo =
    animacionActiva ?
      sin(frameCount * 0.06) * 10 :
      0;

  push();

  translate(
    infX + orbitaX,
    infY - MovAbajo - orbitaY
  );

  rotate(anguloRotacion);

  stroke(0);
  strokeWeight(5);

  for (let i = -240; i <= 100; i += 10) {

    line(
      i + 80,
      -90,
      i,
      120
    );

  }

  pop();

  // ==========================================
  // CENTRO
  // ==========================================

  let cenX = 0;
  let cenY = 0;

  let MovCentro =
    animacionActiva ?
      sin(frameCount * 0.06) * 10 :
      0;

  push();

  translate(
    cenX,
    cenY + MovCentro
  );

  rotate(
    -anguloRotacion
  );

  stroke(0);
  strokeWeight(9);

  for (let i = -90; i <= 90; i += 13) {

    line(
      i,
      -90,
      i,
      85
    );

  }

  pop();

}

// =====================================================
// INTERACCIONES CON AUDIO
// =====================================================

function actualizarInteracciones() {

  // movimiento general

  animacionActiva =
    volumen > 0.02;

  // ----------------------------------
  // GRAVES Y AGUDOS
  // ----------------------------------

  let destinoAngulo = 0;


  if (volumen > 0.03) {

    let diferencia = agudos - graves;

    if (diferencia < -50) {
      anguloRotacion -= radians(1); //ajustar velocidad de rotación
    }

    if (diferencia > -20) {
      anguloRotacion += radians(1); //ajustar velocidad de rotación
    }

  }

  if (volumen > 0.01) {

    let separacionObjetivo = map(
      volumen,
      0.01,
      0.15,
      0,
      180
    );

    separacionObjetivo = constrain(
      separacionObjetivo,
      0,
      180
    );

    separacionVolumen = lerp(
      separacionVolumen,
      separacionObjetivo,
      0.2
    );

  }

  // ----------------------------------
  // DISPERSIÓN POR VOLUMEN
  // ----------------------------------

  let dispersionObjetivo =
    map(
      volumen,
      0,
      0.15,
      0,
      1
    );

  dispersionObjetivo =
    constrain(
      dispersionObjetivo,
      0,
      1
    );

  factorOrbita =
    lerp(
      factorOrbita,
      dispersionObjetivo,
      0.45
    );

  TodosAlCentro =
    lerp(
      TodosAlCentro,
      0,
      0.58
    );

  TodosAfuera = 0;



  // =====================================================
  // COLOR DE FONDO
  // =====================================================
}
function calcularColorFondo() {

  let mezcla =
    map(
      agudos - graves,
      -250,
      100,
      0,
      1
    );

  mezcla =
    constrain(
      mezcla,
      0,
      1
    );

  let colorAzul =
    color(
      0,
      0,
      255
    ); // Grave

  let colorRosa =
    color(
      255,
      5,
      180
    ); // Agudo

  return lerpColor(
    colorAzul,
    colorRosa,
    mezcla
  );

}