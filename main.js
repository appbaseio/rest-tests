var expect = require('chai').expect;
var test_data = require('./test_data.js');
var supertest = require('supertest');
var api = supertest(test_data.global.base);
var chalk = require('chalk');

// modifying supertest for returning response everytime
supertest.Test.prototype.assertOriginal = supertest.Test.prototype.assert;
supertest.Test.prototype.assert = function(res, callback) {
  this.assertOriginal(res, function(err, r) {
    callback(err, r === undefined? res : r);
  });
}

//flattens nested JSON objects to a single-depth one
var flattenObj = function(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i) && !Array.isArray(ob)) continue;
		
		if ((typeof ob[i]) === 'object') {
			var flatObject = flattenObj(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x) && !Array.isArray(ob)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

//converts body and expected-body to comparable ones
var convertObjects = function(body, expected) {
  for(var prop in expected) {
    if(typeof expected[prop] === "function") {
      expected[prop] = typeof expected[prop]();
      body[prop] = typeof body[prop];
    }
  }
}

//if object is empty
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}



//test for each test-obj
var test = function(testObj) {
  var tester = function(done) {
    //req method and url
    var req = api[testObj.req.method](testObj.req.url);

    //req headers
    for(var header in test_data.global.req.headers) {
      req.set(header, testObj.req.headers && testObj.req.headers[header] ? testObj.req.headers[header]: test_data.global.req.headers[header]);
    }

    //req data
    if(testObj.req.body !== undefined)
      req.send(testObj.req.body);

    //expect reponse headers
    for(var header in test_data.global.res.headers) {
      req.expect(header, testObj.res.headers && testObj.res.headers[header] ? testObj.res.headers[header]: test_data.global.res.headers[header]);
    }

    //expect status code
    req.expect(testObj.res.code);

    //expect body
    req.expect(function(res) {
      expect(res.body).to.be.an('object');
      
      //convert bodies to a testable ones
      var body = flattenObj(res.body);
      var expected = flattenObj(testObj.res.body);
      convertObjects(body, expected);
      
      //check
      expect(body).to.deep.equal(expected);
    })
    
    //end
    req.end(function(error, res) {
      if(error && res) {
        //append response
        error.message += chalk.blue("\nStatus: " + res.status);
        error.message += chalk.blue("\nHeaders: " + JSON.stringify(res.headers, null, 2));
        error.message += chalk.blue("\nBody/Text: " + (isEmpty(res.body)? res.text.slice(0, 100) : JSON.stringify(res.body, null, 2)));
      }
      done(error);
    });
  }
  
  if(testObj.skip) {
    it.skip(testObj.req.method + ': ' + testObj.req.url + (testObj.description !== undefined? " - " + testObj.description + "." : ""), tester);
  } else {
    it(testObj.req.method + ': ' + testObj.req.url + (testObj.description !== undefined? " - " + testObj.description + "." : ""), tester);
  }
  
  
}

describe("", function() {
  test_data.tests.forEach(test);
})