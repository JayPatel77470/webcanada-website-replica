const mongo = require("mongoose");
var bcrypt = require('bcryptjs');
const { type } = require("jquery");
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

// Admin Username: jaypatelp26@gmail.com
// Admin Password: Jay3210
// Make Connection
const pass = encodeURIComponent("~Jay@3210");
var db1 = mongo.createConnection(`mongodb+srv://jaypatelp26:${pass}@senecaweb.4cgmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
var db2 = mongo.createConnection(`mongodb+srv://jaypatelp26:${pass}@senecaweb.4cgmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
var db3 = mongo.createConnection(`mongodb+srv://jaypatelp26:${pass}@senecaweb.4cgmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);

const users_collection = new mongo.Schema({
    "UserID": {
      type: Number,
      primaryKey: true,
      autoIncrement: true,
    },
    "admin": {
      type: Boolean
    },
    "firstname": {
      type: String,
      allowNull: false,
    },
    "lastname": {
      type: String,
      allowNull: false,
    },
    "email": {
      type: String,
      allowNull: false,
      unique: true
    },
    "phone": {
      type: String,
      allowNull: false
    },
    "address": {
      type: String,
      allowNull: false,        
    },
    "address2": {
      type: String,
      allowNull: true
    },
    "city": {
      type: String,
      allowNull: false
    },
    "state": {
      type: String,
      allowNull: false
    },
    "postcode": {
      type: String,
      allowNull: false,
  },
    "country":{ 
      type: String,
      allowNull: false,
    },
    "password": {
      type: String,
      allowNull: false,
    },
    "orders": {"planName": String, "planPrice": Number, "planDuration": String},
});


const Users = db1.model("Users", users_collection);

const plan_collection = new mongo.Schema({
    
      "performance": {
        type: String
      },
      "noOfWebsites": {
        type: String,
      },
      "amountOfSpace": {
        type: String,
      },
      "poweredBy": {
        type: String
      },
      "Inclusive": {
        type: String,
        primaryKey: true
      },
      "hostingFeatures": {
        type: String
      },
      "siteMigration": {
        type: String 
      },
      "domain": {
        type: String
      },
      "optimization": {
        type: String
      },
      "features": {
        type: String
      },
      "marketing": {
        type: String
      },
      "certificate": {
        type: String
      },
      "ip": {
        type: String
      },
      "planIcon": {
        type: String,
        allowNull: false,
      },
      "planName": {
        type: String,
        allowNull: false,
        primaryKey: true
      },
      "planText": {
        type: String,
        allowNull: false
      },
      "planPrice": {
        type: Number,
        allowNull: false
      },
      "mostPopular": {
        type: Boolean,
      },
      "image": {
        type: String,
        allowNull: false
      }
  });

  const PlanDet = db2.model("PlanDet", plan_collection);
  
  const shoppingcart_collection = new mongo.Schema({
       "PlanName": String,
       "PlanPrice": Number,
       "oneYearPlanPrice": Number,
       "twoYearPlanPrice": Number,
       "threeYearPlanPrice": Number
  })

  const ShoppingCart = db3.model("ShoppingCart", shoppingcart_collection);
  
  module.exports.saveOrder = function(email, planName, planPrice, planDuration){
    Users.updateOne(
      { email: email },
      { $set: {
         orders: {planName: planName, planPrice: planPrice, planDuration: planDuration + " months"}
      }
  }).exec();
  }

  module.exports.cleanDatabase = function(){
    db3.collection("shoppingcarts").drop();
  }
  module.exports.addPlanToShoppingCart = function(planname, planprice){
      new ShoppingCart({
        "PlanName": planname,
        "PlanPrice": planprice,
        "oneYearPlanPrice": parseFloat(planprice - (0.37*planprice)).toFixed(2),
        "twoYearPlanPrice": parseFloat(planprice - (0.40*planprice)).toFixed(2),
        "threeYearPlanPrice": parseFloat(planprice - (0.43*planprice)).toFixed(2)
      }).save(err => {
        if(err)
          console.log(`There was an error adding the plan to shopping cart: ${err}`);
        else 
          console.log("The Plan was added to the collection");
       });
  }

  module.exports.UserData = function(email, password){
        var flag = 0;
        return Users.findOne({email: email}).lean().exec().then((obj) => {
           if(obj){
             if (bcrypt.compareSync(password, obj.password)) flag = 1;
           }
           if(flag === 1){
             return obj;
           }
           else{
             obj = "";
             return obj;
           }
          });
  }

  module.exports.SaveUsers = function(data){
    new Users({
        admin: data.admin,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        password: data.password
    }).save(err => {
      if(err)
        console.log(`There was an error saving the User: ${err}`);
      else 
        console.log("The User was saved to the collection");
     });
  }

  module.exports.checkEmail = function(email){
    return Users.findOne({email: email}).lean().exec().then(obj => { return obj } );
  }

  module.exports.SavePlans = function(data){
    new PlanDet({
      planName: data.name,
      planPrice: data.price,
      planText: data.desc,
      performance: data.performance,
      noOfWebsites: data.noOfwebsites,
      amountOfSpace: data.traffic,
      poweredBy: data.poweredby,
      Inclusive: data.allinclusive,
      hostingFeatures: data.hostingfeatures,
      siteMigration: data.sitemigration,
      domain: data.domain,
      optimization: data.optimization,
      features: data.features,
      marketing: data.emailmarketing,
      certificate: data.certificate,
      ip: data.ip,
      mostPopular: data.mostpopular,
      image: data.img,
    }).save(err => {
      if(err)
        console.log(`There was an error saving the User: ${err}`);
      else 
        console.log("The User was saved to the collection");
     });
  }

  module.exports.displayPlans = function(){
    return PlanDet.find().lean().exec().then((obj) => {
      return obj;
     });
  }
  module.exports.displayShoppingCart = function(){
    return ShoppingCart.find().lean().exec().then((obj)=>{
      return obj;
    });
  }
  module.exports.updatePlans = function(plan) {
    PlanDet.updateOne(
      { planName: plan.name },
      { $set: {
        planName: plan.name, 
        planPrice: plan.price, 
        planText: plan.desc,
        performance: plan.performance,
        noOfWebsites: plan.noOfWebsites,
        amountOfSpace: plan.traffic,
        poweredBy: plan.poweredby,
        Inclusive: plan.allinclusive,
        hostingFeatures: plan.hostingfeatures,
        siteMigration: plan.sitemigration,
        domain: plan.domain,
        optimization: plan.optimization,
        features: plan.features,
        marketing: plan.emailmarketing,
        certificate: plan.certificate,
        ip: plan.ip,
        mostPopular: plan.mostpopular,
        image: plan.img,}}
    ).exec();
  }
  
  module.exports.findPlan = function(planName){
     return PlanDet.findOne({planName: planName}).lean().exec().then(obj => { return obj } );
  }
  
  