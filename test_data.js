module.exports = {
  global : {
    base: "http://ec2-52-1-50-223.compute-1.amazonaws.com:8080/rest_test/v3",
    req: {
      headers: { // request headers
        "appbase-secret": "193dc4d2440146082ea734f36f4f2638",
        "content-type": "application/json"
      }
    },
    res: {
      headers: {  //expected response
        "content-type": "application/json"
      }
    }
  },
  tests: [
    {
      description: "Create a new collection",
      req: {
        url: "/user",
        method: "patch"
      },
      res: {
        code: 200,
        body: {
          "_collection": "user",
          "_created": true //if newly created
        }
      }
    },
    {
      description: "Create/Update Document",
      req: { // request to perform
        url: "/user/laura",
        method: "patch",
        body: {
          "foo": "bar"
        }
      },
      res: { //expected response
        code: 200,
        body: {
          "_id": "laura", // has to match the exact string
          "_collection": "user",
          "_timestamp": Number, // could be any number
          "foo": "bar"
        }
      }
    },
    {
      description: "Global endpoint",
      req: {
        url: "/",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_time": {
            "_timestamp": Number,
            "_timezone": "UTC",
            "_ISOString": String,
          },
          _collections: ["user"]
        }
      }
    },
    {
      skip: true,
      description: "Patch Nested Document",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "foo.bar": "bar"
        }
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "foo": {
            "bar": "bar"
          }
        }
      }
    },
    {
      description: "Delete Properties",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "foo": null
        }
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "foo": null // only in this request, it won't appear in a get request
        }
      }
    },
    {
      description: "Add new properties",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "bar": "foo"
        }
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Get Document",
      req: {
        url: "/user/laura",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Method overriding",
      req: {
        headers: {
          "http-method-override": "get" 
        },
        url: "/user/laura",
        method: "post"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Get collection",
      req: {
        url: "/user",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "laura": {
            "_id": "laura",
            "_collection": "user",
            "_timestamp": Number,
            "bar": "foo"
          }
        }
      }
    },
    {
      description: "Query",
      req: {
        url: "/user",
        method: "post",
        body: {
          query: {
            match_all: {}
          }
        }
      },
      res: {
        code: 200,
        body: {
            "took": Number,
            "timed_out": false,
            "_shards": {
              "total": Number,
              "successful": Number,
              "failed": 0
            },
            "hits": {
              "total": 1,
              "max_score": Number,
              "hits": [
                {
                  "_index": String,
                  "_type": "user",
                  "_id": "laura",
                  "_score": Number,
                  "_source": {
                    "_id": "laura",
                    "_collection": "user",
                    "_timestamp": Number,
                    "bar": "foo"
                  }
                }
              ]
            }
        }
      }
    },
    {
      description: "Create a new collection",
      req: {
        url: "/tweet",
        method: "patch"
      },
      res: {
        code: 200,
        body: {
          "_collection": "tweet",
          "_created": true //if newly created
        }
      }
    },
    {
      description: "Patch an existing collection",
      req: {
        url: "/tweet",
        method: "patch"
      },
      res: {
        code: 200,
        body: {
          "_collection": "tweet"
        }
      }
    },
    {
      description: "Push a JSON with an _id in the collection",
      req: {
        url: "/tweet",
        method: "put",
        body: {
          "_id": "tweet1",
          "bar": "foo"
        }
      },
      res: {
        code: 200,
        body: {
          "tweet1" : {
            "_id": "tweet1",
            "_collection": "tweet",
            "_timestamp": Number,
            "bar": "foo"
          }
        }
      }
    },
    {
      description: "Fetching a document created with _id via put",
      req: {
        url: "/tweet/tweet1",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "tweet1",
          "_collection": "tweet",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Create reference",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "/tweet": "tweet/tweet1"
        }
      },
      res: {
        code: 200, 
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "/tweet": {
            "_id": "tweet1",
            "_collection": "tweet",
            "_timestamp": Number,
            "bar": "foo"
          }
        }
      }
    },
    {
      description: "Create reference to a non existing path",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "/tweet2": "tweet/tweet2"
        }
      },
      res: {
        code: 400, 
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Multiple reference provied in a single request",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "/tweet1": "tweet/tweet1",
          "/tweet2": "tweet/tweet2"
        }
      },
      res: {
        code: 400, 
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "References and properties provided together",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "dances": "forro",
          "/tweet2": "tweet/tweet2"
        }
      },
      res: {
        code: 400, 
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Get a deeper document",
      req: {
        url: "/user/laura/tweet",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "tweet1",
          "_collection": "tweet",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Get a deeper non existing document",
      req: {
        url: "/user/laura/tweet2/tweefafv",
        method: "get"
      },
      res: {
        code: 400,
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Get the document with references",
      req: {
        url: "/user/laura",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo",
          "/tweet": {
            "_id": "tweet1",
            "_collection": "tweet",
            "_timestamp": Number,
            "bar": "foo"
          }
        }
      }
    },
    {
      description: "Query",
      req: {
        url: "/user/laura",
        method: "post",
        body: {
          query: {
            match_all: {}
          }
        }
      },
      res: {
        code: 200,
        body: {
            "took": Number,
            "timed_out": false,
            "_shards": {
              "total": Number,
              "successful": Number,
              "failed": 0
            },
            "hits": {
              "total": 1,
              "max_score": Number,
              "hits": [
                {
                  "_index": String,
                  "_type": "tweet",
                  "_id": "tweet1",
                  "_score": Number,
                  "_source": {
                    "_id": "tweet1",
                    "_collection": "tweet",
                    "_timestamp": Number,
                    "bar": "foo"
                  }
                }
              ]
            }
        }
      }
    },
    {
      description: "Get the document w/o references",
      req: {
        url: "/user/laura?references=false",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Remove a reference",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "/tweet": null
        }
      },
      res: {
        code: 200, 
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "/tweet": null
        }
      }
    },
    {
      description: "See if the reference actually got deleted",
      req: {
        url: "/user/laura",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Trying to fetch a deleted path",
      req: {
        url: "/user/laura/tweet",
        method: "get"
      },
      res: {
        code: 400,
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Create a Document on a deeper path, collection provided inside the document",
      req: { // request to perform
        url: "/user/laura/tw",
        method: "patch",
        body: {
          "_collection": "tweet",
          "foo": "bar"
        }
      },
      res: { //expected response
        code: 200,
        body: {
          "_id": String, // random id generated
          "_collection": "tweet",
          "_timestamp": Number,
          "foo": "bar"
        }
      }
    },
    {
      description: "Get the newly created deeper document",
      req: {
        url: "/user/laura/tw",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": String,
          "_collection": "tweet",
          "_timestamp": Number,
          "foo": "bar"
        }
      }
    },
    {
      description: "Create a Document on a deeper path, with an _id",
      req: { // request to perform
        url: "/user/laura/tw2",
        method: "patch",
        body: {
          "_id": "lookAtTheStars", 
          "_collection": "tweet",
          "foo": "bar"
        }
      },
      res: { //expected response
        code: 200,
        body: {
          "_id": "lookAtTheStars",
          "_collection": "tweet",
          "_timestamp": Number,
          "foo": "bar"
        }
      }
    },
    {
      description: "Get the newly created deeper document",
      req: {
        url: "/user/laura/tw2",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "lookAtTheStars",
          "_collection": "tweet",
          "_timestamp": Number,
          "foo": "bar"
        }
      }
    },
    {
      description: "Get the newly created deeper document, from its own collection",
      req: {
        url: "/tweet/lookAtTheStars",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "lookAtTheStars",
          "_collection": "tweet",
          "_timestamp": Number,
          "foo": "bar"
        }
      }
    },
    {
      description: "provide an object inside a reference",
      req: { // request to perform
        url: "/user/laura",
        method: "patch",
        body: {
          "/tw3" : {
            "_id": "lookHowTheyShine", 
            "_collection": "tweet",
            "foo": "bar"
          }
        }
      },
      res: { //expected response
        code: 200,
        body: {
          "/tw3" : {
            "_id": "lookHowTheyShine", 
            "_collection": "tweet",
            "_timestamp": Number,
            "foo": "bar"
          }
        }
      }
    },
    {
      description: "Get the newly created deeper document",
      req: {
        url: "/user/laura/tw3",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "lookHowTheyShine",
          "_collection": "tweet",
          "_timestamp": Number,
          "foo": "bar"
        }
      }
    },
    {
      description: "Get the document with new references",
      req: {
        url: "/user/laura",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo",
          "/tw": {
            "_id": String,
            "_collection": "tweet",
            "_timestamp": Number,
            "foo": "bar"
          },
          "/tw2": {
            "_id": "lookAtTheStars",
            "_collection": "tweet",
            "_timestamp": Number,
            "foo": "bar"
          },
          "/tw3" : {
            "_id": "lookHowTheyShine", 
            "_collection": "tweet",
            "_timestamp": Number,
            "foo": "bar"
          }
        }
      }
    },
    {
      description: "Delete a collection",
      req: {
        url: "/tweet",
        method: "delete"
      },
      res: {
        code: 200,
        body: {
          "_collection": "tweet",
          "_deleted": true
        }
      }
    },
    {
      description: "Trying to delete a non-existent collection",
      req: {
        url: "/tweet",
        method: "delete"
      },
      res: {
        code: 404,
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Fetching a document form a non-existent collection",
      req: {
        url: "/tweet/tweet1",
        method: "get"
      },
      res: {
        code: 404,
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Get the document with references from collection, which just got deleted",
      req: {
        url: "/user/laura",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Delete Document",
      req: {
        url: "/user/laura",
        method: "delete"
      },
      res: {
        code: 200,
        body: {
          "_id": "laura",
          "_collection": "user",
          "_timestamp": Number,
          "_deleted": true,
          "bar": "foo"
        }
      }
    },
    {
      description: "Operating on a Non-existent document",
      req: {
        url: "/user/laura",
        method: "delete"
      },
      res: {
        code: 404,
        body: {
          //error: Number,
          message: String
        }
      }
    },
    {
      description: "Delete a collection",
      req: {
        url: "/user",
        method: "delete"
      },
      res: {
        code: 200,
        body: {
          "_collection": "user",
          "_deleted": true,
          "_createdAt": Number
        }
      }
    },
    {
      description: "Global endpoint: see if the namespaces actually got deleted",
      req: {
        url: "/",
        method: "get"
      },
      res: {
        code: 200,
        body: {
          "_time": {
            "_timestamp": Number,
            "_timezone": "UTC",
            "_ISOString": String,
          },
          _collections: []
        }
      }
    }
  ]
}