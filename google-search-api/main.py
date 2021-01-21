import urllib
import urllib.parse
import requests
from bs4 import BeautifulSoup

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"

proxies = {
    "http": "89.185.176.198",
    "http": "118.140.160.84",
    "http": "118.140.160.85",
    "http": "89.187.177.95",
    "http": "65.38.21.96",
}

def get_links(soup):
    results = []

    for g in soup.find_all('div', class_='g'):
        rc = g.find('div', class_='tF2Cxc')
        if rc:
            divs = rc.find_all('div', recursive=False)
            if len(divs) >= 2:
                anchor = divs[0].find('a')
                link = anchor['href']
                title = anchor.find('h3').text
                item = {
                    "title": title,
                    "link": link,
                }
                results.append(item)
    return results

def get_answer(soup):
    static = []

    selector = soup.find("div", class_="kno-rdesc")
    selector1 = soup.find("div", class_="dDoNo")
    selector2 = soup.find("span", class_="hgKElc")
    selector3 = soup.find("span", class_="TVtOme")
    selector4 = soup.find("span", class_="FLP8od")
    selector5 = soup.find("div", class_="junCMe")
    selector6 = soup.find("div", class_="QIclbb")
    selector7 = soup.find("span", class_="hrcAhc")
    selector8 = soup.find("span", class_="qv3Wpe")

    if selector:
        static.append(selector.find("span").text)
    if selector1:
        static.append(selector1.text)
    if selector2:
        static.append(selector2.text)
    if selector3:
        static.append("Temperature today is " + selector3.text + " celsius")
    if selector4:
        static.append(selector4.text)
    if selector5:
        static.append(selector5.find("div", class_="title").text)
    if selector6:
        static.append(selector6.find("span").text)
    if selector7:
        static.append("It means: " + selector7.text)
    if selector8:
        static.append("It is " + selector8.text)
    

    if len(static) == 0:
        static.append("Unfortunately we couldn't find what you are looking for, but here are some links that might lead you to the answer")

    return static



def get_desc(query):
    unQ = urllib.parse.unquote(query)
    q = urllib.parse.quote(unQ)
    print(q)
    URL = f"https://google.com/search?hl=en&q={q}"

    headers = {"user-agent": USER_AGENT}
    resp = requests.get(URL, headers=headers, proxies=proxies)


    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")

        links = get_links(soup)

        answers = get_answer(soup)
        
        related = []
        for g in soup.find_all("div", class_="cbphWd"):
            related.append(g.text)


        return answers, links, related
