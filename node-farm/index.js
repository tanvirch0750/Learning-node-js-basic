const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////////////////
// FILE

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/last.txt", `${data2} \n ${data3}`, "utf-8", (err) => {
//         console.log("your file is written");
//       });
//     });
//   });
// });

//////////////////////////////////
// SERVER
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/") {
    res.end("This is home");
  } else if (pathName === "/overview") {
    res.end("This is overview");
  } else if (pathName === "/product") {
    res.end("This is product");
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`<h1>Page Not Found</h1>`);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});