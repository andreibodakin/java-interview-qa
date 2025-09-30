## Условие

Задача: Подсчёт частоты символов в строке

Условие:
Реализуйте метод charsFrequencyInString, который принимает строку и возвращает отображение (Map), где:

Ключ — символ из строки (Character)
Значение — количество раз, которое этот символ встречается в строке (Integer)
Если входная строка равна null, метод должен вернуть null.

## Решение

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<Character, Integer> charsMap = charsFrequencyInString("hello world!");

        if (charsMap != null) {
            System.out.println(charsMap);
        }
    }

    private static Map<Character, Integer> charsFrequencyInString(String s) {
        if (s == null) return null;

        Map<Character, Integer> frequency = new HashMap<>();

        for (char c : s.toCharArray()) {
            frequency.put(c, frequency.getOrDefault(c, 0) + 1);
        }

        return frequency;
    }
}
```
