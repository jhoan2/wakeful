// This is an auto-generated file, do not edit manually
export const definition = {"models":{"Card":{"id":"kjzl6hvfrbw6ca7ypxfnmbwf4y5zrto47zbam15gij3wu1xqodb45r7dnz2hcmj","accountRelation":{"type":"list"}},"Resource":{"id":"kjzl6hvfrbw6caxx4bevyndbdya82sqcm3ytwfxt2fwa0ozod07hfffouq1oz1d","accountRelation":{"type":"list"}},"CardRelation":{"id":"kjzl6hvfrbw6ca7lw1d90nmi9ug6tvoglio0692cqfxyve6mnheavnlwz8x5kai","accountRelation":{"type":"list"}},"IcarusProfile":{"id":"kjzl6hvfrbw6c6q83f1r39rb7nl2zyqsoatu7th8dogluiq0rlaoii3py535q86","accountRelation":{"type":"single"}},"Settings":{"id":"kjzl6hvfrbw6cas10z4ju58efix7vsg2s3njh20qgh9okak61ujequa8prbx2e6","accountRelation":{"type":"single"}}},"objects":{"Card":{"quote":{"type":"string","required":false},"prefix":{"type":"string","required":false},"suffix":{"type":"string","required":false},"createdAt":{"type":"datetime","required":true},"updatedAt":{"type":"datetime","required":true},"annotation":{"type":"string","required":false}},"Resource":{"doi":{"type":"string","required":false},"url":{"type":"string","required":false},"isbn":{"type":"string","required":false},"title":{"type":"string","required":false},"author":{"type":"string","required":false},"createdAt":{"type":"datetime","required":true},"mediaType":{"type":"string","required":false},"updatedAt":{"type":"datetime","required":true},"publishedAt":{"type":"date","required":false},"readingProgressPercent":{"type":"float","required":true},"readingProgressTopPercent":{"type":"float","required":false},"readingProgressAnchorIndex":{"type":"integer","required":true},"cards":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6ca7ypxfnmbwf4y5zrto47zbam15gij3wu1xqodb45r7dnz2hcmj","property":"ResourceID"}}},"CardRelation":{"cardID":{"type":"streamid","required":true},"resourceID":{"type":"streamid","required":true},"card":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6ca7ypxfnmbwf4y5zrto47zbam15gij3wu1xqodb45r7dnz2hcmj","property":"cardID"}},"resource":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6caxx4bevyndbdya82sqcm3ytwfxt2fwa0ozod07hfffouq1oz1d","property":"resourceID"}}},"IcarusProfile":{"bio":{"type":"string","required":true},"createdAt":{"type":"datetime","required":true},"updatedAt":{"type":"datetime","required":true},"pictureUrl":{"type":"string","required":false},"displayName":{"type":"string","required":true}},"Settings":{"fontSize":{"type":"integer","required":false},"createdAt":{"type":"datetime","required":true},"updatedAt":{"type":"datetime","required":true},"fontFamily":{"type":"string","required":false},"themeModes":{"type":"string","required":false},"account":{"type":"view","viewType":"documentAccount"}}},"enums":{},"accountData":{"cardList":{"type":"connection","name":"Card"},"resourceList":{"type":"connection","name":"Resource"},"cardRelationList":{"type":"connection","name":"CardRelation"},"icarusProfile":{"type":"node","name":"IcarusProfile"},"settings":{"type":"node","name":"Settings"}}}