import { customArray } from "country-codes-list";
import parsePhoneNumberFromString, {
  AsYouType,
  getCountryCallingCode,
} from "libphonenumber-js";
import { useCallback, useMemo } from "react";

import { PRIORITIZED_PHONE_CODES } from "@/constants/prioritized-phone-codes";

import type { CountryCode } from "libphonenumber-js";

// --- TYPE GUARD ---

type GetPrefix<T, Suffix extends string> = T extends `${infer Prefix}.${Suffix}`
  ? Prefix
  : never;

type TupleToIntersection<T extends readonly unknown[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First & TupleToIntersection<Rest>
  : unknown;

type ParentPrefixes<
  T,
  Suffixes extends readonly string[],
> = TupleToIntersection<{
  [K in keyof Suffixes]: GetPrefix<T, Suffixes[K] & string>;
}>;

//---

type ValidParent<T> = Extract<ParentPrefixes<T, ["country", "number"]>, T>;

// --- ---

type Dial = { value: CountryCode; label: string; keywords: string[] };

type FormatOptions = {
  number: string;
  country?: CountryCode | undefined;
};

type TrieNode = {
  [key: string]: TrieNode | string | undefined;
  _: string | undefined;
};

type UsePhoneType = () => [
  Dial[],
  (params: FormatOptions) => FormatOptions,
  (number: string, countryCode: CountryCode) => string | undefined,
];

const usePhone: UsePhoneType = () => {
  const indexes = useMemo(() => {
    //

    const countries = customArray(
      {
        name: "{countryNameEn}",
        iso2: "{countryCode}",
        dial: "{countryCallingCode}",
      }
      // {
      //   sortBy: "countryNameEn" // Optional, sorts by name
      // }
    ) as unknown as { name: string; iso2: string; dial: string }[];

    const length = countries.length;
    const map: Dial[] = new Array(length);

    for (let i = 0; i < length; i++) {
      const country = countries[i];
      if (!country) continue;

      map[i] = {
        label: country.name,
        value: country.iso2 as CountryCode,
        keywords: [country.name, country.dial],
      };
    }

    return { map };
  }, []);

  //
  const formatPhoneNumber = useCallback(
    ({ number, country }: FormatOptions) => {
      //

      if (number === "+") {
        return { country, number: "+" };
      }

      if (!number) {
        return { country, number: "" };
      }

      const cleanedNumber = number.trim().replace(/^\+|\s+|[^\d]/g, "");

      //
      if (!cleanedNumber) {
        return { country, number: "" };
      }

      const formatter = new AsYouType(country);
      const initialFormatted = formatter.input(`+${cleanedNumber}`);
      const detectedCountry =
        formatter.getCountry() || lookup(cleanedNumber) || country;
      // use mapped source for early catches ex: +1 416
      //

      const phoneNumber = parsePhoneNumberFromString(initialFormatted, country);

      //
      if (phoneNumber?.isValid()) {
        return {
          number: phoneNumber.format("INTERNATIONAL"),
          country: detectedCountry,
        };
      }

      const finalNumber = initialFormatted.startsWith("+")
        ? initialFormatted
        : `+${initialFormatted}`;

      return { number: finalNumber, country: detectedCountry };
    },
    []
  );

  const replace = useCallback((number: string, countryCode: CountryCode) => {
    //

    const dialCode = getCountryCallingCode(countryCode);

    //
    const cleanNewCode = dialCode.replace(/^\+|\s+|[^\d]/g, "");
    const cleanedNumber = number.replace(/\s+|[^\d+]/g, "");

    if (!cleanedNumber) return `+${cleanNewCode}`;

    const pn = parsePhoneNumberFromString(cleanedNumber);
    const code = pn?.countryCallingCode;

    if (!code) return `+${cleanNewCode}`;

    const updatedNumber = cleanedNumber.replace(code, cleanNewCode);

    return updatedNumber;
  }, []);

  const lookup = (number: string): CountryCode | null => {
    return lookupCountry(PRIORITIZED_PHONE_CODES, number) as CountryCode;
  };

  return [indexes.map, formatPhoneNumber, replace];
};

// [UTIL]
// if need raw speed; try iterative mutable lookup with for
// Ops/s: 216 | Ops/s: 315 [jsbenchmark.com]
const lookupCountry = (trie: TrieNode, phoneNumber: string): string | null => {
  //

  const normalized = phoneNumber.startsWith("+")
    ? phoneNumber
    : "+" + phoneNumber;

  const recurse = (
    node: TrieNode,
    index: number,
    lastCountry: string | null
  ): string | null => {
    if (index >= normalized.length) return lastCountry;

    const char = normalized[index];
    if (char === undefined) return lastCountry;

    const nextNode = node[char];
    if (!nextNode || typeof nextNode !== "object") return lastCountry;

    const updatedLastCountry = nextNode._ ?? lastCountry;

    return recurse(nextNode, index + 1, updatedLastCountry);
  };

  return normalized.length === 0 ? null : recurse(trie, 0, null);
};

export { usePhone };
export type { CountryCode, ValidParent };
