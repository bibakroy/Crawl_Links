const { default: axios } = require("axios");
const cheerio = require("cheerio");
const urlParser = require("url");
const getLinksModel = require("./getLinksModel");

exports.getLinksAndAddToDB = async (req, res) => {
  const { domain, waiting } = req.body;
  let seenUrls = {};
  let recursion = true;

  const formattedURL = (link) => {
    if (link) {
      const trimmedLink = link.trim();
      const formatedLink = trimmedLink.endsWith("/")
        ? trimmedLink.slice(0, -1)
        : trimmedLink;
      return formatedLink;
    } else return null;
  };

  const getCompleteUrl = (link, host, protocol) => {
    if (link && !link.includes("void(0)") && !link.includes("#")) {
      if (link.includes("http") && link.includes(host)) {
        return link;
      } else if (link.includes("http") && !link.includes(host)) {
        return null;
      } else if (link.startsWith("//")) {
        return null;
      } else if (!link.includes("http") && link.includes(host)) {
        return `${protocol}//${link}`;
      } else if (link.startsWith("/")) {
        return `${protocol}//${host}${link}`;
      } else {
        return `${protocol}//${host}/${link}`;
      }
    } else {
      return null;
    }
  };

  const getHtml = async (domainLink) => {
    try {
      return await axios.get(domainLink);
    } catch (error) {
      return error;
    }
  };

  const crawlLinks = async ({ url }) => {
    if (!recursion) return Promise.resolve();
    if (seenUrls[url]) {
      seenUrls[url].frequency = seenUrls[url].frequency + 1;
      return null;
    }

    const html = await getHtml(url);
    if (!html.data) return null;
    const $ = cheerio.load(html.data);

    seenUrls[url] = {
      link: url,
      title: $("title").text(),
      frequency: 1,
    };

    const { host, protocol } = urlParser.parse(domain);

    const links = $("a")
      .map((i, link) =>
        getCompleteUrl(formattedURL(link.attribs.href), host, protocol)
      )
      .get();

    for (let i = 0; i < links.length; i++) {
      if (recursion) {
        await crawlLinks({
          url: links[i],
        });
      }
    }

    return Promise.resolve();
  };

  const getLinks = async () => {
    if (waiting) {
      setTimeout(() => {
        recursion = false;
      }, waiting * 1000);
    }

    return await crawlLinks({
      url: formattedURL(domain),
    });
  };

  try {
    await getLinks();
    console.log({ seenUrls });

    const data = {
      domain: domain,
      linksData: Object.values(seenUrls),
    };

    const newGetLinksModel = new getLinksModel(data);
    const links = await newGetLinksModel.save();

    res.status(200).json(links);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      type: "Invalid",
      msg: "Something Went Wrong",
      err: error,
    });
  }
};
