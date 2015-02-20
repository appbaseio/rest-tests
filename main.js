var expect = require('chai').expect;
var test_data = require('./test_data.js');
var api = require('supertest')(test_data.global.base);
//flattens nested JSON objects to a single-depth one
var flattenObj = function(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) === 'object') {
			var flatObject = flattenObj(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

//converts body to a testble one
var convertBody = function(body, exactMatch) {
  for(var prop in body) {
    if(exactMatch[prop] !== true) body[prop] = typeof body[prop];
  }
  return body;
}


//test for each test-obj
var test = function(testObj) {
  
  it(testObj.req.method + ': ' + testObj.req.url + (testObj.description !== undefined? " - " + testObj.description + "." : ""), function(done) {
    //req method and url
    var req = api[testObj.req.method](testObj.req.url);

    //req headers
    for(var header in test_data.global.req.headers) {
      req.set(header, test_data.global.req.headers[header]);
    }

    //req data
    if(testObj.req.body !== undefined)
      req.send(testObj.req.body);

    //expect reponse headers
    for(var header in test_data.global.res.headers) {
      req.expect(header, test_data.global.res.headers[header]);
    }

    //expect status code
    req.expect(testObj.res.code);

    //expect body
    req.expect(function(res) {
      //convert body to a testable one
      expect(res.body).to.be.an('object');
      var body = convertBody(flattenObj(res.body), flattenObj(testObj.res.exactMatch));

      //flatten expected-body, so that it is comparable to body
      var expected = flattenObj(testObj.res.body);
      
      //check
      expect(body).to.deep.equal(expected);
    })
    
    //end
    req.end(done);
  
  })
}

describe("Rest API tests. Base: " + test_data.global.base, function() {
  test_data.tests.forEach(test);
})