.PHONY: all verses dictionary translations combined scoreRelevancies
.PRECIOUS: dictionary/unique%Chars.txt

MATDIR := materials
DICTDIR := dictionary
FULLDICTDIR := $(MATDIR)/$(DICTDIR)

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

dictFiles := $(DICTDIR)/uniqueAllCharsDict.json

# This one is expensive at the moment and relies on the Postgres DB to be running in Docker.
# Maybe we can make it faster by using a local SQLite DB instead.
dictionary: $(dictFiles)

scoreRelevancies: 
	cat $(DICTDIR)/uniqueAllChars.txt | pnpm local tsx materials/$(DICTDIR)/scoreRelevancies.ts

prodScoreRelevancies: 
	cat $(DICTDIR)/uniqueAllChars.txt | pnpm prod tsx materials/$(DICTDIR)/scoreRelevancies.ts

$(DICTDIR)/dictionary.json: $(DICTDIR)/cedict.txt $(DICTDIR)/augments.json $(DICTDIR)/buildDictionary.ts
	pnpm tsx $(FULLDICTDIR)/buildDictionary.ts

dictionary/unique%Chars.txt: verses/dao.txt dictionary/buildUniqueChars.ts
	pnpm tsx materials/dictionary/buildUniqueChars.ts

$(DICTDIR)/unique%CharsDict.json: $(DICTDIR)/unique%Chars.txt $(DICTDIR)/dictionary.json $(DICTDIR)/buildUniqueCharsDict.ts
	cat $(DICTDIR)/unique$*Chars.txt | pnpm --silent local tsx $(FULLDICTDIR)/buildUniqueCharsDict.ts > $(DICTDIR)/unique$*CharsDict.json