// This is an auto-generated file, do not edit manually
export const definition = {"models":{"IdealiteResource":{"id":"kjzl6hvfrbw6c8qu9jje08b5ywam9jomkhewc7g5u9h5ugi1d678rt9claqgvjv","accountRelation":{"type":"list"}},"Card":{"id":"kjzl6hvfrbw6c8vpglum4cqjgjrpyi0hee8glrmpiewej2yph9dez7g2pntx8bo","accountRelation":{"type":"list"}},"AccountResources":{"id":"kjzl6hvfrbw6c7d2ezspefexcfumbndeqwn7u3f0xfvm5botk8w5fptznnkurcr","accountRelation":{"type":"list"}},"IdealiteProject":{"id":"kjzl6hvfrbw6c57e4rox4ho4kwkxn5jsimwacf4rehmtvjg8kne7n6e8wlyide9","accountRelation":{"type":"list"}},"IdealiteProjectCardCollection":{"id":"kjzl6hvfrbw6cawpqzffm3nc8gynqunn5o23htrw9tq8mn8rt738a2g05nk66c0","accountRelation":{"type":"list"}}},"objects":{"IdealiteResource":{"cid":{"type":"string","required":false},"doi":{"type":"string","required":false},"url":{"type":"string","required":false,"indexed":true},"isbn":{"type":"string","required":false},"title":{"type":"string","required":false,"indexed":true},"author":{"type":"string","required":false},"createdAt":{"type":"datetime","required":false},"mediaType":{"type":"string","required":false},"updatedAt":{"type":"datetime","required":false,"indexed":true},"description":{"type":"string","required":false},"publishedAt":{"type":"date","required":false},"clientMutationId":{"type":"string","required":false},"cards":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c8vpglum4cqjgjrpyi0hee8glrmpiewej2yph9dez7g2pntx8bo","property":"resourceId"}}},"Card":{"cid":{"type":"string","required":false},"url":{"type":"string","required":false,"indexed":true},"quote":{"type":"string","required":false},"altText":{"type":"string","required":false},"deleted":{"type":"boolean","required":false,"indexed":true},"pinSize":{"type":"integer","required":false},"mimeType":{"type":"string","required":false},"createdAt":{"type":"datetime","required":false},"updatedAt":{"type":"datetime","required":false,"indexed":true},"videoTime":{"type":"string","required":false},"annotation":{"type":"string","required":false},"resourceId":{"type":"streamid","required":false},"pageYOffset":{"type":"float","required":false},"scrollHeight":{"type":"float","required":false},"account":{"type":"view","viewType":"documentAccount"},"resource":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c8qu9jje08b5ywam9jomkhewc7g5u9h5ugi1d678rt9claqgvjv","property":"resourceId"}},"collection":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c8vpglum4cqjgjrpyi0hee8glrmpiewej2yph9dez7g2pntx8bo","property":"projectId"}}},"AccountResources":{"url":{"type":"string","required":false,"indexed":true},"createdAt":{"type":"datetime","required":false},"recipient":{"type":"did","required":true,"indexed":true},"updatedAt":{"type":"datetime","required":false,"indexed":true},"resourceId":{"type":"streamid","required":false},"resource":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c8qu9jje08b5ywam9jomkhewc7g5u9h5ugi1d678rt9claqgvjv","property":"resourceId"}}},"IdealiteProject":{"cid":{"type":"string","required":false},"url":{"type":"string","required":false,"indexed":true},"title":{"type":"string","required":false,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"IdealiteProjectProjectStatus","required":false,"indexed":true},"deleted":{"type":"boolean","required":false,"indexed":true},"priority":{"type":"reference","refType":"enum","refName":"IdealiteProjectProjectPriority","required":false,"indexed":true},"createdAt":{"type":"datetime","required":false},"updatedAt":{"type":"datetime","required":false,"indexed":true},"description":{"type":"string","required":false},"account":{"type":"view","viewType":"documentAccount"}},"IdealiteProjectCardCollection":{"cardId":{"type":"streamid","required":true},"deleted":{"type":"boolean","required":false,"indexed":true},"projectId":{"type":"streamid","required":false,"indexed":true},"card":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c8vpglum4cqjgjrpyi0hee8glrmpiewej2yph9dez7g2pntx8bo","property":"cardId"}},"project":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c57e4rox4ho4kwkxn5jsimwacf4rehmtvjg8kne7n6e8wlyide9","property":"projectId"}}}},"enums":{"IdealiteProjectProjectStatus":["TODO","DOING","DONE","DROPPED","ARCHIVED"],"IdealiteProjectProjectPriority":["LOW","MEDIUM","HIGH"]},"accountData":{"idealiteResourceList":{"type":"connection","name":"IdealiteResource"},"cardList":{"type":"connection","name":"Card"},"accountResourcesList":{"type":"connection","name":"AccountResources"},"idealiteProjectList":{"type":"connection","name":"IdealiteProject"},"idealiteProjectCardCollectionList":{"type":"connection","name":"IdealiteProjectCardCollection"}}}