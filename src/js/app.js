/**Copyright Arno 2017, MIT

*/

var UI = require('ui');

var ajax = require('ajax');
var Feature = require('platform/feature');

var main = new UI.Menu({
    status: {
    color: 'white',
    backgroundColor: 'black'
  },
  highlightBackgroundColor: Feature.color('#00AAFF', 'white'),
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
      }]
    }]
  });
  main.show();


var reaktori = new UI.Card({
  status: {
    color: 'white',
    backgroundColor: 'black'
  },
  title: 'Ladataan',
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
  title: 'Ladataan',
  titleColor: Feature.color('#0055AA', 'black'),
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
    }
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });

(function getReaktori() {
  var date = new Date();
  var today = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
  var url = "http://www.amica.fi/modules/json/json/Index?costNumber=0812&firstDay="+today+"&language=fi";
  var print = null;
  ajax({url: url, type: 'json'},
  function(json) {
    reaktori.title("Reaktori");
    //The default option should always be the third & fourth  item, as we do not want to loop and check every option.
    if(json.MenusForDays[0].SetMenus.length === 0) {
      reaktori.body("Tänään ei ole ruokaa tarjolla.");
      return;
    }
    if(json.MenusForDays[0].SetMenus[2].Name === "Linjasto") {
      var safka = json.MenusForDays[0].SetMenus[2].Components;
      print = "Ruoka 1: \n";
      for(var i = 0; i < safka.length; ++i) {
        var temp = safka[i].split("(");
        print = print + temp[0] + "\n";
      }
    }
    if(json.MenusForDays[0].SetMenus[3].Name === "Linjasto") {
      var safka2 = json.MenusForDays[0].SetMenus[3].Components;
      print = print + "Ruoka 2: \n";
      for(var z = 0; z < safka2.length; ++z) {
        var temp2 = safka2[z].split("(");
        print = print + temp2 + "\n";
      }
    }
    reaktori.body(print);
    
  },
  function(error) {
    console.log('Ajax failed: ' + error);
    reaktori.title("Reaktori");
    reaktori.body('Yhteydessä on nyt jotain häikkää.');
  });

}());

(function getHertsi() {
  var date = new Date();
  var today = date.getUTCFullYear() + '/' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '/' +
           ('00' + date.getUTCDate()).slice(-2);
  var url = "http://www.sodexo.fi/ruokalistat/output/daily_json/12812/"+today+"/fi";
  var print = null;
  ajax({url: url, type: 'json'},
  function(json) {
    hertsi.title("Hertsi");
    //The default option should always be the 2nd & 3rd  item, as we do not want to loop and check every option.
    if(!json.courses[0]) {
      hertsi.body("Tänään ei ole ruokaa tarjolla.");
      return;
    }
    if(json.courses[0].category === "Popular") {
      print = "Ruoka 1: \n" + json.courses[0].title_fi + "\n" +  json.courses[0].desc_fi + "\n";
    }
    if(json.courses[1].category === "Inspiring") {
      print = print +  "Ruoka 2: \n" + json.courses[1].title_fi + "\n" +  json.courses[1].desc_fi + "\n";
    }

    hertsi.body(print);
    
  },
  function(error) {
    console.log('Ajax failed: ' + error);
    hertsi.title("Hertsi");
    hertsi.body('Yhteydessä on nyt jotain häikkää.');
  });

}());

