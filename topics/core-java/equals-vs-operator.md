
## В чём разница между == и .equals()?

Оператор `==` сравнивает **ссылки** (адреса в памяти), а метод `.equals()` — **логическое равенство объектов**.

Для строк и обёрток примитивов (Integer, Long и т.д.) `.equals()` переопределён и сравнивает значения.

Пример:
```java
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b);      // false — разные объекты
System.out.println(a.equals(b)); // true — одинаковое содержимое
```
