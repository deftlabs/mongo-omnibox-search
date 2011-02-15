# Michael Aaron Safyan (michaelsafyan@gmail.com). Copyright (C) 2011. All rights reserved.

#
# Modified by Deft Labs for the Mongo omnibox search.
#

all: mongo-omnibox-search.zip

.build/mongo-omnibox-search:
	@ mkdir -p ./.build/mongo-omnibox-search
	@ rm -f build
	@ ln -s .build build
	@ cp ./app/manifest.json ./.build/mongo-omnibox-search/manifest.json
	@ cp ./app/background.html ./.build/mongo-omnibox-search/background.html
	@ closure --compilation_level ADVANCED_OPTIMIZATIONS --js ./app/background.js --externs externs.js --js_output_file ./.build/mongo-omnibox-search/background.js
	@ pngcrush -d ./.build/mongo-omnibox-search -rem alla -reduce -brute icon_128.png app/icon_128.png >/dev/null
	@ pngcrush -d ./.build/mongo-omnibox-search -rem alla -reduce -brute icon_48.png app/icon_48.png >/dev/null
	@ cp app/icon_16.png ./.build/mongo-omnibox-search 

mongo-omnibox-search.zip: .build/mongo-omnibox-search
	@ (cd ./.build; zip -r9 mongo-omnibox-search.zip mongo-omnibox-search) >/dev/null
	@ cp ./.build/mongo-omnibox-search.zip ./mongo-omnibox-search.zip
	@ rm -f build
	@ ln -s .build build

clean:
	@- rm -rf ./.build
	@- rm -f ./*.zip
	@- rm -f build
