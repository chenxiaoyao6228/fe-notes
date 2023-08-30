/*
 * 多选功能，支持多选，ctrl多选，shift多选，全选，空选
 */
import * as _ from "lodash";

export type IdWise = {
  id: string | number;
};

export type Config = {
  multiple?: boolean;
  limit?: number;
};

const defaultConfig: Config = {
  multiple: false,
  limit: Infinity,
};

export default class MultiSelect<T extends IdWise> {
  private selected: T[]; // 选中, 最后一个为最近选中, 因此需要保证方向
  private config: Config;
  private preAction: "select" | "ctrl" | "shift" | "change" | null;
  private prevSelected: T | null;
  private prevRangeSelected: T[] = [];
  private initialState: T[];
  constructor(initialState: T[], config?: Config) {
    this.initialState = initialState;
    this.config = { ...defaultConfig, ...(config || {}) };
    this.selected = [];
    this.prevSelected = null;
    this.preAction = null;
  }

  private static filterNoOnArr<T extends IdWise>(current: T[], src: T[]) {
    return current.filter((i) => src.some((s) => s.id === i.id));
  }
  private prevIndex() {
    return this.prevSelected == null
      ? -1
      : this.initialState.findIndex((i) => i.id === this.prevSelected?.id);
  }
  select(item: T): T[] {
    if (this.config.multiple) {
      return this.ctrl(item);
    }
    this.selected = [item];
    this.preAction = "select";
    this.prevSelected = item;
    this.prevRangeSelected = [];
    return this.selected;
  }
  change(items: T[]): T[] {
    this.prevSelected = null;
    this.preAction = "change";
    this.selected = items;
    this.prevRangeSelected = [];

    return this.selected;
  }
  ctrl(item: T): T[] {
    this.selected =
      this.selected.findIndex((i) => i.id === item.id) > -1
        ? this.selected.filter((i) => i.id !== item.id)
        : [...this.selected, item];
    this.preAction = "ctrl";
    this.prevSelected = item;
    this.prevRangeSelected = [];
    return this.selected;
  }
  shift(item: T): T[] {
    let prevIndex = this.prevIndex();
    if (prevIndex === -1) {
      // shift的起点. 当没有选中的时候, 第一个shift为多选的起点, 如果有选中, 无论是select, ctrl, shift 都作为上一个选中的起点
      this.prevSelected = this.initialState[0];
      this.preAction = "shift";
      this.selected = [item];
      prevIndex = 0;
    }
    let curIndex = this.initialState.findIndex((i) => item.id === i.id);
    const temp = curIndex;
    curIndex = prevIndex > curIndex ? prevIndex : curIndex;
    prevIndex = prevIndex < temp ? prevIndex : temp;
    const range = _.range(prevIndex, curIndex + 1);
    const rangeEle = range.map((i) => this.initialState[i]);
    this.selected = this.selected.filter(
      (i) => !this.prevRangeSelected.some((prev) => prev.id === i.id)
    );
    this.selected = _.uniqBy([...this.selected, ...rangeEle], "id");
    this.preAction = "shift";
    this.prevRangeSelected = rangeEle;
    return this.selected;
  }
  all(): T[] {
    this.selected = this.initialState.slice();
    this.prevRangeSelected = [];
    return this.selected;
  }
  empty(): T[] {
    this.selected = [];
    this.prevRangeSelected = [];
    return this.selected;
  }
  // 新的列表数据, 其他初始化的配置不变(列表被删除, 或者顺序更改)
  update(newState: T[]): T[] {
    this.initialState = newState;
    this.prevSelected = null;
    this.preAction = null;
    this.prevRangeSelected = [];
    return (this.selected = MultiSelect.filterNoOnArr(
      this.selected,
      this.initialState
    ));
  }
  prev(): T {
    if (!this.prevSelected) {
      throw new Error("not prevMulSelected selected");
    }
    return this.prevSelected;
  }
}
