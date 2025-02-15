import { useMemo } from "react";
import { createSearchParams, useSearchParams } from "react-router-dom";

type ParamRecord = {
  query?: string;
  tab?: string;
};

type SetQueryParamsProps = { [key: string]: unknown } & ParamRecord;
type SetQueryParamsType = (props: SetQueryParamsProps) => void;

type UseQueryParamsProps = {};
type UseQueryParamsTuple = [
  ParamRecord,
  SetQueryParamsType,
  SetQueryParamsType,
];
type UseQueryParamsType = (props?: UseQueryParamsProps) => UseQueryParamsTuple;

const useQueryParams: UseQueryParamsType = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentParams = useMemo(
    () => Object.fromEntries(createSearchParams(searchParams).entries()),
    [searchParams]
  );

  // SETTER
  const setQueryParams: SetQueryParamsType = (queryParams) => {
    const mergedParams = {
      //   ...defaultValues,
      ...currentParams,
      ...queryParams,
    };

    const nonEmptyParams = Object.fromEntries(
      Object.entries(mergedParams).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    const stringParams = Object.fromEntries(
      Object.entries(nonEmptyParams).map(([key, value]) => [key, String(value)])
    );

    const queryString = createSearchParams(stringParams).toString();

    if (queryString) {
      // navigate(`${pathName}?${queryString}`, { replace: true });
      setSearchParams(queryString, { replace: true });
      return;
    }

    if (!queryString) {
      //  navigate(pathName, { replace: true });
      setSearchParams("", { replace: true });
      return;
    }
  };

  // SETTER
  const setProvidedQueryParams: SetQueryParamsType = (queryParams) => {
    const nonEmptyParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    const stringParams = Object.fromEntries(
      Object.entries(nonEmptyParams).map(([key, value]) => [key, String(value)])
    );

    const queryString = createSearchParams(stringParams).toString();

    if (queryString) {
      // navigate(`${pathName}?${queryString}`, { replace: true });
      setSearchParams(queryString, { replace: true });
      return;
    }

    if (!queryString) {
      //  navigate(pathName, { replace: true });
      setSearchParams("", { replace: true });
      return;
    }
  };

  return [currentParams, setQueryParams, setProvidedQueryParams];
};

export { useQueryParams };
export type { ParamRecord, SetQueryParamsType };
