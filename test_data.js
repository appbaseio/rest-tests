module.exports = {
  global : {
    base: "http://api.appbase.io/rest_test/v2",
    req: {
      headers: {
        "appbase-secret": "193dc4d2440146082ea734f36f4f2638",
        "content-type": "application/json"
      }
    },
    res: {
      headers: {
        "content-type": "application/json"
      }
    }
  },
  tests: [
    {
      description: "Fetch Document",
      req: {
        url: "/Materials/Ice/~properties",
        method: "post",
        body: {
          all: true
        }
      },
      res: {
        code: 200,
        body: {
          "vertex": {
            "_id": String,
            "timestamp": Number,
            "rootPath": "Materials/Ice"
          },
          "optype": "RETR"
        }
      }
    }
  ]
}