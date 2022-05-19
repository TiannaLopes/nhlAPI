const PORT = process.env.PORT || 8000
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const app = express()

const newspapers = [
  {
    name: "sportscenter",
    address: "http://www.espn.com/video/sportscenter",
    base: "",
  },
  {
    name: "thehockeynews",
    address: "https://thehockeynews.com",
    base: "",
  },
  {
    name: "nhlnews",
    address: "https://www.nhl.com/news",
    base: "",
  },
  {
    name: "bleacherreport",
    address: "https://bleacherreport.com/nhl",
    base: "",
  },
  {
    name: "sportsillustrated",
    address: "https://www.si.com/nhl",
    base: "",
  },
  {
    name: "thegaurdian",
    address: "https://www.theguardian.com/sport/nhl",
    base: "",
  },
  {
    name: "cbssports",
    address: "https://www.cbssports.com/nhl",
    base: "",
  },
  {
    name: "tsn",
    address: "https://www.tsn.ca/nhl",
    base: "",
  },
  {
    name: "prohockeynews",
    address: "https://prohockeynews.com/?doing_wp_cron=1652922721.0063400268554687500000",
    base: "",
  },
  {
    name: "twitter",
    address: "https://twitter.com/thehockeynews",
    base: "",
  },
];
const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("hockey")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.address,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Hockey News Api");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBaseAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;
  axios.get(newspaperAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const specifiedArticles = [];
    $('a:contains("hockey")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specifiedArticles.push({
            title,
            url: newspaperBaseAddress + url,
            source: newspaperId
        })
    })
    res.json(specifiedArticles)
  }).catch(err => console.log(errors));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// app.get("/news", (req, res) => {
//   axios
//     .get('https://www.theguardian.com/sport/nhl')
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);

//       $('a:contain("hockey")', html).each(function () {
//         const title = $(this).text()
//         const url = $(this).attr('href')
//         articles.push({
//           title,
//           url,
//         });
//       });
//       res.json(articles);
//     })
//     .catch((err) => {
//       console.log("error");
//     });
// });
