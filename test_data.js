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
      description: "Fetch obj",
      req: {
        url: "/user/sagar/~properties",
        method: "post",
        body: {
          all: true
        }
      },
      res: {
        code: 200,
        body: {
          "vertex": {
            "_id": "string",
            "timestamp": "number",
            "rootPath": "user/sagar"
          },
          "optype": "RETR"
        },
        exactMatch: {
          vertex: {
            rootPath: true,
          },
          optype: true
        }
      }
    }
  ]
}