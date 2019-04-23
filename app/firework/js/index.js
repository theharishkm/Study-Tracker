
class Particle {
  /* Creates a particle at x, y.
   * Colour is an object in the form of {h: 0 -> 360, s: 0 -> 1, v: 0 -> 1} (How dat.GUI prefers it)
   * initialForceDirection is measured in radians. 0 -> TWO_PI (constant in p5.js)
   */
  constructor(x, y, size, colour, initialForce, initalForceDirection, mass) {
    this.x = x;
    this.y = y;
    this.size = size; //Asethetic, doesn't effect movement.
    this.colour = colour;    
    this.force = initialForce; 
    this.forceDirection = initalForceDirection; 
    this.mass = mass; //For gravity movement simulation.
    
    this.active = true; //When this is false, the particle is deleted and regenerated.
  }
  
  /* Runs a simple physics simulation on the particle.
   * Called once every frame. The mass of the particle only effects external forces.
   * If particle moves out of the screen limits, it is deactivated.
   */
  move(externalForce, externalForceDirection){
    //Resolve the two forces acting on the particle along the x and y axes.
    let newXForce = cos(this.forceDirection) * this.force + cos(externalForceDirection) * externalForce * this.mass;
    let newYForce = sin(this.forceDirection) * this.force + sin(externalForceDirection) * externalForce * this.mass;

    //Update the position of the particle according to the forces.
    this.x += newXForce;
    this.y += newYForce;
    
    if (this.outOfBounds()){
      this.active = false; //Particle gets deleted by the simulation object.
    }
    
    //Update this element with the new force angle and magnitude.
    this.forceDirection = atan2(newYForce, newXForce);
    this.force = sqrt(newXForce*newXForce + newYForce*newYForce);
  }
  
  /* Checks to see if the particle has gone off the screen.
   * Padding means the particle is drawn leaving the screen, and doesn't
   * instantly vanish on touching the border.
   */
  outOfBounds() {
    let padding = 5;
    
    if (this.x < 0 - padding){
      return true;
    } else if (this.x > windowWidth + padding){
      return true;
    } else if (this.y < 0 - padding){
      return true;
    } else if (this.y > windowHeight + padding){
      return true;
    } else {
      return false;
    }
  }
  
  display(){
    noStroke();
    fill(this.colour.h, this.colour.s * 100, this.colour.v * 100); //"* 100" as dat.GUI wants 0 - 1 while p5js wants 0 - 100
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class ParticleSimulation {
  /* spawnX is a percentage of the windowWidth, and spawnY a percentage of windowHeight. (0 -> 1)
   * Hue controls colour, a value between 0 and 360.
   */
  constructor(spawnX, spawnY, hue){
    this.numParticles = 150;
    this.gravityForce = 0.4;
    this.gravityDirection = HALF_PI; //Towards bottom of screen.
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.minInitialForce = 2;
    this.maxAdditionalInitialForce = 8;
    this.initialDirection = PI + HALF_PI;
    this.directionFocus = HALF_PI / 2;
    this.particleHue = hue;
    this.minSize = 4;
    this.sizeVariation = 8;
    
    this.particles = this.createParticles();
  }
  
  /* Add all the parameters you want to be able to control by dat.GUI here.
   * Some parameters, such as numParticles, require a controller to reset 
   * the particle system for the change to be seen.
   */
  setupGUI(gui){
    gui.add(this, 'numParticles', 1, 500).name("No. Particles");
    
    let spawnFolder = gui.addFolder("Spawning");
    spawnFolder.add(this, 'spawnX', 0, 1).name("Spawn X");
    spawnFolder.add(this, 'spawnY',0, 1).name("Spawn Y");
    spawnFolder.add(this, 'initialDirection', 0, TWO_PI).name("Angle");
    spawnFolder.add(this, 'directionFocus',0, PI).name("Focus");
    spawnFolder.add(this, 'minInitialForce', 0, 100).name("Min. Force");
    spawnFolder.add(this, 'maxAdditionalInitialForce', 0, 100).name("Max. Add. Force");
    
    let appearanceFolder = gui.addFolder("Appearance");
    appearanceFolder.add(this, 'particleHue', 0, 360).name("Colour");
    appearanceFolder.add(this, 'minSize', 0, 20).name("Min. Size");
    appearanceFolder.add(this, 'sizeVariation', 0, 20).name("Size Variation");
    
    let gravityFolder = gui.addFolder("Gravity");
    gravityFolder.add(this, 'gravityForce', -10, 10).name("Gravity");
    gravityFolder.add(this, 'gravityDirection', 0, TWO_PI).name("Gravity Direction");
  }
  
  /* Returns an array of particles for the simulation. */
  createParticles(){
    let particleList = [];
    for (let i = 0; i < this.numParticles; i++){
      particleList.push(this.createNewParticle());
    }
    return particleList;
  }
  
  /* Returns a single particle instance.
   * When passing initialForceDirection, 0 is to the right, PI + HALF_PI is upwards.
   */
  createNewParticle(){
    return new Particle(this.spawnX * windowWidth,   //x
                        this.spawnY * windowHeight,   //y
                        this.minSize + random(this.sizeVariation), //size
                        {h: (this.particleHue + random(60)) % 360, s: 0.8, v: 1}, //colour
                        this.minInitialForce + random(this.maxAdditionalInitialForce), //initalForce
                        map(random(), 0, 1, 
                            this.initialDirection - this.directionFocus,
                            this.initialDirection + this.directionFocus), //initalForceDirection 
                        0.5 + random(1) //mass
                       );
  }
  
  /* Trims dead particles then creates fresh ones. */
  maintainParticles(){
    //Trim all deactivated particles from the array.
    for (let i = 0; i < this.particles.length; i++){
      if (this.particles[i].active == false){
        this.particles.splice(i,1);
      }
    }
    //Add new particles for all spaces remaining in the array.
    for (let i = this.particles.length; i < this.numParticles; i++){
      this.particles.push(this.createNewParticle());
    }
  }
  
  moveParticles(){
    let gF = this.gravityForce; //Can't use this inside a function passed to an array.
    let gD = this.gravityDirection; //It wouldn't know to reference the simulation object.
    this.particles.forEach(function(particle){
      particle.move(gF, gD); //So we use temporary variables.
    });
  }
  
  drawParticles(){
    this.particles.forEach(function(particle){
      particle.display();
    });
  }
  
  /* Called once every frame in draw() to move and draw particles to the screen. */
  runSimulation(){
    this.moveParticles();
    this.drawParticles();
    this.maintainParticles();
  }
}

let particleSystem, additionalSystem;
let gui = new dat.GUI(); 
let systemOneFolder = gui.addFolder("System One");
let systemTwoFolder = gui.addFolder("System Two");

function setup(){
  createCanvas(windowWidth, windowHeight); 
  colorMode(HSB, 360, 100, 100, 1); 
  
  particleSystem = new ParticleSimulation(0.33, 0.5, 180);
  additionalSystem = new ParticleSimulation(0.66, 0.5, 0);
  
  particleSystem.setupGUI(systemOneFolder);
  additionalSystem.setupGUI(systemTwoFolder);
}

function draw(){
  background(0, 0, 20, 0.35); //The 0.35 opacity value gives the particle trail effect.
  particleSystem.runSimulation();
  additionalSystem.runSimulation();
}