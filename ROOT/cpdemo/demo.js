// 
// Here is how to define your module 
// has dependent on mobile-angular-ui

//    var ws = null;  
//    var i=1;
//    function log(text) {  
//       document.getElementById(i).innerHTML = (new Date).getTime() + ": " + text ;  
//    }
//    function startServer() {    
//        var url = document.getElementById("serverip").value;// "ws://192.168.0.102:8887";    
//        if ('WebSocket' in window) {    
//            ws = new WebSocket(url);    
//        } else if ('MozWebSocket' in window) {    
//            ws = new MozWebSocket(url);    
//        } else {    
//            alert('no zhichi');    
//            return;  
//        }    
//        ws.onopen = function() {    
//            alert('Opened!');    
//        };    
//        ws.onmessage = function(event) {    
//            //alert('Receive message: ' + event.data);   
//            log('Receive message: ' + event.data );   
//            i++;
//        };    
//        ws.onclose = function() {    
//          alert('Closed!');    
//        }    
//        document.getElementById("conbtn").disabled="true";  
//        document.getElementById("stopbtn").removeAttribute('disabled');  
//    }    
//    function sendMessage(){    
//        var textMessage=document.getElementById("textMessage").value;    
//            
//        if(ws!=null&&textMessage!=""){    
//            ws.send(textMessage);    
//                
//        }    
//    }    
//    function stopconn(){  
//        ws.close();  
//        document.getElementById("conbtn").removeAttribute('disabled');  
//        document.getElementById("stopbtn").disabled="true";  
//    }  
var zou;

var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'mobile-angular-ui',
 
  
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

app.run(function($transform) {
  window.$transform = $transform;
});

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'home.html', reloadOnSearch: false});
  $routeProvider.when('/scroll',        {templateUrl: 'scroll.html', reloadOnSearch: false}); 
  $routeProvider.when('/toggle',        {templateUrl: 'toggle.html', reloadOnSearch: false}); 
  $routeProvider.when('/tabs',          {templateUrl: 'tabs.html', reloadOnSearch: false}); 
  $routeProvider.when('/accordion',     {templateUrl: 'accordion.html', reloadOnSearch: false}); 
  $routeProvider.when('/overlay',       {templateUrl: 'overlay.html', reloadOnSearch: false}); 
  $routeProvider.when('/forms',         {templateUrl: 'forms.html', reloadOnSearch: false});
  $routeProvider.when('/dropdown',      {templateUrl: 'dropdown.html', reloadOnSearch: false});
  $routeProvider.when('/touch',         {templateUrl: 'touch.html', reloadOnSearch: false});
  $routeProvider.when('/swipe',         {templateUrl: 'swipe.html', reloadOnSearch: false});
  $routeProvider.when('/drag',          {templateUrl: 'drag.html', reloadOnSearch: false});
  $routeProvider.when('/drag2',         {templateUrl: 'drag2.html', reloadOnSearch: false});
  $routeProvider.when('/carousel',      {templateUrl: 'carousel.html', reloadOnSearch: false});
});

// 
// `$touch example`
// 

app.directive('toucharea', ['$touch', function($touch){
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;  
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem){
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if( drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create 
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();
      
      var zIndex = function(){
        var res = 0;
        if (id === carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(){
        elem[0].style.zIndex = zIndex();
      });
      
      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          // 
          // use translate both as basis for the new transform:
          // 
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);
          
          //
          // Add rotation:
          //
          var Dx    = touch.distanceX, 
              t0    = touch.startTransform, 
              sign  = Dx < 0 ? -1 : 1,
              angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );
          
          t.rotateZ = angle + (Math.round(t0.rotateZ));
          
          return t;
        },
        move: function(drag){
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          drag.reset();
        }
      });
    }
  };
});

app.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          //
          // Here you can see how to limit movement 
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);

//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function($rootScope, $scope,$location){

   var ws = null;
    var i=0;
   // $scope.log=function(text){
    function log(text) {
       document.getElementById(i).innerHTML = (new Date).getTime() + ": " + text ;
    }
    $scope.startServer=function(){
//    function startServer() {
        var url = document.getElementById("serverip").value;// "ws://192.168.0.102:8887";    
        if ('WebSocket' in window) {
            ws = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
            ws = new MozWebSocket(url);
        } else {
            alert('no zhichi');
            return;
        }
        ws.onopen = function() {
            alert('Opened!');
        };
        ws.onmessage = function(event) {
            //alert('Receive message: ' + event.data);   
            log('Receive message: ' + event.data );
            i++;
        };
        ws.onclose = function() {
          alert('Closed!');
        }
        document.getElementById("conbtn").disabled="true";
        document.getElementById("stopbtn").removeAttribute('disabled');
    }
    $scope.sendMessage=function(){
     $scope.consoleng(); 
//    function sendMessage(){
        var textMessage=document.getElementById("textMessage").value;

        if(ws!=null&&textMessage!=""){
            ws.send(textMessage);

        }
    }
    $scope.stopconn=function(){
 //   function stopconn(){
        ws.close();
        document.getElementById("conbtn").removeAttribute('disabled');
        document.getElementById("stopbtn").disabled="true";
    }
  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    /* global alert: false; */
    alert('Congrats you scrolled to the end of the list!');
  };

  // 
  // Right Sidebar


  // 
 // $scope.chatUsers = [
 //   { name: 'Carlos  Flowers', online: true },
 //   { name: 'Byron Taylor', online: true },
 //   { name: 'Jana  Terry', online: true },
 //   { name: 'Darryl  Stone', online: true },
 //   { name: 'Fannie  Carlson', online: true },
 //   { name: 'Holly Nguyen', online: true },
 //   { name: 'Bill  Chavez', online: true },
 //   { name: 'Veronica  Maxwell', online: true },
 //   { name: 'Jessica Webster', online: true },
 //   { name: 'Jackie  Barton', online: true },
 //   { name: 'Crystal Drake', online: false },
 //   { name: 'Milton  Dean', online: false },
 //   { name: 'Joann Johnston', online: false },
 //   { name: 'Cora  Vaughn', online: false },
 //   { name: 'Nina  Briggs', online: false },
 //   { name: 'Casey Turner', online: false },
 //   { name: 'Jimmie  Wilson', online: false },
 //   { name: 'Nathaniel Steele', online: false },
 //   { name: 'Aubrey  Cole', online: false },
 //   { name: 'Donnie  Summers', online: false },
 //   { name: 'Kate  Myers', online: false },
 //   { name: 'Priscilla Hawkins', online: false },
 //   { name: 'Joe Barker', online: false },
 //   { name: 'Lee Norman', online: false },
 //   { name: 'Ebony Rice', online: false }
 // ];
//var thisdata=new Object();
var thisdata;
function loadXMLDoc()
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    data=xmlhttp.responseText;
    thisdata=data;
   // return data
  //  alert('data')
    console.log("--------"+data)
    }
  }
xmlhttp.open("GET","http://192.168.139.215:8000/index/",false);
xmlhttp.send();
}
aa=loadXMLDoc();
//alert("aa");
console.log("===="+thisdata);
//$scope.chatUsers =[thisdata.data];// [{"online": "true", "id": 1, "name": "Carlos Flowers"},{"online": "true", "id": 2, "name": "Carlos"}];
//$scope.chatUsers =[{"online": "true", "id": 1, "name": "Carlos Flowers"},{"online": "true", "id": 2, "name": "Carlos"}];
llist=[]
aalist=[]
function xunhuan()
{
    llist=thisdata.split(",,");
    //llist=JSON.parse(llist); 
    console.log(llist);
	
    for (i in llist)
    {
        obj=JSON.parse(llist[i]);
	console.log(obj);
        aalist.push(obj)
    }
    return aalist
   // alert(obj)
}
bblist=xunhuan()
$scope.chatUsers =bblist
console.log("-=-=--"+$scope.chatUsers);

$scope.aaa="aa";
function yonghu()
{
  alert("I am online");
}



  //
  // 'Forms' screen
  //  
  $scope.rememberMe = true;
  $scope.email = 'me@example.com';
  
  $scope.login = function() {
    alert('You submitted the login form');
  };


  // 
  // 'Drag' screen
  // 
//-----------------------
//function GetRequest() {   
	//	var url = $location.search(); //获取url中"?"符后的字串   
       $scope.urll=$location.search(); 
//		var theRequest = new Object();   
//		if (url.indexOf("?") != -1) {   
//				var str = url.substr(1);   
//				strs = str.split("&");   
//				for(var i = 0; i < strs.length; i ++) {   
//						theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
//				}   
//		}   
//		return theRequest;   
//}   
//var Request = new Object();
//Request = GetRequest();
//alert(Request['yid']); 
//---------------------
  $scope.setUrl=function(){
   // $scope.zou=$location.absUrl();
//   alert($location.absUrl());
  }
 // $scope.notices = [];
//  $scope.ids=[];
  
    $scope.zou="huiying";
//-------------------------------------

//  $scope.nid=1;






//-------------------------------------
  $scope.numbera=2;
  
  $scope.safeApply = function(fn) {
  		    var phase = this.$root.$$phase;
  		    if (phase == '$apply' || phase == '$digest') {
  		        if (fn && (typeof(fn) === 'function')) {
  		            fn();
  		        }
  		    } else {
  		        this.$apply(fn);
  		    }
  		};
  $rootScope.cha = function() {
          	console.log("cha");
             	$scope.safeApply(function () {  
             		$scope.numbera = document.getElementById("aa").value;  
          	});
          }
  
//  $scope.consoleng = function() {
//              console.log($scope.numbera) ;
//          }
//  $scope.numbera="hao";
  $scope.numberb=1;

  
 // for (var j = 0; j < 10; j++) {
//$scope.biaoqian=function(){
 // console.log($scope.numbera+" scopenamber");
  //$scope.$apply();
$scope.notices = [];
$scope.idd=2;
 // $scope.ids=[];

$scope.consoleng = function() {
    //$scope.notices = [];
    //$scope.ids=[];
 // for (var j = 0; j < parseInt($scope.numbera); j++) {
 //   $scope.notices = [];
 //   $scope.ids=[];
 //   $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1), id : (j+1) });
 // };
//$scope.idd=1;
 $scope.idd++;

 $scope.notices.push({icon: 'envelope', message: 'Notice ' + ($scope.idd-2), nid: $scope.idd });
//console.log($scope.numbera) ;

var t;
for(var i=0; i<$scope.notices.length-1; i++)
{
  j=$scope.notices.length-1;
  t=$scope.notices[i];
  $scope.notices[i]=$scope.notices[j];
  $scope.notices[j]=t;

};
}
  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
});
