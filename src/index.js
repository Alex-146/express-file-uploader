const path = require("path")
const fs = require("fs")
const express = require("express")
const fileUpload = require("express-fileupload")

const PORT = 5000

const staticDirectory = path.resolve("./static")
if (!fs.existsSync(staticDirectory)) {
  fs.mkdirSync(staticDirectory)
}

const app = express()

app.use("/static", express.static("static"))
app.use(fileUpload())

app.get("/", (req, res) => {
  const p = path.resolve("./src/index.html")
  return res.sendFile(p)
})

app.post("/upload", (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ "message": "!req.files" })
  }
  
  const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file]

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileSavePath = path.join(staticDirectory, file.name)
    fs.writeFileSync(fileSavePath, file.data)
  }

  return res.redirect("/")
})

function getLocalNetworkAddress() {
  const os = require("os")
  const data = os.networkInterfaces()
  const address = data["Ethernet"][1].address // 192.168.1.104
  return address
}

const addresses = [
  `http://localhost:${PORT}`,
  `http://${getLocalNetworkAddress()}:${PORT}`
]

app.listen(PORT, () => console.log(`Server started at:\n${addresses.join("\n")}`))
