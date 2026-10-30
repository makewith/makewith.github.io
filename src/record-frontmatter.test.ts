import { describe, expect, it } from "vite-plus/test";
import { frontmatterProblems, readRecord } from "./record-frontmatter";

const valid = { layout: "article", title: "t", date: new Date("2026-11-14T00:00:00.000Z"), author: "honbin" };

describe("frontmatterProblems", () => {
  it("accepts a complete record", () => {
    expect(frontmatterProblems({ ...valid, authorUrl: "https://honb.in", image: "/images/a.jpg" })).toEqual([]);
  });

  it("requires layout: article, a title, a date, and a non-empty author", () => {
    const problems = ['"layout: article"', '"title"', 'a "date" as YYYY-MM-DD', '"author"'];
    expect(frontmatterProblems({})).toEqual(problems);
    expect(frontmatterProblems({ layout: "default", title: "", date: "", author: "" })).toEqual(problems);
  });

  it.each(["2026-11-14", "2028-02-29"])("accepts date %s", (date) => {
    expect(frontmatterProblems({ ...valid, date })).toEqual([]);
  });

  it.each(["2026-02-30", "2026-13-01", "2026/11/14", "11月14日", "2026-11-14xyz", ["2026-11-14"], 20261114])(
    "rejects date %j",
    (date) => {
      expect(frontmatterProblems({ ...valid, date })).toEqual(['a "date" as YYYY-MM-DD']);
    },
  );

  it("treats an empty authorUrl or image as not written", () => {
    expect(frontmatterProblems({ ...valid, authorUrl: null, image: null })).toEqual([]);
  });

  it.each(["https://honb.in", "http://example.com/me"])("accepts authorUrl %s", (authorUrl) => {
    expect(frontmatterProblems({ ...valid, authorUrl })).toEqual([]);
  });

  it.each([
    "javascript:alert(1)",
    "//example.com",
    "https:honb.in",
    "honb.in",
    "mailto:a@example.com",
    'javascript:alert("https://")',
    ["https://honb.in"],
  ])("rejects authorUrl %j", (authorUrl) => {
    expect(frontmatterProblems({ ...valid, authorUrl })).toEqual(['an http(s) "authorUrl"']);
  });

  it.each(["/images/a.jpg", "/images/2026/a.jpg"])("accepts image %s", (image) => {
    expect(frontmatterProblems({ ...valid, image })).toEqual([]);
  });

  it.each([
    "https://example.com/a.jpg",
    "https://example.com/images/a.jpg",
    "//example.com/a.jpg",
    "/\\example.com/a.jpg",
    "/a.jpg",
    "images/a.jpg",
    "javascript:alert(1)",
    "data:image/png;base64,AAAA",
    ["/images/a.jpg"],
  ])("rejects image %j", (image) => {
    expect(frontmatterProblems({ ...valid, image })).toEqual(['an "image" under /images/']);
  });
});

describe("readRecord", () => {
  it("reads every field a record shows", () => {
    expect(
      readRecord({
        title: "t",
        date: new Date("2026-10-27T00:00:00.000Z"),
        author: "honbin",
        authorUrl: "https://honb.in",
        description: "d",
        tags: ["Void", "React"],
        image: "/images/a.jpg",
      }),
    ).toEqual({
      title: "t",
      date: "2026-10-27",
      author: { name: "honbin", url: "https://honb.in" },
      description: "d",
      tags: ["Void", "React"],
      image: "/images/a.jpg",
    });
  });

  it("falls back to empty values for missing fields", () => {
    expect(readRecord({})).toEqual({
      title: "",
      date: "",
      author: { name: "", url: undefined },
      description: "",
      tags: [],
      image: undefined,
    });
  });

  it("reads an empty authorUrl or image as undefined, not null", () => {
    const record = readRecord({ authorUrl: null, image: null });

    expect(record.author.url).toBeUndefined();
    expect(record.image).toBeUndefined();
  });

  it.each([
    ["2026-10-27T00:00:00.000Z", "2026-10-27"],
    ["2026-10-27", "2026-10-27"],
  ])("keeps only YYYY-MM-DD from date %s", (date, expected) => {
    expect(readRecord({ date }).date).toBe(expected);
  });

  it("accepts a single tag and treats an empty one as none", () => {
    expect(readRecord({ tags: "Void" }).tags).toEqual(["Void"]);
    expect(readRecord({ tags: "" }).tags).toEqual([]);
  });
});
