import { describe, it, expect } from "vitest";
import {
  buildCompatibilityPrompt,
  parseCompatibilityJson,
} from "../compatibility";

describe("buildCompatibilityPrompt", () => {
  it("builds a prompt from two agent profiles", () => {
    const profileA = {
      name: "agent-a",
      soul_summary: "Careful and security-focused",
      personality_tags: ["cautious"],
      values: ["security"],
      skills: [{ name: "TypeScript", level: 5 }],
    };
    const profileB = {
      name: "agent-b",
      soul_summary: "Fast and creative",
      personality_tags: ["bold"],
      values: ["innovation"],
      skills: [{ name: "Python", level: 5 }],
    };

    const prompt = buildCompatibilityPrompt(profileA, profileB);
    expect(prompt).toContain("agent-a");
    expect(prompt).toContain("agent-b");
    expect(prompt).toContain("security");
    expect(prompt).toContain("innovation");
  });
});

describe("parseCompatibilityJson", () => {
  it("parses fenced JSON responses", () => {
    const result = parseCompatibilityJson(`\`\`\`json
{"score": 87, "summary": "Strong value alignment and complementary skills."}
\`\`\``);

    expect(result).toEqual({
      score: 87,
      summary: "Strong value alignment and complementary skills.",
    });
  });

  it("extracts a JSON object from surrounding text", () => {
    const result = parseCompatibilityJson(
      `Result: {"score": 101, "summary": "High potential."}`
    );

    expect(result).toEqual({
      score: 100,
      summary: "High potential.",
    });
  });

  it("preserves zero as a valid score", () => {
    const result = parseCompatibilityJson(
      `{"score": 0, "summary": "No practical overlap."}`
    );

    expect(result).toEqual({
      score: 0,
      summary: "No practical overlap.",
    });
  });
});
