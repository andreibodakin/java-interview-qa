
## Условие

Дан массив целых чисел `nums` и целое число `target`.  
Верните индексы двух чисел, сумма которых равна `target`.

**Пример:**
```java
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

## Решение

```java
// Решение через HashMap:

public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No solution");
}
// Сложность: O(n) по времени и памяти.
```
