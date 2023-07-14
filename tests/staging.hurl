GET https://{{host}}/

HTTP 307 
Location: /en/verses/chinese

GET https://{{host}}/
Accept-Language: en-US,en;q=0.9,zh;q=0.7

HTTP 307 
Location: /en/verses/chinese

GET https://{{host}}/
Accept-Language: zh;q=0.9,en-US;q=0.6

HTTP 307 
Location: /zh/verses/chinese
