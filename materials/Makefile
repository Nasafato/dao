.PHONY: all verses dictionary translations combined scoreRelevancies
.PRECIOUS: dictionary/unique%Chars.txt

MATDIR := materials
DICTDIR := dictionary
FULLDICTDIR := $(MATDIR)/$(DICTDIR)

all: verses descriptions dictionary translations combined

##################
# Combined: the final output we consume.
##################

# Generally, I'd just run make combined, rather than all, since it doesn't require the dictionary.
combined: combined.json

COMBINED_INPUT_FILES := translations/translations.json verses/dao.json descriptions/descriptions.json explanations/explanations.json

combined.json: $(COMBINED_INPUT_FILES) buildCombined.ts
	pnpm tsx \
		materials/buildCombined.ts \
		materials/verses/dao.json \
		materials/descriptions/descriptions.json \
		materials/translations/translations.json \
		materials/explanations/explanations.json \
		> ./combined.json

##################
# Translations
##################

translations: translations/translations.json

TRANSLATION_FILES := $(wildcard translations/files/*)

translations/translations.json: $(TRANSLATION_FILES) translations/buildTranslations.ts
	pnpm tsx materials/translations/buildTranslations.ts > translations/translations.json

verses/dao.json: verses/build.ts verses/dao.txt 
	pnpm tsx materials/$<

##################
# Audio Recordings: Generate for only translations for now.
##################

FILTER_OUT = $(foreach v,$(2),$(if $(findstring $(1),$(v)),,$(v)))
FILTER_IN = $(foreach v,$(2),$(if $(findstring $(1),$(v)),$(v),))

TRANSLATIONS := $(wildcard translations/files/*)
TRANSLATIONS_GOU := $(call FILTER_IN,gou,$(TRANSLATIONS))

# print_list: $(TRANSLATIONS)
# 	@echo $^
# print_translations:
# 	@echo '$(TRANSLATIONS)'

# print_list: $(TRANSLATIONS_GOU)
# 	@echo $^

# AUDIO_FILES:= $(shell printf 'audio/files/english_gou-generated-%02d.mp3 ' {1..3})

ENGLISH_GOU_AUDIO := $(shell printf 'audio/files/english_gou-%02d-generated.mp3 ' {1..3})
CHINESE_HUMAN_AUDIO := $(shell printf 'audio/files/chinese-%02d-human.mp3 ' {1..81})
CHINESE_GENERATED_AUDIO := $(shell printf 'audio/files/chinese-%02d-generated.mp3 ' {1..81})
ALL_AUDIO := $(ENGLISH_GOU_AUDIO) $(CHINESE_HUMAN_AUDIO) $(CHINESE_GENERATED_AUDIO)
# UPLOAD_FILES := $(addprefix upload/audio/files/, $(notdir $(ALL_AUDIO)))
UPLOAD_FILES := $(addprefix upload/audio/files/, $(notdir $(ENGLISH_GOU_AUDIO)))

upload/audio/files/%.mp3: audio/files/%.mp3
	pnpm local tsx materials/audio/uploadAudio.ts $< $@

upload-audio: $(UPLOAD_FILES)

audio/files/%-generated.mp3: translations/files/%.txt audio/buildAudio.ts
	pnpm local tsx materials/audio/buildAudio.ts $< $@

build-audio: $(ENGLISH_GOU_AUDIO)

audio/availableAudio.json: $(ALL_AUDIO) audio/buildAvailableAudio.ts
	pnpm local tsx materials/audio/buildAvailableAudio.ts

##################
# Explanations
##################

explanations: explanations/explanations.json

EXPLANATION_FILES := $(wildcard explanations/files/*)

explanations/explanations.json: explanations/buildExplanations.ts $(EXPLANATION_FILES)
	pnpm tsx materials/$< > ./explanations/explanations.json

##################
# Descriptions
##################

descriptions: descriptions/descriptions.json

descriptions-clean:
	rm -f descriptions/descriptions-clean.txt
	rm -f descriptions/descriptions.json

descriptions/descriptions-clean.txt: descriptions/clean.sh descriptions/descriptions.txt 
	cat ./descriptions/descriptions.txt | ./$< > './$@'

descriptions/descriptions.json: descriptions/build.ts descriptions/descriptions-clean.txt 
	cat descriptions/descriptions-clean.txt | pnpm tsx ./materials/$< > './$@'

##################
# Dictionary
##################
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