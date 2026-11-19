"""Index the OPC's public investigations catalogue, including its document types."""
import json
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://www.priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/'
def fetch(page):
    address = URL + (f'?o=d&Page={page}&Filter=True' if page > 1 else '')
    with urlopen(Request(address, headers={'User-Agent':'CoolCode public records index'}), timeout=45) as res:
        doc = html.fromstring(res.read())
    intro = ' '.join(doc.xpath('//main//p/text()'))
    match = re.search(r'Showing items ([\d,]+) through ([\d,]+) of ([\d,]+)', intro)
    if not match:
        raise ValueError(f'Unrecognized catalogue page {page}')
    first, last, total = (int(v.replace(',', '')) for v in match.groups())
    records = []
    for item in doc.xpath('//div[@class="item"]'):
        link = item.xpath('.//h2/a[@href]')
        if not link:
            continue
        article = link[0]
        dates = item.xpath('.//time/@datetime')
        record_type = ' '.join(''.join(item.xpath('.//span[@class="item-type"]//text()')).split())
        kind = record_type.partition(' #')[0] or 'Published document'
        report = re.search(r'#([\d-]+)', record_type)
        record = {'title':' '.join(article.text_content().split()),'url':urljoin(URL,article.get('href')),
                  'published':dates[0][:10], 'kind':kind,
                  'findingDate':dates[1][:10] if len(dates)>1 else '', 'id':report[1] if report else ''}
        if not record['url'].startswith('https://www.priv.gc.ca/') or not date.fromisoformat(record['published']):
            raise ValueError('Unexpected catalogue metadata')
        records.append(record)
    if len(records) != last-first+1:
        raise ValueError('Catalogue entry count mismatch')
    return total, records

def main():
    total, rows = fetch(1)
    pages = (total + len(rows)-1)//len(rows)
    with ThreadPoolExecutor(max_workers=3) as pool:
        for expected, more in pool.map(fetch, range(2,pages+1)):
            if expected != total:
                raise ValueError('Source changed during refresh')
            rows.extend(more)
    if len({r['url'] for r in rows}) != total or total < 100:
        raise ValueError('Incomplete catalogue')
    rows.sort(key=lambda r:r['published'], reverse=True)
    data={'retrieved':datetime.now(timezone.utc).date().isoformat(), 'count':total, 'latest':rows[0]['published'],'earliest':rows[-1]['published'],'url':URL,'records':rows}
    file=ROOT/'web/data/index.json'
    file.with_suffix('.tmp').write_text(json.dumps(data,ensure_ascii=False,indent=1)+'\n')
    file.with_suffix('.tmp').replace(file)
    print(total, rows[0]['published'], rows[-1]['published'])
if __name__ == '__main__': main()
