/*
Copyright 2017, Arno

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var UI = require('ui');

var ajax = require('ajax');
var Feature = require('platform/feature');

var main = new UI.Menu({
  status: {
    color: 'white',
    backgroundColor: 'black'
  },
  highlightBackgroundColor: Feature.color('#00AAFF', 'black'),
  highlightTextColor: 'white',
  sections: [{
    title: 'Ravintolat',
    items: [{
      title: 'Reaktori',
      /*icon: 'images/menu_icon.png',*/
      subtitle: 'Kampusareena'
    }, {
      title: 'Hertsi',
      subtitle: 'Tietotalo'
    }, {
      title: 'Newton',
      subtitle: 'Konetalo'
    }]
  }]
});
  main.show();


var reaktori = new UI.Card({
  status: {
    color: 'white',
    backgroundColor: 'black'
  },
  title: 'Ladataan...',
  titleColor: Feature.color('#005500', 'black'),
  bodyColor: 'black',
  backgroundColor: 'white',
  scrollable: 'true',
  style: 'small'
});

var hertsi = new UI.Card({
  status: {
    color: 'white',
    backgroundColor: 'black'
  },
  title: 'Ladataan...',
  titleColor: Feature.color('#0055AA', 'black'),
  bodyColor: 'black',
  backgroundColor: 'white',
  scrollable: 'true',
  style: 'small'
});

var newton = new UI.Card({
  status: {
    color: 'white',
    backgroundColor: 'black'
  },
  title: 'Ladataan...',
  titleColor: Feature.color('#AA0000', 'black'),
  bodyColor: 'black',
  backgroundColor: 'white',
  scrollable: 'true',
  style: 'small'
});


main.on('select', function(e) {
  if(e.itemIndex === 0) {
    reaktori.show();
  }
  else if(e.itemIndex === 1) {
    hertsi.show();
  } else if(e.itemIndex === 2) {
    newton.show();
  }
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
});

//Launching all the ajax-requests at startup for improved responsiveness.
(function getReaktori() {
  var date = new Date();
  var today = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
  var url = "http://www.amica.fi/modules/json/json/Index?costNumber=0812&firstDay="+today+"&language=fi";
  var print = "";
  ajax({url: url, type: 'json'},
  function(json) {
    
    if(json.MenusForDays[0].SetMenus.length === 0) {
      reaktori.title("Reaktori");
      reaktori.body("Tänään ei ole ruokaa tarjolla.");
      return;
    }
    //The default option should always be the third & fourth item.
    if(json.MenusForDays[0].SetMenus[2].Name === "Linjasto") {
      var safka = json.MenusForDays[0].SetMenus[2].Components;
      print = "Ruoka 1: \n";
      for(var i = 0; i < safka.length; ++i) {
        //Getting rid of the dietary information
        //Sometimes the data doesn't have the opening bracket though...
        var temp = safka[i].split("(");
        print = print + temp[0] + "\n";
      }
    }
    if(json.MenusForDays[0].SetMenus[3].Name === "Linjasto") {
      var safka2 = json.MenusForDays[0].SetMenus[3].Components;
      print = print + "Ruoka 2: \n";
      for(var z = 0; z < safka2.length; ++z) {
      //Getting rid of the dietary information
        var temp2 = safka2[z].split("(");
        print = print + temp2[0] + "\n";
      }
    }
    reaktori.title("Reaktori");
    reaktori.body(print);
    
  },
  function(error) {
    console.log('Ajax failed: ' + error);
    reaktori.title("Tapahtui virhe:");
    reaktori.body('Yhteydessä on nyt jotain häikkää.');
  });

}());

(function getHertsi() {
  var date = new Date();
  var today = date.getUTCFullYear() + '/' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '/' +
           ('00' + date.getUTCDate()).slice(-2);
  var url = "http://www.sodexo.fi/ruokalistat/output/daily_json/12812/"+today+"/fi";
  var print = "";
  ajax({url: url, type: 'json'},
  function(json) {
    if(!json.courses[0]) {
      hertsi.title("Hertsi");
      hertsi.body("Tänään ei ole ruokaa tarjolla.");
      return;
    }
    //The default option should always be the 2nd & 3rd item.
    if(json.courses[0].category === "Popular") {
      print = "Ruoka 1: \n" + json.courses[0].title_fi + "\n" +  json.courses[0].desc_fi + "\n";
    }
    if(json.courses[1].category === "Inspiring") {
      print = print +  "Ruoka 2: \n" + json.courses[1].title_fi + "\n" +  json.courses[1].desc_fi + "\n";
    }
    hertsi.title("Hertsi");
    hertsi.body(print);    
  },
  function(error) {
    console.log('Ajax failed: ' + error);
    hertsi.title("Tapahtui virhe:");
    hertsi.body('Yhteydessä on nyt jotain häikkää.');
  });

}());

//A little helper function for the Date-class
Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

(function getNewton() {
  var date = new Date();
  var weeknumber = date.getWeekNumber();
  var daynumber = date.getDay();
  var url = "http://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByWeekday?KitchenId=6&MenuTypeId=60&OpenInfoId=2352&week="+weeknumber+"&weekday="+daynumber+"&DietInfo=1164&kitcheninfoid=1224&lang=%27fi%27&format=json";

  ajax({url: url},
  function(json) {
    var print = "";
    //Since the Juvenes Api is quite complicated to say at least, we need to format the output to match the JSON standard, thanks Lawok :)
    var str = json;
    str = str.replace(/\\/g, "");
    str = str.replace(/:"{/g, ":{");
    str = str.replace(/}"}/g, "}}");
    str = str.slice(1, -2);
    json = JSON.parse(str);
   if(!json.d.MealOptions.length) {
     newton.title("Newton");
     newton.body("Tänään ei ole ruokaa tarjolla.");
     return;
   }
  for(var x = 0; x < json.d.MealOptions.length; ++x) {
    print = print + "Ruoka "+ (x+1) +":" + "\n";
        for (var i = 0; i < json.d.MealOptions[x].MenuItems.length; ++i ) {
      print = print + json.d.MealOptions[x].MenuItems[i].Name + "\n";
    }
  } 
    newton.title("Newton");
    newton.body(print);
  },
  function(error) {
    console.log('Ajax failed: ' + error);
    newton.title("Tapahtui virhe:");
    newton.body('Yhteydessä on nyt jotain häikkää.');
  });

}());
