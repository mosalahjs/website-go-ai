export function isNearBottom(el: HTMLElement, threshold = 120) {
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
  return distance <= threshold;
}

export function scrollToBottom(el: HTMLElement) {
  el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}

export function normalizeFarsiToArabic(input: string): string {
  if (!input) return input;

  return (
    input
      // ========== YEH VARIANTS ==========
      .replace(/\u06CC/g, "\u064A")
      .replace(/\u06D2/g, "\u064A")
      .replace(/\u0649/g, "\u064A")

      // ========== KAF VARIANTS ==========

      .replace(/\u06A9/g, "\u0643")
      // ========== HEH VARIANTS ==========
      .replace(/\u06BE/g, "\u0647")
      .replace(/\u06BE/g, "\u0647")
      .replace(/\u06D5/g, "\u0629")
      .replace(/\u06C0/g, "\u0629")
      .replace(/\u067E/g, "\u0628")
      .replace(/\u0686/g, "\u062C")
      .replace(/\u0698/g, "\u0632")
      .replace(/\u06AF/g, "\u0643")

      // ========== NUMBERS ==========

      .replace(/[\u06F0-\u06F9]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0660)
      )

      // ========== ZERO-WIDTH CHARACTERS (cleanup) ==========

      .replace(/\u200C/g, "")

      .replace(/\u200D/g, "")
  );
}

/**
 * Test function to verify normalization
 */
export function testNormalizer() {
  const tests = [
    { input: "یک", expected: "يك", name: "Farsi Yeh + Kaf" },
    { input: "پاسخ", expected: "باسخ", name: "Peh (no Arabic equivalent)" },
    { input: "چیز", expected: "جيز", name: "Tcheh" },
    { input: "ژورنال", expected: "زورنال", name: "Jeh" },
    { input: "گفت", expected: "كفت", name: "Gaf" },
    { input: "سلام", expected: "سلام", name: "Pure Arabic (unchanged)" },
    { input: "۱۲۳", expected: "١٢٣", name: "Persian numbers" },
    { input: "ہے", expected: "هي", name: "Urdu Heh + Yeh Barree" },
  ];

  console.log("🧪 Testing Farsi → Arabic Normalizer\n");

  tests.forEach((test) => {
    const result = normalizeFarsiToArabic(test.input);
    const passed = result === test.expected;
    // console.log(`${passed ? "✅" : "❌"} ${test.name}`);
    // console.log(`   Input:    "${test.input}"`);
    // console.log(`   Expected: "${test.expected}"`);
    // console.log(`   Got:      "${result}"`);
    if (!passed) {
      // console.log(`   ⚠️  FAILED`);
    }
    // console.log("");
  });
}
