# Open Coding Stammtisch Z10 Dashboard Website
This legacy version is deployed [here](https://stammtafel.github.io/oc-z10/).🍓
But the up-to-date version is deployed [here](https://stammtafel.codeperg.org/oc-z10/).🍍
and maintained [here](https://stammtafel.codeberg.page/oc-z10/)🍍
# Blog entries
## Write them in markdown
**Notes:** 
⚠️For Parser to work better dont forget to add a new line after a list heading like 
```
Some list

* item1
* item2
```
## convert 'em to HTML

```bash
 # apt install pandoc
 $ pandoc -s somefile.md -o somefile2.html
```

## Add them

1. write a new `blog01.html` or 02 03 etc if 01 exists already in valid HTML.
2. ⚠️ edit `blog/blogindex.json` and enter your new blogentry there s.t. it is listed.
