
/*let user = {     // an object
    name: "John",  // by key "name" store value "John"
    age: 30        // by key "age" store value 30
  };
alert( user.name ); // John
alert( user.age ); // 30
delete user.age;


let user2 = {
    name: "John",
    age: 30,
    "likes birds": true  // multiword property name must be quoted
  };
 alert(user2["likes birds"]); //true
 delete user["likes birds"];
*/

let user = {
  name: "John",
  age: 30
};

let key = prompt("What do you want to know about the user?", "name");

// access by variable
alert(user[key]); // John (if enter "name")

/////////////////////////////////////////////

let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};

alert(bag.apple); // 5 if fruit="apple"  //çıktı 5

//daha karmaşık ifadelerde köşeli parantezi kullanırız.

///////////////////////////////////////////
function makeUser(name, age) {
  return {
    name: name,
    age: age,
    // ...other properties
  };

  /* 
  Bu şekide de yazılabilir
  return {
  name, // same as name: name
  age,  // same as age: age

  };
  */
}
let person = makeUser("John", 30); //fonk. çağırdık
alert(person.name); // John

///////////////////////////////////////

//0 sayısı, özellik anahtarı olarak kullanıldığında "0" dizesine dönüşür:
let obj = {
  0: "test" // same as "0": "test"
};

// both alerts access the same property (the number 0 is converted to string "0")
alert(obj["0"]); // test
alert(obj[0]); // test 

///////////////////////////////////////////////

//for-in metodu

let user3 = {
  name: "John",
  age: 30,
  isAdmin: true
};

for (let key in user3) {
  // keys
  alert(key);  // name, age, isAdmin
  // values for the keys
  alert(user3[key]); // John, 30, true
}

//////////////////////////////////////////

//ordered like an object - bir nesne gibi sıralanmış
let codes = {
  "49": "Germany ",
  "44": "Great Britain ",
  "1": "USA"
}
for (let code in codes) {
  alert(code);  // 1 44 49 
  //tamsayı özellikleri sıralanır, diğerleri oluşturulma sırasına göre görünür. 
}

///////////////////////////////////////////////

let user4 = {
  "name": "John",
  "surname": "Smith"
}
user4.age = 20;

for (let prop in user4) {
  alert(prop);  // name, surname , age
  //String ifade olduğu için yazılma sırasına göre çıktı alınır.
}

//////////////////////////////////////////////////

let schedule = {};

alert(isEmpty(schedule)); // boş olduğu için true

schedule["8:30"] = "get up";

alert(isEmpty(schedule)); // false

///////////////////////////////////////////////////7

//Nesneler referans yoluyla saklanır. Bir nesneye atanan değişken nesnenin kendisini değil,onun belleğindeki adresini saklar.
let message = "Hello!";  //Hello!
let phrase = message;    //Hello! 


let name1 = { 
  name: "John" 
};
let admin = name1; // Nesnenin referansı kopyalanır

////////////////////////////////////////////////////

let obj1 = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

alert( obj1.sizes.height ); // 182


///////////////////////////////////////////////////