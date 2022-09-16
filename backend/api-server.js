const express = require("express")
const app = express()
const port = 3000
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const e = require("express")
// const morgan = require("morgan")
// const cors = require("cors")

const jwtKey = "abc1234567"

const members = [
  {
    id: 2,
    name: "조상호",
    loginId: "cho",
    loginPw: "sangho",
  },
  {
    id: 3,
    name: "도서관",
    loginId: "lib",
    loginPw: "africa",
  },
  {
    id: 4,
    name: "홍길동",
    loginId: "a",
    loginPw: "1",
  },
]

// app.use(morgan("tiny"))
// app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/api/account", (요청, 응답) => {
  console.log(요청.cookies)
  if (요청.cookies && 요청.cookies.token) {
    jwt.verify(요청.cookies.token, jwtKey, (err, decoded) => {
      if (err) {
        return 응답.sendStatus(401)
      } else {
        return 응답.send(decoded)
      }
    })
  } else {
    응답.sendStatus(401)
  }
})

app.post("/api/account", (요청, 응답) => {
  const loginId = 요청.body.loginId
  const loginPw = 요청.body.loginPw

  const member = members.find((m) => m.loginId === loginId && m.loginPw === loginPw)

  if (member) {
    const options = {
      domain: "localhost",
      path: "/",
      httpOnly: true,
    }

    const token = jwt.sign(
      {
        id: member.id,
        name: member.name,
      },
      jwtKey,
      {
        // 10s, 1m
        expiresIn: "15m",
        issuer: "africalib",
      }
    )

    응답.cookie("token", token, options)
    응답.send(member)
  } else {
    응답.sendStatus(404)
  }

  console.log("loginId: " + loginId)
  console.log("loginPw: " + loginPw)
})

app.delete("/api/account", (요청, 응답) => {
  if (요청.cookies && 요청.cookies.token) 응답.clearCookie("token")

  응답.sendStatus(200)
})

app.listen(port, () => {
  console.log(`http://localhost:${port} 작동 중...`)
})
