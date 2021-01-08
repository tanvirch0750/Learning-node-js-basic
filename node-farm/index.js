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
// SERVER and ROUTING

// const server = http.createServer((req, res) => {
//   const pathName = req.url;
//   if (pathName === "/") {
//     res.end("This is home");
//   } else if (pathName === "/overview") {
//     res.end("This is overview");
//   } else if (pathName === "/product") {
//     res.end("This is product");
//   } else {
//     res.writeHead(404, { "Content-Type": "text/html" });
//     res.end(`<h1>Page Not Found</h1>`);
//   }
// });

//////////////////////////////////
// BUILDING A VERY SIMPLE WEB API

// But its not efficient
// const server = http.createServer((req, res) => {
//   const pathName = req.url;
//   if (pathName === "/") {
//     res.end("This is home");
//   } else if (pathName === "/overview") {
//     res.end("This is overview");
//   } else if (pathName === "/product") {
//     res.end("This is product");
//   } else if (pathName === "/api") {
//     fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
//       const productData = JSON.parse(data);
//       res.writeHead(200, {
//         "Content-Type": "application/json",
//       });
//       res.end(data);
//     });
//   } else {
//     res.writeHead(404, { "Content-Type": "text/html" });
//     res.end(`<h1>Page Not Found</h1>`);
//   }
// });

// Efficient way

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardHtml = productObject
      .map((el) => replaceTemplate(tempCard, el))
      .join();
    const output = tempOverview.replace("{%PRODUCT_CARD%}", cardHtml);

    res.end(output);

    // product
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const product = productObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // api
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    // not found
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`<h1>Page Not Found</h1>`);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
