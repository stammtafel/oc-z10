# Open Coding Stammtisch Z10 Dashboard Website
Deployed [here](https://stammtafel.github.io/oc-z10/).🍓

# Blog entries
## Write them in markdown
**Notes:** 
For Parser to work better dont forget to add a new line after a list heading like 
```
Some list

* item1
* item2
```
## convert 'em to HTML
[according to them](https://gist.github.com/farisubuntu/3ef185915077f84987c7015d00db6105)

```bash
 # apt install pandoc
 $ pandoc -s somefile.md -o somefile2.html
```

## Add Blog Entries

1. write a new `blog01.html` or 02 03 etc if 01 exists already in valid HTML.
2. edit blog/blogindex.json and enter your new blogentry there s.t. it is listed.
