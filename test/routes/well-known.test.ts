import { test } from "tap"
import { build } from "../helper"

test("nodeinfo route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/.well-known/nodeinfo"
  });
  t.same(JSON.parse(res.payload), {
      "links": [
          {
              "rel": "http://nodeinfo.diaspora.software/ns/schema/2.1",
              "href": `localhost:3000/nodeinfo/2.1`
          }]
  });
})
