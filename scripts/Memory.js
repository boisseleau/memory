function Memory(elementId, images) {
  // Je récupère mon tableau de jeu
  this.element = document.querySelector('#' + elementId);

  // Je duplique mes images
  this.images = images.concat(images);

  // Lancement du jeu
  this.launchGame();
}

Memory.prototype.launchGame = function() {
  // Je vide mon element avant de le peupler.
  // Cela me permet de nettoyer le plateau de jeu avant de relancer une partie.
  this.element.innerHTML = '';

  // Je mélange mes images
  this.shuffle();

  // Images retournées (0 à 2 images)
  this.revealed = [];

  // Paires trouvées (0 à this.images.length)
  this.found = [];

  // Je génère mon tableau de jeu
  this.createBoard();
}

// Mélanger mes images
Memory.prototype.shuffle = function() {
  var j;
  var k;

  for (var i = this.images.length - 1; i >= 0; i--) {
    // Je génère un nombre aléatoire entre 0 et i
    j = Math.floor(Math.random() * i);

    // Je récupère l'image courante
    k = this.images[i];

    // J'inverse l'image courante et l'image d'index j (nombre aléatoire généré plus haut)
    this.images[i] = this.images[j];
    this.images[j] = k;
  }
}

Memory.prototype.createBoard = function() {
  // Je génère mon emplacement pour le message de fin de jeu
  var div = document.createElement('div');
  div.className = 'congratulations hidden';
  div.innerText = 'Bravo !';

  // Je génère mon bouton 'Rejouer'
  var button = document.createElement('button');
  button.innerText = 'Rejouer';
  button.onclick = this.launchGame.bind(this);

  div.appendChild(button);

  this.element.appendChild(div);
  // Je génère les images
  this.images.forEach(this.createImage.bind(this));
}

Memory.prototype.createImage = function(image) {
  // Chaque image est comprise dans un paragraphe
  // en display: inline-block
  var p = document.createElement('p');
  // Lorsque je clique sur mon p, j'affiche l'image à l'intérieur
  p.onclick = this.reveal.bind(this);

  // Je créé mon image
  var img = document.createElement('img');
  img.src = image;
  img.className = 'hidden';

  // J'insère tout ça dans mon HTML
  p.appendChild(img);
  this.element.appendChild(p);
}

Memory.prototype.reveal = function(ev) {
  // J'évite que l'évènement soit propagé aux enfants
  // (le clic s'arrête au p et pas à l'img)
  ev.stopPropagation();
  
  // Si deux images sont déjà affichées, je ne fais rien
  if (this.revealed.length === 2) return;

  // J'affiche l'img comprise dans mon p
  var p = ev.target;
  var img = p.querySelector('img');
  img.className = '';

  // J'ajoute l'image affichée à this.revealed
  this.revealed.push(img);

  // Je vérifie si j'ai trouvé une paire
  this.checkFound();

  // Si les images sont différentes, je les cache après une seconde
  if (this.revealed.length === 2) {
    setTimeout(this.hide.bind(this), 1000);
  }
}

Memory.prototype.hide = function() {
  // Je cache chaque image révélées
  this.revealed.forEach((function(image) {
    image.className = 'hidden';
  }).bind(this));

  // Je vide mon tableau d'images révélées
  this.revealed = [];
}

Memory.prototype.checkFound = function() {
  // Si je n'ai pas deux images affichées, je ne fais rien
  if (this.revealed.length !== 2) return;

  // Si les images sont les mêmes
  if (this.revealed[0].src === this.revealed[1].src) {
    // J'ajoute mes images à this.found
    this.found.push(this.revealed[0], this.revealed[1]);
    // Je vide mon tableau d'images révélées pour ne pas cacher les images trouvées
    this.revealed = [];
  }

  // Si toutes mes images sont trouvées, j'ai gagné
  if (this.found.length === this.images.length) {
    this.element.querySelector('.congratulations').className = 'congratulations';
  }
}
