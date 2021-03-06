import Axios from 'axios'
import jsdom from 'jsdom'
const {
    JSDOM
} = jsdom;

const baseURL = "https://www.frasesdobem.com.br/page"

export default async function ({
    s = "",
    page = 1
}) {
    let quotes = []
    await Axios(`${baseURL+"/"+page}`, { params: { s } }).then(response => {
            const document = new JSDOM(response.data).window.document;
            document.querySelectorAll(".card").forEach(quoteCard => {
                let quote = quoteCard.querySelector(".frase")?.innerHTML
                    ?.replace(/<br>/g, "\n") // Replacing html line break to \n
                    ?.replace(/<b>|<[r'//']b>/g, "")
                if (quote)
                    quotes.push({
                        quote, // Removing some others html tags 
                        author: quoteCard.querySelector(".autor")?.textContent?.trim() || ""
                    })
            })
        }).catch(function (error) {
            throw 'Something went wrong' + error
        });

    return {
        quotes,
        page
    }
}