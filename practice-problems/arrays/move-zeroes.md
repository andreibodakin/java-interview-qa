
## Переместить все нули в конец массива, сохраняя порядок остальных элементов

Дан массив `nums`. Переместите все нули в конец, сохранив относительный порядок ненулевых элементов.  
Решите **на месте** (без создания нового массива).

**Пример:**
```java
Input: [0,1,0,3,12]
Output: [1,3,12,0,0]
```
public void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int num : nums) {
        if (num != 0) {
            nums[insertPos++] = num;
        }
    }
    while (insertPos < nums.length) {
        nums[insertPos++] = 0;
    }
}
