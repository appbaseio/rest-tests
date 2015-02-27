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
      description: "Create/Update Document without creating a collection, as this should work",
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
      description: "Delete Properties, add new ones",
      req: {
        url: "/user/laura",
        method: "patch",
        body: {
          "foo": null,
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
      description: "Create a new collection",
      req: {
        url: "/user",
        method: "delete"
      },
      res: {
        code: 200,
        body: {
          "_collection": "user",
          "_deleted": true
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
      description: "Push a JSON in the collection",
      req: {
        url: "/tweet",
        method: "post",
        body: {
          "bar": "foo"
        }
      },
      res: {
        code: 200,
        body: {
          "_id": String,
          "_collection": "tweet",
          "_timestamp": Number,
          "bar": "foo"
        }
      }
    },
    {
      description: "Push a JSON with an _id in the collection",
      req: {
        url: "/tweet",
        method: "post",
        body: {
          "_id": "tweet1",
          "bar": "foo"
        }
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
      description: "Fetching a document created with _id via POST",
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
    }
  ]
}