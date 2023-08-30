import MultiSelect from './MultiSelect';
import * as _ from 'lodash';

describe('multiSelect', () => {
  const testData = (start, end) =>
    _.range(start, end).map((item) => {
      return { id: `${item}` };
    });
  const rangeMock = (start = 1, end) => {
    return start < end
      ? _.range(start, end + 1).map((i) => {
          return { id: `${i}` };
        })
      : _.range(start, end - 1).map((i) => {
          return { id: `${i}` };
        });
  };
  const rangeMockArray = (params: number[]) => {
    return params.map((i) => {
      return { id: `${i}` };
    });
  };
  describe('single mode', () => {
    const multiFactory = () => new MultiSelect<{ id: string }>(testData(1, 50));

    describe('select', () => {
      test('select 1, select 4 => [4]', () => {
        const ms = multiFactory();
        let res = ms.select({ id: '1' });
        expect(res).toEqual([{ id: '1' }]);
        res = ms.select({ id: '4' });
        expect(res).toEqual([{ id: '4' }]);
      });
      test('无反选, select 1, select 1 => [1] ', () => {
        const ms = multiFactory();
        let res;
        ms.select({ id: '1' });
        res = ms.select({ id: '1' });
        expect(res).toEqual([{ id: '1' }]);
      });
    });
    describe('ctrl', () => {
      test('ctrl 1 -> ctrl 2  => [1,2]', () => {
        const ms = multiFactory();
        let res;

        res = ms.ctrl({ id: '1' });
        expect(res).toEqual([{ id: '1' }]);
        res = ms.ctrl({ id: '2' });
        expect(res).toEqual([{ id: '1' }, { id: '2' }]);
      });
      test('ctrl 1 -> ctrl 1 => []', () => {
        const ms = multiFactory();
        ms.ctrl({ id: '1' });
        const res = ms.ctrl({ id: '1' });
        expect(res).toEqual([]);
      });
      test('ctrl 1 -> select 4 -> select 3 => [3]', () => {
        const ms = multiFactory();
        ms.select({ id: '1' });
        ms.ctrl({ id: '4' });
        const res = ms.select({ id: '3' });
        expect(res).toEqual([{ id: '3' }]);
      });
      test('ctrl 1 -> ctrl 3 -> select 2 => [2]', () => {
        const ms = multiFactory();
        let res;
        res = ms.ctrl({ id: '1' });
        expect(res).toEqual([{ id: '1' }]);
        res = ms.ctrl({ id: '3' });
        expect(res).toEqual([{ id: '1' }, { id: '3' }]);
        res = ms.select({ id: '2' });
        expect(res).toEqual([{ id: '2' }]);
      });
    });
    describe('shift', () => {
      test('null -> shift 5 => [5]', () => {
        const ms = multiFactory();
        const res = ms.shift({ id: '5' });
        expect(res).toEqual([{ id: '5' }]);
      });
      test('null -> select 5, -> shift 10 => [5,...,10]', () => {
        const ms = multiFactory();
        let res;
        res = ms.select({ id: '5' });
        expect(res).toEqual([{ id: '5' }]);
        res = ms.shift({ id: '10' });
        expect(res).toEqual(rangeMock(5, 10));
      });
      test('null -> ctrl 5 -> shift 10 => [5,...,10]', () => {
        const ms = multiFactory();
        ms.ctrl({ id: '5' });
        let res = ms.shift({ id: '10' });
        expect(res).toEqual(rangeMock(5, 10));
      });

      test('null -> shift  10 -> shift  20 -> shift 15 => [10,...,15]', () => {
        const ms = multiFactory();
        let res;
        // expect(ms.prev()).toThrow();
        res = ms.shift({ id: '10' });
        expect(res).toEqual([{ id: '10' }]);
        res = ms.shift({ id: '20' });
        expect(res).toEqual(rangeMock(10, 20));
        res = ms.shift({ id: '15' });
        expect(res).toEqual(rangeMock(10, 15));
      });

      test('select 1 -> shift 5 -> ctrl 3 -> shift 6 => [1,2,4,5,3,6]', () => {
        const ms = multiFactory();
        let res;
        ms.shift({ id: '1' });
        ms.shift({ id: '5' });
        ms.ctrl({ id: '3' });
        res = ms.shift({ id: '6' });
        expect(res).toEqual(rangeMockArray([1, 2, 4, 5, 3, 6]));
      });

      test('反向: shift 20 -> shift  10, -> shift 15 =>  [20,...,15]', () => {
        const ms = multiFactory();
        let res;
        res = ms.shift({ id: '20' });
        expect(res).toEqual([{ id: '20' }]);
        res = ms.shift({ id: '10' });
        expect(res).toEqual(rangeMock(20, 10));
        res = ms.shift({ id: '15' });
        expect(res).toEqual(rangeMock(20, 15));
      });

      test('不连续: ctrl 1 -> ctrl 3 -> shift 5 -> ctrl 7 -> ctrl 7 => [1,3,4,5]', () => {
        const ms = multiFactory();
        let res;
        ms.ctrl({ id: '1' });
        ms.ctrl({ id: '3' });
        res = ms.shift({ id: '5' });
        expect(res).toEqual(rangeMockArray([1, 3, 4, 5]));
      });
    });
    describe('update', () => {
      test('should update initialState and selected state', () => {
        const ms = new MultiSelect(testData(1, 5));
        ms.update(testData(6, 10));
        // test based on behaviour
        const res = ms.select({ id: '8' });
        expect(res).toEqual([{ id: '8' }]);
      });
    });
    test('all', () => {
      const ms = new MultiSelect(testData(1, 50));
      const res = ms.all();
      expect(res).toEqual(testData(1, 50));
    });
    test('empty', () => {
      const ms = multiFactory();
      const res = ms.empty();
      expect(res).toEqual([]);
    });
  });
  // multiple mode的区别就是, select和ctrl一样
  describe('multiple mode', () => {
    const multiFactory = () =>
      new MultiSelect(testData(1, 50), { multiple: true });
    test('select 1 -> select 1 => []', () => {
      const ms = multiFactory();
      let res;
      res = ms.select({ id: '1' });
      res = ms.select({ id: '1' });
      expect(res).toEqual([]);
    });
    test('ctrl 1 -> select 4, -> select3 -> [1,4,3]', () => {
      const ms = multiFactory();
      ms.ctrl({ id: '1' });
      ms.select({ id: '4' });
      const res = ms.select({ id: '3' });
      expect(res).toEqual(rangeMockArray([1, 4, 3]));
    });
    test('ctrl 1 -> ctrl 3 -> select 2 => [1,3,2]', () => {
      const ms = multiFactory();
      let res;
      res = ms.select({ id: '1' });
      expect(res).toEqual([{ id: '1' }]);
      res = ms.select({ id: '3' });
      expect(res).toEqual([{ id: '1' }, { id: '3' }]);
      res = ms.select({ id: '2' });
      expect(res).toEqual(rangeMockArray([1, 3, 2]));
    });
  });
});
