sClass.js (v1.0.0)
=========

[![Build Status](https://travis-ci.org/jerrymf/sClass.js.svg?branch=master)](https://travis-ci.org/jerrymf/sClass.js)

Small JS utility for defining classes, performing inheritance and implementing interfaces. It is easy to use and 
supported IE8 and all modern browsers.

## Installation

### node.js

```sh
npm install sclass.js --save
```

### Bower

```sh
bower install sclass.js --save
```

## Creating class
```js

var MyClass = $Class(); // this is a class

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

var DeathStar = $Class({ 
  singleton : true 
});

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

var Knight = $Class();

Knight.prototype.$constructor = function() {
  this.weapon = "saber";
};

Knight.prototype.getWeapon = function() {
  return this.weapon;
};



var JediKnight = $Class({
  extending: Knight // you can see we give reference to Knight
});

JediKnight.prototype.$constructor = function() {
  this.weapon = "lightsaber";
};

var jKnight = new JediKnight();
console.log(jKnight instanceof JediKnight); // true
console.log(jKnight instanceof Knight); // true
console.log(jKnight.getWeapon()); // shows "lightsaber"

```

## Using $super method
```js

var Knight = $Class();

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



var JediKnight = $Class({
  extending: Knight // you can see we give reference to Knight
});

JediKnight.prototype.$constructor = function(name, skill) {
  this.$super(name); // just simply call $super to apply parent $constructor
  this.skill = skill || 0;
  this.weapon = "";
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
jKnight.setWeapon("lightsaber", 10);
console.log(jKnight.getSkill()); // 5
console.log(jKnight.getWeapon()); // "lightsaber"
console.log(jKnight.getWeaponSkill()); // 10

```

## Implementing interfaces
```js

var IFaceWeapons = {
  setWeapon: function(name) {
    this.name = name;
  },
  getWeapon: function() {
    return this.name;
  }
};

var IFaceSkills = {
  setSkill: function(skill) {
    this.skill = skill;
  },
  getSkill: function() {
    return this.skill;
  }
};

var Knight = $Class({
  implementing: IFaceWeapons
});

Knight.prototype.$constructor = function(name) {
  this.name = name || "noname";
};



var JediKnight = $Class({
  extending: Knight,
  implementing: IFaceSkills
}); // we use parent $constructor, we can not define it again

var jKnight = new JediKnight("Obi-Wan Kenobi");

jKnight.setWeapon("lightsaber");
jKnight.setSkill(10);

console.log(jKnight.getWeapon()); // "lightsaber"
console.log(jKnight.getSkill()); // 10

```

## Implementing multiple interfaces
```js

var Sith = $Class({ 
  implementing: [IFaceWeapons, IFaceSkills] // first IFaceWeapons is implemented and then IFaceSkills
});

```
