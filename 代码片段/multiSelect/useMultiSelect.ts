import { useCallback } from "react";
import { useRef, useState } from "react";
import MultiSelect from "./MultiSelect";
import type { IdWise, Config } from "./MultiSelect";

const useMultiSelect = <T extends IdWise, C extends Config = Config>(
  initialState: T[],
  config: C
) => {
  const msRef = useRef<MultiSelect<T>>(new MultiSelect(initialState, config));
  const [selected, setSelected] = useState<T[]>([]);

  const select = useCallback((item: T) => {
    setSelected(msRef.current.ctrl(item));
  }, []);
  const selectArea = useCallback((item: T) => {
    setSelected(msRef.current.shift(item));
  }, []);
  const change = useCallback((items: T[]) => {
    setSelected(msRef.current.change(items));
  }, []);
  const update = useCallback((newState: T[]) => {
    setSelected(msRef.current.update(newState));
  }, []);
  const all = useCallback(() => {
    setSelected(msRef.current.all());
  }, []);
  const empty = useCallback(() => {
    setSelected(msRef.current.empty());
  }, []);

  return {
    selected,
    select,
    selectArea,
    change,
    update,
    all,
    empty,
  };
};

export default useMultiSelect;
