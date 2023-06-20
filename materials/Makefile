.PHONY: all verses dictionary
.PRECIOUS: dictionary/unique%Chars.txt

define echo_begin
	@echo "🔁 Generating $@"
endef

define echo_end
	@echo "✅ Generated $@"
endef

verses/dao.json: verses/build.ts verses/dao.txt 
	pnpm tsx materials/$<

descriptions: descriptions/descriptions.json

descriptions-clean:
	rm -f descriptions/descriptions-clean.txt
	rm -f descriptions/descriptions.json

descriptions/descriptions-clean.txt: descriptions/clean.sh descriptions/descriptions.txt 
	cat ./descriptions/descriptions.txt | ./$< > './$@'

descriptions/descriptions.json: descriptions/build.ts descriptions/descriptions-clean.txt 
	cat descriptions/descriptions-clean.txt | pnpm tsx ./materials/$< > './$@'

dictionary/dictionary.json: dictionary/cedict.txt dictionary/augments.json dictionary/buildDictionary.ts
	pnpm tsx materials/dictionary/buildDictionary.ts

dictionary: dictionary/uniqueVerseCharsDict.json dictionary/uniqueDescriptionCharsDict.json dictionary/uniqueAllCharsDict.json

dictionary/unique%Chars.txt: verses/dao.txt dictionary/buildUniqueChars.ts
	pnpm tsx materials/dictionary/buildUniqueChars.ts

dictionary/unique%CharsDict.json: dictionary/unique%Chars.txt dictionary/dictionary.json dictionary/buildUniqueCharsDict.ts
	pnpm local tsx materials/dictionary/buildUniqueCharsDict.ts