export const getPostbySlug =
  `*[_type == "post" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  author -> {
  name,
  image
},
'comments': *[
  _type == 'comment' &&
  post._ref == ^._id &&
  approved == true],
description,
mainImage,
slug,
body
}`