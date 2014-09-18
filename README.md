sClass.js (v1.0.0)
=========

Small JS utility for defining classes, performing inheritance and implementing interfaces.
Supported IE8 and all modern browsers.

## Creating class
```js

var MyClass = sClass(); // this is a class

MyClass.prototype.$constructor = function(id) { 
  // this function is applied in its context during new MyClass() is performed
  this.id = id;
  this.text = "Good evening ... infidels!";
};

MyClass.prototype.getText = function() {
  return this.text;
};

MyClass.prototype.getId = function() {
  return this.id;
};

var instance = new MyClass(1);
console.log(instance.getText()); // "Good evening ... infidels!"
console.log(instance.getId()); // 1

```

## Creating singleton
```js

var DeathStar = sClass({ singleton : true });

DeathStar.prototype.$constructor = function(id) { 
  this.weapons = [];
};

DeathStar.prototype.getWeapons = function() {
  return this.weapons;
};

console.log(DeathStar.getInstance().getWeapons()); // []

// you can not call singleton with new, but always with getInstance method
// this throws an error
var dStar = new DeathStar(); 
```

## Performing inheritance
```js

var Knight = sClass();

Knight.prototype.$constructor = function() {
  this.weapon = "saber";
};

Knight.prototype.getWeapon = function() {
  return this.weapon;
};



var JediKnight = sClass( { extending: Knight } ); // you can see we give reference to Knight

JediKnight.prototype.$constructor = function() {
  this.weapon = "light saber";
};

var jKnight = new JediKnight();
console.log(jKnight instanceof JediKnight); // true
console.log(jKnight instanceof Knight); // true
console.log(jKnight.getWeapon()); // shows "light saber"

```

## Using $super method
```js

var Knight = sClass();

Knight.prototype.$constructor = function(name) {
  this.name = name || "noname";
  this.weapon = "saber";
};

Knight.prototype.getWeapon = function() {
  return this.weapon;
};

Knight.prototype.setWeapon = function(name) {
  this.weapon = name;
};



var JediKnight = sClass( { extending: Knight } ); // you can see we give reference to Knight

JediKnight.prototype.$constructor = function(name, skill) {
  this.$super(name); // just simply call $super to apply parent $constructor
  this.weapon = "light saber";
  this.skill = 0;
  this.weaponSkill = 0;
};

JediKnight.prototype.setWeapon = function(name, skill) {
  this.$super(name); // just simply call $super to apply parent setWeapon
  this.weaponSkill = skill;
};

JediKnight.prototype.getSkill = function() {
  return this.skill;
};

JediKnight.prototype.getWeaponSkill = function() {
  return this.weaponSkill;
};

var jKnight = new JediKnight("Obi-Wan Kenobi", 5);
jKnight.setWeapon("blue light saber", 10);
console.log(jKnight.getSkill()); // 5
console.log(jKnight.getWeapon()); // "blue light saber"
console.log(jKnight.getWeaponSkill()); // 10

```
