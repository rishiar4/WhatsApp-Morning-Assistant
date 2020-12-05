let puppeteer = require('puppeteer');
let fs = require('fs');
let path = require('path');

let links = process.argv[2];
let allLinks = fs.readFileSync(links, "utf-8");
let llinks = JSON.parse(allLinks);

let allMsgs = require("./allMsgs.json");
const { networkInterfaces } = require('os');

let quotes = require("./quotes.json");

(async function () {

    let waLink = llinks.whatsappLink;

    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--incognito", "--disable-notifications"]
    });

    let numberOfPages = await browser.pages();
    let tab = numberOfPages[0];

    await tab.goto(waLink, {
        waitUntil: "networkidle2"
    });



    await tab.waitForSelector("._1awRl.copyable-text.selectable-text");
    await tab.type("._1awRl.copyable-text.selectable-text", "Self");
    await tab.keyboard.press("Enter");

    let welcomeMsg = allMsgs.firstMsg;
    await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
    await tab.type("#main div.selectable-text[contenteditable]", welcomeMsg);
    await tab.keyboard.press("Enter");

    await getReply(tab, browser);

    // console.log(reply);


})();

async function getReply(tab, browser) {

    let text = await tab.evaluate(() => Array.from(document.querySelectorAll(".copyable-text span"), element => element.textContent));
    let reply = text[text.length - 2];
    if (reply.localeCompare("start") == 0 || reply.localeCompare("Start") == 0) {
        await start(tab, browser);
    }
    else {
        setTimeout(getReply(tab, browser), 10000);
    }
}

async function start(tab, browser) {
    let startMsg = allMsgs.start;

    await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
    let msg = startMsg.split('\n');
    for (let i = 0; i < msg.length; i++) {
        await tab.type("#main div.selectable-text[contenteditable]", msg[i], { delay: 20 });

        await tab.keyboard.down('Shift');
        await tab.keyboard.press('Enter');
        await tab.keyboard.up('Shift');
    }
    await tab.keyboard.press("Enter");

    await getNumbericReply(tab, browser);

}

async function getNumbericReply(tab, browser) {

    let text = await tab.evaluate(() => Array.from(document.querySelectorAll(".copyable-text span"), element => element.textContent));
    let reply = text[text.length - 2];

    if (reply.localeCompare("1") == 0) {

        let max = quotes.length;
        let random = Math.floor(Math.random() * (max - 0 + 1)) + 0;
        let quo = quotes[random].quotes;
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
        await tab.type("#main div.selectable-text[contenteditable]", quo, { delay: 20 });
        await tab.keyboard.press("Enter");

        setTimeout(await start(tab, browser), 30000);
    }
    else if (reply.localeCompare("2") == 0) {

        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
        await tab.type("#main div.selectable-text[contenteditable]", "Enter your Birth Sign ");
        await tab.keyboard.press("Enter");

        await delay(10000);

        await getHorscope(tab, browser);

        setTimeout(await start(tab, browser), 3000);
    }
    else if (reply.localeCompare("3") == 0) {
        console.log("__________________________1111111111111111111111111111");
        let we = llinks.weather;

        let newTab = await browser.newPage();

        await newTab.goto(we, {
            waitUntil: "networkidle2"
        });

        // let phrases = await newTab.$$(".phrase");

        // console.log(phrases.length);
        // let innertext = await newTab.evaluate(function (element) {
        //     let ans = element.textContent;
        //     return ans;
        // }, phrases[0]);



        // let High = await newTab.evaluate(function () {
        //     let arr = document.querySelector(".info .temps .high");
        //     console.log(arr.innerText);
        //     return arr.innerText;
        // });
        // let Low = await newTab.evaluate(function () {
        //     let arr = document.querySelector(".info .temps .low");
        //     console.log(arr.innerText);
        //     return arr.innerText;
        // });

        let High = "27/";
        let Low = "13";


        let temperature = High + Low;
        let innertext = "   Hazy sunshine Day. ";
        innertext = innertext.toLowerCase();

        console.log("LINE 146");

        let final = "Weather Update, It will be a " + innertext.slice(3) + "Temperature for the day is " +  High + Low;


        newTab.close();


        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });

        final = final.split("\n");
        
        await tab.type("#main div.selectable-text[contenteditable]", final, { delay: 20 });

        await tab.keyboard.down("Shift");
        await tab.keyboard.press("Enter");
        await tab.keyboard.up("Shift");
        
        await tab.keyboard.press("Enter");

        setTimeout(await start(tab, browser), 3000);
    }
    else if (reply.localeCompare("4") == 0) {
        let dayOfyearLink = llinks.dayofYear;

        let newTab = await browser.newPage();
        await newTab.goto(dayOfyearLink, {
            waitUntil: "networkidle2"
        });

        let cards = await newTab.$$('.card__title.heading', { visible: true });

        // console.log(cards.length);

        // console.log(cards);

        let text = await newTab.evaluate(function (element) {
            let ans = element.textContent;
            return ans;
        }, cards[0]);

        // console.log(text);
        await newTab.close();

        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
        await tab.type("#main div.selectable-text[contenteditable]", 'Today is also known as "' + text + `".`);
        await tab.keyboard.press("Enter");

        setTimeout(await start(tab, browser), 3000);

    }
    else if (reply.localeCompare("5") == 0) {

        let newsLink = llinks.newsLink;
        let newTab = await browser.newPage();
        await newTab.goto(newsLink, {
            waitUntil: "networkidle2"
        });

        await getNews(tab, newTab, browser);
        //get 5 headlines and their link 
        setTimeout(await start(tab, browser), 3000);
    }
    else if (reply.localeCompare("6") == 0) {
        let quit = allMsgs.quit;
        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
        await tab.type("#main div.selectable-text[contenteditable]", quit, { delay: 100 });
        await tab.keyboard.press("Enter");
        await tab.close();
        console.log("Make new Setup to start again");
    }
    else {
        setTimeout(getNumbericReply(tab, browser), 10000);
    }
}

async function getHorscope(tab, browser) {
    console.log("___________________________________________________________________________________")
    let link = llinks.horoscope;

    let text = await tab.evaluate(() => Array.from(document.querySelectorAll(".copyable-text span"), element => element.textContent));
    let reply = text[text.length - 2];

    await delay(1000);
    if (reply.localeCompare("Aries") || reply.localeCompare("aries") || reply.localeCompare("Taurus") || reply.localeCompare("taurus") || reply.localeCompare("Gemini") || reply.localeCompare("gemini") || reply.localeCompare("Pisces") || reply.localeCompare("pisces") || reply.localeCompare("Aquarius") || reply.localeCompare("aquarius") || reply.localeCompare("Capricorn") || reply.localeCompare("capricorn") || reply.localeCompare("Sagittarius") || reply.localeCompare("sagittarius") || reply.localeCompare("Scorpio") || reply.localeCompare("scorpio") || reply.localeCompare("leo") || reply.localeCompare("Leo") || reply.localeCompare("cancer") || reply.localeCompare("Cancer") || reply.localeCompare("virgo") || reply.localeCompare("Virgo") || reply.localeCompare("libra") || reply.localeCompare("Libra")) {

        let newTab = await browser.newPage();
        link = path.join(link, reply);

        await newTab.goto(link, {
            waitUntil: "networkidle2"
        });

        let details = await newTab.$$('.margin-top-xs-0', { visible : true});

        let fullHoroScope = await newTab.evaluate( function (element){
            let fullText = element.textContent;
            return fullText;
        }, details[0]);

        await newTab.close();

        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
        await tab.type("#main div.selectable-text[contenteditable]", fullHoroScope);
        await tab.keyboard.press("Enter");
        await delay(1000);

    }
    else {
        setTimeout(getHorscope(tab, browser), 10000);
    }

}


async function getNews(tab, newTab, browser) {

    let results = await newTab.evaluate(() => {
        const allTitles = document.querySelectorAll(".Item-headline a", { waitUntil: 'networkidle2' });
        return Array.from(allTitles)
            .slice(0, 5)
            .map(title => {
                let res = {
                    title: title.textContent,
                    link: title["href"]
                };

                return res;

            });
    });
    fs.writeFileSync(path.join(__dirname, "newsItem.json"), JSON.stringify(results));
    newTab.close();
    let newsFile = require('./newsItem.json');
    for (let i = 0; i < 5; i++) {
        let headLine = newsFile[i].title;
        let headLink = newsFile[i].link;

        await tab.waitForSelector("#main div.selectable-text[contenteditable]", { visible: true });
        await tab.type("#main div.selectable-text[contenteditable]", headLine);
        await tab.keyboard.down("Shift");
        await tab.keyboard.press("Enter");
        await tab.keyboard.up("Shift");

        await tab.type("#main div.selectable-text[contenteditable]", headLink);
        await tab.keyboard.down("Shift");
        await tab.keyboard.press("Enter");
        await tab.keyboard.up("Shift");

    }
    await tab.keyboard.press("Enter");
}


async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}



function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

