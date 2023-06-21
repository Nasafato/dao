.PHONY: all verses dictionary translations combined scoreRelevancies
.PRECIOUS: dictionary/unique%Chars.txt


define echo_begin
	@echo "🔁 Generating $@"
endef

define echo_end
	@echo "✅ Generated $@"
endef

all: verses descriptions dictionary translations combined

# Generally, I'd just run make combined, rather than all, since it doesn't require the dictionary.
combined: combined.json

combined.json: translations/translations.json verses/dao.json descriptions/descriptions.json buildCombined.ts
	pnpm tsx materials/buildCombined.ts materials/verses/dao.json materials/descriptions/descriptions.json materials/translations/translations.json > ./combined.json

translations: translations/translations.json

translations/translations.json: translations/historicalTranslations.json translations/customTranslations.json translations/buildTranslations.ts
	pnpm tsx materials/translations/buildTranslations.ts > translations/translations.json

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

dictFiles := dictionary/uniqueVerseCharsDict.json dictionary/uniqueDescriptionCharsDict.json dictionary/uniqueAllCharsDict.json

# This one is expensive at the moment and relies on the Postgres DB to be running in Docker.
# Maybe we can make it faster by using a local SQLite DB instead.
dictionary: $(dictFiles)

scoreRelevancies: 
	cat dictionary/uniqueAllChars.txt | pnpm local tsx materials/dictionary/scoreRelevancies.ts

dictionary/dictionary.json: dictionary/cedict.txt dictionary/augments.json dictionary/buildDictionary.ts
	pnpm tsx materials/dictionary/buildDictionary.ts

dictionary/unique%Chars.txt: verses/dao.txt dictionary/buildUniqueChars.ts
	pnpm tsx materials/dictionary/buildUniqueChars.ts

dictionary/unique%CharsDict.json: dictionary/unique%Chars.txt dictionary/dictionary.json dictionary/buildUniqueCharsDict.ts
	pnpm local tsx materials/dictionary/buildUniqueCharsDict.ts