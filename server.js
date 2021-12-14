const express = require("express");
const handle = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const path = require("path");
const dataServer = require("./data_server.js");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const clientSessions = require("client-sessions");
const { data } = require("jquery");


app.use(express.urlencoded({extended : true}));
app.use(bodyParser.urlencoded({extended: false}));
app.engine(".hbs", handle({extname: ".hbs"}));
app.set("view engine", ".hbs");
app.use(express.static(__dirname));
app.use(express.static("./public/"));
app.use(clientSessions({
  cookieName: "session",
  secret: "week10example_web322",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60 
}));

const user = {
  username: "",
  email: "",
  password: "",
};


const admin = {
  username: "",
  email: "",
  password: "",
};

function ensureLoginUsers(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

function ensureLoginAdmin(req, res, next) {
  if (!req.session.admin) {
    res.redirect("/login");
  } else {
    next();
  }
}

const storage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

  app.get("/", function(req, res){
    var info = { route: {home: true}};
    res.render("home", {data: info, layout: false});
  });
  app.get("/home", function(req, res){
    var info = { route: {home: true}};
    res.render("home", {data: info, layout: false});
  });
  app.get("/registration", function(req, res){
    var info = { route: {registration: true}};
    res.render("registration", {data: info, layout: false});
  });
  app.get("/login", function(req, res){
    var info = { route: {login: true}};
    res.render("login", {data: info, layout: false});
  });
  app.get("/addPlan", ensureLoginAdmin, function(req, res){
    var info = { route: {administration: true}};
    res.render("administration", {data: info, layout: false});
  });
  app.get("/updatePlan",  ensureLoginAdmin, function(req, res){
    var info = { route: {update: true}};
    res.render("update", {data: info, layout: false});
  });
  app.get('/plans', function(req, res){
    let obj = dataServer.displayPlans();
    obj.then((obj)=> {
      res.render("cwh", {data: obj, layout: false});
    });
  });
  app.get("/dashboard_users", ensureLoginUsers, (req, res) => {
    res.render("dashboard_users", {data: req.session.user, layout: false});
  });
  app.get("/dashboard_admin", ensureLoginAdmin, (req, res) => {
    res.render("dashboard_admin", {data: req.session.admin, layout: false});
  });
  app.get("/shoppingcart", ensureLoginUsers,  function(req, res){
    dataServer.displayShoppingCart().then(obj=>{
      let array = {};
      array = obj[0]; 
    res.render("shopping_cart", {data: array, layout: false});
  });
   
  });




  app.post("/updatePlan_post", upload.single("image"), function(req, res){
    let name = req.body.name;
    let price = req.body.price;
    let desc = req.body.desc;
    let performance = req.body.performance;
    let noOfwebsites = req.body.noOfwebsites;
    let traffic = req.body.traffic;
    let poweredby = req.body.poweredby;
    let allinclusive = req.body.allinclusive;
    let hostingfeatures = req.body.hostingfeatures;
    let sitemigration = req.body.sitemigration;
    let domain = req.body.domain;
    let optimization = req.body.optimization;
    let features = req.body.features;
    let emailmarketing = req.body.emailmarketing;
    let certificate = req.body.certificate;
    let ip = req.body.ip;
    let mostpopular = req.body.mostpopular;
   let img = "";
   if(req.file == undefined){
     img = "";
   }
   else{
     img = req.file.path;
   }
    let data = {
      values: {
       name: name,
       price: price,
       desc: desc,
       performance: performance,
       noOfwebsites: noOfwebsites,
       traffic: traffic,
       poweredby: poweredby,
       allinclusive: allinclusive,
       hostingfeatures: hostingfeatures,
       sitemigration: sitemigration,
       domain: domain,
       optimization: optimization,
       features: features,
       emailmarketing: emailmarketing,
       certificate: certificate,
       ip: ip,
       mostpopular: mostpopular,
       img: img,
      },
      error: {
       name: "",
       price: "",
       desc: "",
       img: ""
      }
    };

    var flag = 0;

    function checknumbers(_string)
  {        
      if (isNaN(_string)) 
      return false;
      else 
      return true;
    
  }

    if(!name || name == undefined){
      data.error.name = "Please enter plan name";
      flag = 1;
    }
    if(!price || price == undefined){
      data.error.price = "Please enter the price";
      flag = 1;
    }
    if  (!checknumbers(price)){
      data.error.price = "Please enter numbers only";
      flag = 1;
    }
    if (!desc || desc == undefined){
      data.error.desc = "Please enter the description";
      flag = 1;
    }
    if (!img || img == undefined){
      data.error.img = "Please upload an image for the plan";
      flag = 1;
    }
    if (flag == 1){
      res.render("administration", {data: data, layout: false});
    }

    if(flag == 0){
      let obj = dataServer.findPlan(name);
           obj.then(obj => {
             if (!obj){
              data.error.name = `Plan with title ${name} does not exist`;
              res.render("update", {data: data, layout: false});
             }
             else {
               if(mostpopular == "on"){
                 data.values.mostpopular = true;
               }
               else{
                 data.values.mostpopular = false;
               }
               dataServer.updatePlans(data.values);
               res.render("home", {layout: false});
             }
           })
    }
});

  app.post("/plan_post", upload.single("image"), function(req, res){
      let name = req.body.name;
      let price = req.body.price;
      let desc = req.body.desc;
      let performance = req.body.performance;
      let noOfwebsites = req.body.noOfwebsites;
      let traffic = req.body.traffic;
      let poweredby = req.body.poweredby;
      let allinclusive = req.body.allinclusive;
      let hostingfeatures = req.body.hostingfeatures;
      let sitemigration = req.body.sitemigration;
      let domain = req.body.domain;
      let optimization = req.body.optimization;
      let features = req.body.features;
      let emailmarketing = req.body.emailmarketing;
      let certificate = req.body.certificate;
      let ip = req.body.ip;
      let mostpopular = req.body.mostpopular;
     let img = "";
     if(req.file == undefined){
       img = "";
     }
     else{
       img = req.file.path;
     }
      let data = {
        values: {
         name: name,
         price: price,
         desc: desc,
         performance: performance,
         noOfwebsites: noOfwebsites,
         traffic: traffic,
         poweredby: poweredby,
         allinclusive: allinclusive,
         hostingfeatures: hostingfeatures,
         sitemigration: sitemigration,
         domain: domain,
         optimization: optimization,
         features: features,
         emailmarketing: emailmarketing,
         certificate: certificate,
         ip: ip,
         mostpopular: mostpopular,
         img: img,
        },
        error: {
         name: "",
         price: "",
         desc: "",
         img: ""
        }
      };

      var flag = 0;

      function checknumbers(_string)
    {        
        if (isNaN(_string)) 
        return false;
        else 
        return true;
      
    }

      if(!name || name == undefined){
        data.error.name = "Please enter plan name";
        flag = 1;
      }
      if(!price || price == undefined){
        data.error.price = "Please enter the price";
        flag = 1;
      }
      if  (!checknumbers(price)){
        data.error.price = "Please enter numbers only";
        flag = 1;
      }
      if (!desc || desc == undefined){
        data.error.desc = "Please enter the description";
        flag = 1;
      }
      if (!img || img == undefined){
        data.error.img = "Please upload an image for the plan";
        flag = 1;
      }
      if (flag == 1){
        res.render("administration", {data: data, layout: false});
      }

      if(flag == 0){
        if(mostpopular == "on"){
          data.values.mostpopular = true;
        }
        else{
          data.values.mostpopular = false;
        }
        dataServer.SavePlans(data.values);
        res.render("home", {layout: false});
      }
  });

  app.post("/login_post", function(req, res){
       let email = req.body.email;
       let password = req.body.password;

       let data = {
         values: {
           email: email,
           password: password
         },
         error: {
          email: "",
          password: ""
         }
        };
        var flag = 0;

        if(!email || email == undefined){
          data.error.email = "Please enter email";
          flag = 1;
        }

        if (!password || password == undefined){
          data.error.password = "Please enter password";
          flag = 1;
        }
        
        if (flag == 1){
          res.render("login", {data: data, layout: false});
        }
        else if (flag == 0){
           let obj = dataServer.UserData(email, password);
           obj.then(obj => {
            if (!obj){ 
              data.error.email = "Sorry, you entered the wrong email and/or password."
              res.render("login", {data: data, layout: false});
             }
             else if(!obj.admin){
              req.session.user = {
                username: obj.firstname + " " + obj.lastname,
                email: obj.email,
                password: obj.password
              };
              res.redirect("/dashboard_users");
            }
             else{
              req.session.admin = {
                username: obj.firstname + " " + obj.lastname,
                email: obj.email,
                password: obj.password
              };
              req.session.user = {
                username: obj.firstname + " " + obj.lastname,
                email: obj.email,
                password: obj.password
              };
              res.redirect("/dashboard_admin");
             }
           })
          };          
  });

  app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/login");
  });

  app.post("/registration_post", function(req, res){
    let admin = false;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let postcode = req.body.postcode;
    let country = req.body.country;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let checkbox = req.body.terms;

    let data = {
      values: {
        admin: admin,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        address: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
        password: password,
        confirmpassword: confirmpassword,
        checkbox: checkbox
      },
      error: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
        password: "",
        confirmpassword: "",
        checkbox: ""
      }
    }
    
    function checknumbers(_string)
    {        
        if (isNaN(_string)) 
        return false;
        else if (_string.length != 10)
        return false;
        else 
        return true;
      
    }

    function checkIfStringHasSpecialChar(_string)
    {
      let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(spChars.test(_string)){
          return true;
        } else {
          return false;
      }
    }
     
    function allLetter(_string)
    { 
      return (!/[^a-zA-Z]/.test(_string));
    }
    var flag = 0;
    if (!firstname || firstname == undefined){
      data.error.firstname = "This field is required";
      flag = 1;
    }else if (!allLetter(firstname)){
      data.error.firstname = "Firstname can only contain letters";
      flag = 1;
    }


    if (!lastname || lastname == undefined){
      data.error.lastname = "This field is required";
      flag = 1;
    }
    else if (!allLetter(lastname)){
      data.error.lastname = "Lastname can only contain letters";
      flag = 1;
    }

    if (!email || email == undefined){
      data.error.email = "This field is required";
      flag = 1;
    }
    
    if (!phone || phone == undefined){
      data.error.phone = "This field is required";
      flag = 1;
    }
    else if (!checknumbers(phone)){
      data.error.phone = "Enter a valid phone number";
      flag = 1;
    }

    if (!address || address == undefined){
      data.error.address = "This field is required";
      flag = 1;
    }

    if (!city || city == undefined){
      data.error.city = "This fiels is required";
      flag = 1;
    }
    else if (!allLetter(city)){
      flag = 1;
      data.error.city = "City can only contain letters";
    }
    
    if (!state || state == undefined){
      flag = 1;
      data.error.state = "This field is required";
    }
    else if (!allLetter(state)){
      flag = 1;
      data.error.state = "State can only contain letters";
    }

    if (!postcode || postcode == undefined){
      flag = 1;
      data.error.postcode = "This field is required";
    }
    else if (checkIfStringHasSpecialChar(postcode)){
      flag = 1;
      data.error.postcode = "Postcode can only contain letters and numbers";
    }
    
    if (!country || country == undefined){
      flag = 1;
      data.error.country = "This field is required";
    }  
    else if (!allLetter(country)){
      flag = 1;
      data.error.country = "Country can only contain letters";
    }
    
    if (!password || password == undefined){
      flag = 1;
      data.error.password = "This field is required";
    }
    else if (checkIfStringHasSpecialChar(password)){
      flag = 1;
      data.error.password = "Password cannot contain special characters";
    }
    else if (password.length < 6 || password.length > 12){
      flag = 1;
      data.error.password = "Password must be between 6 to 12 characters";
    }

    if (!confirmpassword || confirmpassword == undefined){
      flag = 1;
      data.error.confirmpassword = "This field is required";
    }
    else if (confirmpassword != password){
      flag = 1;
      data.error.confirmpassword = "Password must match";
    }

    if (!checkbox || checkbox == undefined){
      flag = 1;
      data.error.checkbox = "This field is required";
    }
    if (flag == 1){
      res.render("registration", {data: data, layout: false});
    }
    else if (flag == 0){
      let duplicateEmailObj = dataServer.checkEmail(email);
      duplicateEmailObj.then(duplicateEmailObj => {
        if(duplicateEmailObj){
          data.error.email = "Sorry, this email already exists."
          res.render("registration", {data: data, layout: false});
        }
        else{
          data.values.password = bcrypt.hashSync(data.values.password, salt); 
          dataServer.SaveUsers(data.values);
           res.render("dashboard_users", {data: data, layout: false});
        }
      });
     
    }
});
   
  app.post("/shoppingCart", ensureLoginUsers,function(req, res){
      let planname = req.body.value;
      console.log(planname);
      if(planname){
      dataServer.findPlan(planname).then(obj =>{
           if(obj){
           dataServer.addPlanToShoppingCart(obj.planName, obj.planPrice);
           res.redirect("/shoppingcart");}
           else{
             console.log("object is empty");
           }
      });}
  })

  app.post("/checkout", ensureLoginUsers, function(req,res){
      
      let planname = req.body.planName;
      let planprice = req.body.planPrice;
      let planduration = req.body.planDuration;
      let email = req.session.user.email;
       if(planname){
      dataServer.saveOrder(email, planname, planprice, planduration);
      }

      dataServer.cleanDatabase();
      res.redirect("home");
  })
  const port = process.env.PORT || 8080;
  app.listen(port);

  app.use(function(req, res){
  res.status(404).send("Page Not Found");
  });

