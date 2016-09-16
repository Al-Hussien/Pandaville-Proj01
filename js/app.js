var example = angular.module('starter', ['ionic', 'firebase'])
example.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
//The Routing Configuration(login,todo)
example.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login',
    {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginController",
    })
        .state('signup',
    {
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: "SignupController",
    })
    .state('todo',
    {
        url: '/todo',
        templateUrl: 'templates/todo.html',
        controller: 'TodoController',
    })
    $urlRouterProvider.otherwise('/login');
});
//The login Controller(Login,register)
example.controller("LoginController", function ($scope, $firebaseAuth, $state, $location) {
    $scope.login = function (tel, password) {
        var auth = $firebaseAuth();
        var tel = tel + "@pandaville.com";
        auth.$signInWithEmailAndPassword(tel, password)
        .then(function (userData) {
            $state.go('todo');
        }).catch(function (error) {
            alert("ERROR:" + error);
        });
    }
});
example.controller("SignupController", function ($scope, $firebaseAuth, $state, $location) {
    debugger
    var c = 0;
    $scope.selectedProf = "dfs";
    $scope.listProf = [];
    var getList = DBServ.ref('/Professionality');
    getList.on('value', function (snapshot) {
        console.log(snapshot);
        $scope.listProf = snapshot.val();
        console.log($scope.listProf);
    });
    //init();
    $scope.register = function (nameUsr, phoneUsr, profUsr, emailUsr, passwordUsr, birthUsr) {
        var em = phoneUsr + "@pandaville.com";
        var auth = $firebaseAuth();
        auth.$createUserWithEmailAndPassword(em, passwordUsr)
        .then(function (authData) {
            if (emailUsr == null || emailUsr == undefined) {
                emailUsr = em;
            }
            DBServ.ref('users/' + authData.uid).set(
              {
                  Name: nameUsr,
                  Phone_No: phoneUsr,
                  Professionality: profUsr,
                  E_mail: emailUsr,
                  Password: passwordUsr,
                  Birth_Date: birthUsr
              });
            $('.w-form-done').show();
        })
        .catch(function (error) {
            $('.w-form-fail').show();
            switch (error.code) {
                case "EMAIL_TAKEN":
                    alert("Bro, someone's using that email!");
                    break;
                case "EMAIL_TAKEN":
                    alert("Bro, someone's using that email!");
                    break;
                case "INVALID_EMAIL":
                    alert("Dude, that is not an email address!");
                    break;
                default:
                    alert("Error creating user:" + error);
            }
        });
    }
});
//
example.controller("TodoController", function ($scope, $firebase, $firebaseAuth, $ionicPopup, $firebaseObject) {
    $scope.tests = "gsh";
    var uid;
    $scope.list = function () {
        var auth = $firebaseAuth();
        auth.$onAuthStateChanged(function (user) {
            if (user) {
                // User logged in
                uid = user.uid;
                var starCountRef = DBServ.ref('/users/' + uid);
                starCountRef.on('value', function (snapshot) {
                    $scope.data = snapshot.val();
                    console.log($scope.data.E_mail);
                });
                //  var x = $firebaseObject(firebase.database().ref('/users/'+uid));
                // var sync = firebase.database().ref('/users/'+uid);
                // var syncObject = sync.$asObject();
                // syncObject.$bindTo($scope,"data")
            }
            else {
                // User logged out
            }
        });

    }
    $scope.create = function () {
        $ionicPopup.prompt(
          {
              title: "Enter a new todo item",
              inputType: "text"
          }).then(function (result) {
              if (result != "") {
                  console.log($scope.data)
                  if ($scope.data.hasOwnProperty("todos") !== true) {
                      $scope.data.todos = [];
                  }
                  $scope.data.todos.push({ title: result });
                  // var updates = {};
                  // updates['/users/' + uid + '/Todos'] = {title:result};
                  // firebase.database().ref().update(updates);
                  DBServ.ref('users/' + uid + '/Todos').push({ title: result })
              }
          });
    }
});
